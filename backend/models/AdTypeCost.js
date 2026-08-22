const mongoose = require("mongoose");

const adTypeCostSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["Super Ad", "Normal Ad", "VIP Ad", "NRA Ad"],
            required: true,
            unique: true,
        },

        creditCost: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("AdTypeCost", adTypeCostSchema);
