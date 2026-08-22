const User = require("../models/User");
const Ad = require("../models/Ad");
const CreditTransaction = require("../models/CreditTransaction");
const AdTypeCost = require("../models/AdTypeCost");

const PUBLIC_USER_FIELDS =
    "accountId name phone isVerified lastLoginAt role creditBalance createdAt updatedAt";

exports.makeAgent = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: "agent" },
            { new: true, runValidators: true }
        ).select(PUBLIC_USER_FIELDS);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User is now an agent",
            user,
        });
    } catch (error) {
        console.error("Make Agent Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update user role",
            error: error.message,
        });
    }
};

exports.listAgents = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

        const [agents, total] = await Promise.all([
            User.find({ role: "agent" })
                .select(PUBLIC_USER_FIELDS)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            User.countDocuments({ role: "agent" }),
        ]);

        const agentsWithAdCounts = await Promise.all(
            agents.map(async (agent) => ({
                ...agent,
                adCount: await Ad.countDocuments({ user: agent._id }),
            }))
        );

        return res.status(200).json({
            success: true,
            agents: agentsWithAdCounts,
            total,
            page,
            limit,
            pages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
        console.error("List Agents Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch agents",
            error: error.message,
        });
    }
};

exports.topUpAgent = async (req, res) => {
    try {
        const amount = Number(req.body.amount);
        const description = (req.body.description || "").trim();

        if (!Number.isFinite(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Amount must be a positive number",
            });
        }

        const before = await User.findOne({ _id: req.params.id, role: "agent" });

        if (!before) {
            return res.status(404).json({
                success: false,
                message: "Agent not found",
            });
        }

        const updated = await User.findOneAndUpdate(
            { _id: req.params.id, role: "agent" },
            { $inc: { creditBalance: amount } },
            { new: true }
        ).select(PUBLIC_USER_FIELDS);

        await CreditTransaction.create({
            user: updated._id,
            type: "credit",
            amount,
            description: description || "Admin top-up",
            balanceBefore: before.creditBalance,
            balanceAfter: updated.creditBalance,
            admin: req.admin?._id || null,
        });

        return res.status(200).json({
            success: true,
            message: "Credits added successfully",
            user: updated,
        });
    } catch (error) {
        console.error("Top Up Agent Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to top up agent",
            error: error.message,
        });
    }
};

exports.getUserTransactions = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));

        const filter = { user: req.params.id };

        const [transactions, total] = await Promise.all([
            CreditTransaction.find(filter)
                .populate("ad", "adId title type")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            CreditTransaction.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            transactions,
            total,
            page,
            limit,
            pages: Math.max(1, Math.ceil(total / limit)),
        });
    } catch (error) {
        console.error("Get User Transactions Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch transactions",
            error: error.message,
        });
    }
};

const AD_TYPES_WITH_COST = ["Super Ad", "Normal Ad", "VIP Ad", "NRA Ad"];

exports.getAdTypeCosts = async (req, res) => {
    try {
        await Promise.all(
            AD_TYPES_WITH_COST.map((type) =>
                AdTypeCost.updateOne(
                    { type },
                    { $setOnInsert: { type, creditCost: 0 } },
                    { upsert: true }
                )
            )
        );

        const costs = await AdTypeCost.find({}).sort({ type: 1 }).lean();

        return res.status(200).json({
            success: true,
            costs,
        });
    } catch (error) {
        console.error("Get Ad Type Costs Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch ad type costs",
            error: error.message,
        });
    }
};

exports.updateAdTypeCost = async (req, res) => {
    try {
        const { type } = req.params;
        const creditCost = Number(req.body.creditCost);

        if (!AD_TYPES_WITH_COST.includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid ad type",
            });
        }

        if (!Number.isFinite(creditCost) || creditCost < 0) {
            return res.status(400).json({
                success: false,
                message: "Credit cost must be a non-negative number",
            });
        }

        const cost = await AdTypeCost.findOneAndUpdate(
            { type },
            { type, creditCost },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Ad type cost updated",
            cost,
        });
    } catch (error) {
        console.error("Update Ad Type Cost Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update ad type cost",
            error: error.message,
        });
    }
};
