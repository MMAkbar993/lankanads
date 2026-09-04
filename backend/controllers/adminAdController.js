const Ad = require("../models/Ad");
const User = require("../models/User");
const AdTypeCost = require("../models/AdTypeCost");
const CreditTransaction = require("../models/CreditTransaction");
const { reverseApprovalCredit } = require("../utils/creditRefund");
const { withEffectiveType } = require("../utils/adTypeHelpers");

const allowedStatus = ["pending", "approved", "rejected"];

const getAllowedTypes = () => {
    return Ad.schema.path("type").enumValues;
};

exports.getAdminAds = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const skip = (page - 1) * limit;

        const search = req.query.search?.trim() || "";
        const category = req.query.category?.trim() || "";
        const status = req.query.status?.trim() || "";

        const filter = {};

        if (status) filter.status = status;

        if (category) {
            filter.category = { $regex: category, $options: "i" };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { adId: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },           
                { whatsappNumber: { $regex: search, $options: "i" } }, 
            ];
        }

        const [rawAds, total] = await Promise.all([
            // Sorted by submittedAt so republished ads surface at the top.
            // Not createdAt (never changes, so republished ads stay buried)
            // and not updatedAt (the hourly expiry/downgrade job touches it,
            // which would drag unrelated old ads back to the top).
            Ad.find(filter)
                .populate("user", "accountId phone name email role")
                .sort({ submittedAt: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Ad.countDocuments(filter),
        ]);

        const ads = rawAds.map(withEffectiveType);

        const pages = Math.ceil(total / limit) || 1;
        const adTypes = getAllowedTypes();

        return res.status(200).json({
            success: true,
            ads,
            total,
            page,
            pages,
            adTypes,
        });
    } catch (error) {
        console.error("Get Admin Ads Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch ads",
            error: error.message,
        });
    }
};

exports.updateAdStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ad status",
            });
        }

        if (status !== "approved") {
            const existingAd = await Ad.findById(req.params.id);

            if (!existingAd) {
                return res.status(404).json({
                    success: false,
                    message: "Ad not found",
                });
            }

            // Moving an already-approved (and charged) ad away from
            // "approved" — refund the agent before changing status.
            let refund = null;

            if (existingAd.status === "approved" && existingAd.creditCost) {
                refund = await reverseApprovalCredit(existingAd, req.admin?._id);
            }

            existingAd.status = status;
            await existingAd.save();

            const ad = await Ad.findById(existingAd._id)
                .populate("user", "accountId phone name email role")
                .lean();

            return res.status(200).json({
                success: true,
                message: refund
                    ? `Ad status updated — ${refund.refundAmount} credits refunded to agent`
                    : "Ad status updated successfully",
                ad: withEffectiveType(ad),
                refundedAmount: refund?.refundAmount ?? null,
                agentBalance: refund?.agentBalance ?? null,
            });
        }

        // Approval path — also handles agent credit deduction.
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Atomically claim the ad: only succeeds if it isn't already
        // approved, so a duplicate/concurrent approval request for the same
        // ad can never reach the deduction logic below more than once.
        // Allowing any non-approved starting status (not just "pending")
        // means an ad that was reverted to pending/rejected can be approved
        // — and charged — again later.
        const preClaimAd = await Ad.findOneAndUpdate(
            { _id: req.params.id, status: { $ne: "approved" } },
            { status: "approved", approvedAt: now, expiresAt },
            { new: false }
        );

        if (!preClaimAd) {
            const existing = await Ad.findById(req.params.id).lean();

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: "Ad not found",
                });
            }

            return res.status(409).json({
                success: false,
                message: "Ad is already approved",
            });
        }

        const owner = await User.findById(preClaimAd.user);

        if (!owner || owner.role !== "agent") {
            // Non-agent-owned ad — approval already happened above, nothing
            // else changes, behavior stays identical to before this feature.
            const ad = await Ad.findById(preClaimAd._id)
                .populate("user", "accountId phone name email role")
                .lean();

            return res.status(200).json({
                success: true,
                message: "Ad status updated successfully",
                ad: withEffectiveType(ad),
            });
        }

        const costDoc = await AdTypeCost.findOne({ type: preClaimAd.type });
        const cost = costDoc?.creditCost ?? 0;

        const debited = await User.findOneAndUpdate(
            { _id: owner._id, creditBalance: { $gte: cost } },
            { $inc: { creditBalance: -cost } },
            { new: true }
        );

        if (!debited) {
            // Insufficient balance — undo the claim so the ad goes back to
            // exactly its pre-approval state (whatever status it actually
            // had — pending or rejected). Safe: this request is the sole
            // owner of that status transition, nothing else could have
            // touched it in between.
            await Ad.findByIdAndUpdate(preClaimAd._id, {
                status: preClaimAd.status,
                approvedAt: preClaimAd.approvedAt ?? null,
                expiresAt: preClaimAd.expiresAt ?? null,
            });

            return res.status(400).json({
                success: false,
                message: `Agent has insufficient credits (needs ${cost}, has ${owner.creditBalance})`,
            });
        }

        try {
            await CreditTransaction.create({
                user: owner._id,
                type: "debit",
                amount: cost,
                ad: preClaimAd._id,
                description: `Ad approval: ${preClaimAd.adId} (${preClaimAd.type})`,
                balanceBefore: owner.creditBalance,
                balanceAfter: debited.creditBalance,
                admin: req.admin?._id || null,
            });
        } catch (ledgerError) {
            // The ledger entry is what makes the deduction auditable, so if
            // it can't be written we undo the whole approval rather than
            // leave money moved with no record of it.
            console.error("Credit ledger write failed:", ledgerError);

            await User.findByIdAndUpdate(owner._id, {
                $inc: { creditBalance: cost },
            });

            await Ad.findByIdAndUpdate(preClaimAd._id, {
                status: preClaimAd.status,
                approvedAt: preClaimAd.approvedAt ?? null,
                expiresAt: preClaimAd.expiresAt ?? null,
            });

            return res.status(500).json({
                success: false,
                message:
                    "Could not record the credit transaction — approval was rolled back and no credits were charged. Please try again.",
            });
        }

        const finalAd = await Ad.findByIdAndUpdate(
            preClaimAd._id,
            { creditCost: cost },
            { new: true }
        )
            .populate("user", "accountId phone name email role")
            .lean();

        return res.status(200).json({
            success: true,
            message: "Ad approved and credits deducted",
            ad: withEffectiveType(finalAd),
            agentBalance: debited.creditBalance,
        });
    } catch (error) {
        console.error("Update Ad Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update ad status",
            error: error.message,
        });
    }
};

