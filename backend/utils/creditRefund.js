const User = require("../models/User");
const CreditTransaction = require("../models/CreditTransaction");

// Refunds a previously-charged approval when an approved ad stops being
// approved — whether that's an admin reverting its status, or a user
// republishing it (both take the ad out of "approved"). Only agent-owned
// ads ever have `creditCost` set, so this is a no-op for everyone else.
// Callers must call this once, immediately before actually changing the
// ad's status/fields away from "approved" — that ordering is what prevents
// double-refunding the same charge.
const reverseApprovalCredit = async (ad, adminId) => {
    if (!ad.creditCost) return null;

    const owner = await User.findById(ad.user);

    if (!owner) {
        // Owner deleted or missing — nothing sane to refund into. Still
        // clear creditCost so a future approval charges fresh rather than
        // silently "remembering" a charge that can never be reconciled.
        ad.creditCost = null;
        await ad.save();
        return null;
    }

    const refundAmount = ad.creditCost;
    const balanceBefore = owner.creditBalance;

    const updatedOwner = await User.findOneAndUpdate(
        { _id: owner._id },
        { $inc: { creditBalance: refundAmount } },
        { new: true }
    );

    await CreditTransaction.create({
        user: owner._id,
        type: "credit",
        amount: refundAmount,
        ad: ad._id,
        description: `Approval cancelled/reversed: ${ad.adId}`,
        balanceBefore,
        balanceAfter: updatedOwner.creditBalance,
        admin: adminId || null,
    });

    ad.creditCost = null;
    await ad.save();

    return { refundAmount, agentBalance: updatedOwner.creditBalance };
};

module.exports = { reverseApprovalCredit };
