const mongoose = require("mongoose");

const creditTransactionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        type: {
            type: String,
            enum: ["credit", "debit"],
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0,
        },

        ad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ad",
            default: null,
            index: true,
        },

        description: {
            type: String,
            default: "",
        },

        balanceBefore: {
            type: Number,
            required: true,
        },

        balanceAfter: {
            type: Number,
            required: true,
        },

        admin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Admin",
            default: null,
        },
    },
    { timestamps: true }
);

// Hard backstop: at most one debit transaction can ever exist per ad,
// regardless of how the application-level guards behave.
creditTransactionSchema.index(
    { ad: 1, type: 1 },
    {
        unique: true,
        partialFilterExpression: { type: "debit", ad: { $type: "objectId" } },
    }
);

module.exports = mongoose.model("CreditTransaction", creditTransactionSchema);
