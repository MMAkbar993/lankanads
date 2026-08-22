const Ad = require("../models/Ad");
const User = require("../models/User");
const AdTypeCost = require("../models/AdTypeCost");
const CreditTransaction = require("../models/CreditTransaction");

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

        const [ads, total] = await Promise.all([
            Ad.find(filter)
                .populate("user", "accountId phone name email role")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            Ad.countDocuments(filter),
        ]);

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
            const ad = await Ad.findByIdAndUpdate(
                req.params.id,
                { status },
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
                message: "Ad status updated successfully",
                ad,
            });
        }

        // Approval path — also handles agent credit deduction.
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        // Atomically claim the ad: only succeeds if it's still pending, so a
        // duplicate/concurrent approval request for the same ad can never
        // reach the deduction logic below more than once.
        const claimedAd = await Ad.findOneAndUpdate(
            { _id: req.params.id, status: "pending" },
            { status: "approved", approvedAt: now, expiresAt },
            { new: true }
        );

        if (!claimedAd) {
            const existing = await Ad.findById(req.params.id).lean();

            if (!existing) {
                return res.status(404).json({
                    success: false,
                    message: "Ad not found",
                });
            }

            return res.status(409).json({
                success: false,
                message: "Ad is not pending — it may have already been approved",
            });
        }

        const owner = await User.findById(claimedAd.user);

        if (!owner || owner.role !== "agent") {
            // Non-agent-owned ad — approval already happened above, nothing
            // else changes, behavior stays identical to before this feature.
            const ad = await Ad.findById(claimedAd._id)
                .populate("user", "accountId phone name email role")
                .lean();

            return res.status(200).json({
                success: true,
                message: "Ad status updated successfully",
                ad,
            });
        }

        const costDoc = await AdTypeCost.findOne({ type: claimedAd.type });
        const cost = costDoc?.creditCost ?? 0;

        const debited = await User.findOneAndUpdate(
            { _id: owner._id, creditBalance: { $gte: cost } },
            { $inc: { creditBalance: -cost } },
            { new: true }
        );

        if (!debited) {
            // Insufficient balance — undo the claim so the ad goes back to
            // exactly its pre-approval state. Safe: this request is the sole
            // owner of the pending->approved transition, nothing else could
            // have touched it in between.
            await Ad.findByIdAndUpdate(claimedAd._id, {
                status: "pending",
                approvedAt: null,
                expiresAt: null,
            });

            return res.status(400).json({
                success: false,
                message: `Agent has insufficient credits (needs ${cost}, has ${owner.creditBalance})`,
            });
        }

        await CreditTransaction.create({
            user: owner._id,
            type: "debit",
            amount: cost,
            ad: claimedAd._id,
            description: `Ad approval: ${claimedAd.adId} (${claimedAd.type})`,
            balanceBefore: owner.creditBalance,
            balanceAfter: debited.creditBalance,
            admin: req.admin?._id || null,
        });

        const finalAd = await Ad.findByIdAndUpdate(
            claimedAd._id,
            { creditCost: cost },
            { new: true }
        )
            .populate("user", "accountId phone name email role")
            .lean();

        return res.status(200).json({
            success: true,
            message: "Ad approved and credits deducted",
            ad: finalAd,
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
            message: "Ad updated successfully",
            ad,
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