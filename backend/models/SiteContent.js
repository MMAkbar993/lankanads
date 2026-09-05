const mongoose = require("mongoose");

// Free-form, admin-editable content blocks addressed by a stable key —
// used for the SEO copy the SEO team supplies (homepage section, footer
// section, etc). Adding a new block is just a new key, no schema change.
const siteContentSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },

        // Optional heading rendered above the content.
        title: {
            type: String,
            default: "",
            trim: true,
        },

        content: {
            type: String,
            default: "",
        },

        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("SiteContent", siteContentSchema);
