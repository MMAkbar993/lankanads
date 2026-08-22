const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        accountId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        phone: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        name: {
            type: String,
            default: "",
        },

        isVerified: {
            type: Boolean,
            default: true,
        },

        lastLoginAt: {
            type: Date,
        },

        role: {
            type: String,
            enum: ["user", "agent"],
            default: "user",
            index: true,
        },

        creditBalance: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);