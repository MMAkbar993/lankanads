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

module.exports = mongoose.model("CreditTransaction", creditTransactionSchema);
