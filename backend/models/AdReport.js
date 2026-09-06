const mongoose = require("mongoose");

const REPORT_REASONS = [
    "Fake or scam ad",
    "Wrong or fake phone number",
    "Offensive or illegal content",
    "Duplicate ad",
    "Wrong category",
    "Other",
];

const adReportSchema = new mongoose.Schema(
    {
        ad: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ad",
            required: true,
            index: true,
        },

        // Snapshot of the public ad ID and title at report time, so the admin
        // queue still reads sensibly if the ad is later deleted.
        adId: { type: String, default: "" },
        adTitle: { type: String, default: "" },

        reason: {
            type: String,
            enum: REPORT_REASONS,
            required: true,
        },

        message: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },

        // Optional — reports are open to logged-out visitors too.
        reporter: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reporterPhone: { type: String, default: "", trim: true },

        status: {
            type: String,
            enum: ["pending", "reviewed", "dismissed"],
            default: "pending",
            index: true,
        },
    },
    { timestamps: true }
);

adReportSchema.index({ status: 1, createdAt: -1 });

const AdReport = mongoose.model("AdReport", adReportSchema);

module.exports = AdReport;
module.exports.REPORT_REASONS = REPORT_REASONS;