exports.updateAdType = async (req, res) => {
    try {
        const { type } = req.body;
        const allowedTypes = getAllowedTypes();

        if (!allowedTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ad type",
            });
        }

        const ad = await Ad.findByIdAndUpdate(
            req.params.id,
            { type },
            { new: true, runValidators: true }
        )
            .populate("user", "accountId phone name email role")
            .lean();

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: "Ad not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ad type updated successfully",
            ad,
        });
    } catch (error) {
        console.error("Update Ad Type Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update ad type",
            error: error.message,
        });
    }
};

exports.updateAd = async (req, res) => {
    try {
        const { status, type } = req.body;

        const updateData = {};
        const allowedTypes = getAllowedTypes();

        if (status) {
            if (!allowedStatus.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid ad status",
                });
            }

            if (status === "approved") {
                return res.status(400).json({
                    success: false,
                    message:
                        "Use PATCH /admin/ads/:id/status to approve ads — it handles agent credit deduction.",
                });
            }

            updateData.status = status;
        }

        if (type) {
            if (!allowedTypes.includes(type)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid ad type",
                });
            }

            updateData.type = type;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided",
            });
        }

        const existingAd = await Ad.findById(req.params.id);

        if (!existingAd) {
            return res.status(404).json({
                success: false,
                message: "Ad not found",
            });
        }

        // Moving an already-approved (and charged) ad away from "approved"
        // through this generic endpoint — refund the agent first.
        let refund = null;

        if (
            updateData.status &&
            existingAd.status === "approved" &&
            existingAd.creditCost
        ) {
            refund = await reverseApprovalCredit(existingAd, req.admin?._id);
        }

        const ad = await Ad.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
            .populate("user", "accountId phone name email role")
            .lean();

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: "Ad not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: refund
                ? `Ad updated — ${refund.refundAmount} credits refunded to agent`
                : "Ad updated successfully",
            ad,
            refundedAmount: refund?.refundAmount ?? null,
            agentBalance: refund?.agentBalance ?? null,
        });
    } catch (error) {
        console.error("Update Ad Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update ad",
            error: error.message,
        });
    }
};