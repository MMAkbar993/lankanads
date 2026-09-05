const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        // SEO-friendly URL segment, generated from the title on create and
        // kept stable afterwards so published links never break.
        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
        },

        excerpt: {
            type: String,
            default: "",
            trim: true,
        },

        content: {
            type: String,
            required: true,
        },

        coverImage: {
            url: { type: String, default: "" },
            filename: { type: String, default: "" },
        },

        // Falls back to title/excerpt when left blank — see blogController.
        metaTitle: {
            type: String,
            default: "",
            trim: true,
        },

        metaDescription: {
            type: String,
            default: "",
            trim: true,
        },

        status: {
            type: String,
            enum: ["draft", "published"],
            default: "draft",
            index: true,
        },

        publishedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

blogSchema.index({ status: 1, publishedAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);
