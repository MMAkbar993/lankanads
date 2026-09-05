const SiteContent = require("../models/SiteContent");

// Blocks the admin panel always exposes for editing. Adding another SEO
// section later is just a new entry here — no schema or migration needed.
const KNOWN_KEYS = [
    { key: "home_seo", label: "Homepage SEO section" },
    { key: "footer_seo", label: "Footer SEO section" },
];

exports.getPublicSiteContent = async (req, res) => {
    try {
        const keys = (req.query.keys || "")
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean);

        const filter = { isActive: true };
        if (keys.length) filter.key = { $in: keys };

        const blocks = await SiteContent.find(filter)
            .select("key title content")
            .lean();

        // Returned keyed by `key` so the frontend can look a block up
        // directly instead of scanning an array.
        const contentByKey = blocks.reduce((acc, block) => {
            acc[block.key] = block;
            return acc;
        }, {});

        return res.status(200).json({ success: true, content: contentByKey });
    } catch (error) {
        console.error("Get Public Site Content Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch site content",
            error: error.message,
        });
    }
};

exports.getAdminSiteContent = async (req, res) => {
    try {
        const existing = await SiteContent.find({}).lean();
        const existingByKey = existing.reduce((acc, block) => {
            acc[block.key] = block;
            return acc;
        }, {});

        // Always return every known block so the admin form can render them
        // even before they've been saved for the first time.
        const blocks = KNOWN_KEYS.map(({ key, label }) => ({
            key,
            label,
            title: existingByKey[key]?.title ?? "",
            content: existingByKey[key]?.content ?? "",
            isActive: existingByKey[key]?.isActive ?? true,
        }));

        return res.status(200).json({ success: true, blocks });
    } catch (error) {
        console.error("Get Admin Site Content Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch site content",
            error: error.message,
        });
    }
};

exports.updateSiteContent = async (req, res) => {
    try {
        const { key } = req.params;
        const { title, content, isActive } = req.body;

        if (!KNOWN_KEYS.some((entry) => entry.key === key)) {
            return res.status(400).json({
                success: false,
                message: "Unknown content block",
            });
        }

        const block = await SiteContent.findOneAndUpdate(
            { key },
            {
                key,
                title: title ?? "",
                content: content ?? "",
                isActive: isActive === undefined ? true : Boolean(isActive),
            },
            { new: true, upsert: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Content updated successfully",
            block,
        });
    } catch (error) {
        console.error("Update Site Content Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update content",
            error: error.message,
        });
    }
};
