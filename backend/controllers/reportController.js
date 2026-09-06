const AdReport = require("../models/AdReport");
const Ad = require("../models/Ad");

const { REPORT_REASONS } = AdReport;

// Public: anyone viewing an ad can report it, logged in or not. Nothing here
// is trusted from the client beyond the reason/message — the ad snapshot is
// read from the database.
exports.createReport = async (req, res) => {
    try {
        const { reason, message, reporterPhone } = req.body;

        if (!REPORT_REASONS.includes(reason)) {
            return res.status(400).json({
                success: false,
                message: "Please choose a valid reason.",
            });
        }

        const ad = await Ad.findById(req.params.id).select("adId title").lean();

        if (!ad) {
            return res.status(404).json({
                success: false,
                message: "Ad not found",
            });
        }

        // One pending report per ad per reporter phone, so a repeated click
        // (or a spam loop) doesn't flood the admin queue.
        if (reporterPhone) {
            const existing = await AdReport.findOne({
                ad: ad._id,
                reporterPhone,
                status: "pending",
            }).lean();

            if (existing) {
                return res.status(200).json({
                    success: true,
                    message: "You have already reported this ad. Thank you.",
                });
            }
        }

        await AdReport.create({
            ad: ad._id,
            adId: ad.adId || "",
            adTitle: ad.title || "",
            reason,
            message: (message || "").slice(0, 1000),
            reporter: req.user?._id || null,
            reporterPhone: reporterPhone || "",
        });

        return res.status(201).json({
            success: true,
            message: "Thank you. Our team will review this ad.",
        });
    } catch (error) {
        console.error("Create Ad Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit report",
            error: error.message,
        });
    }
};

exports.getReportReasons = async (req, res) => {
    return res.status(200).json({ success: true, reasons: REPORT_REASONS });
};

exports.getAdminReports = async (req, res) => {
    try {
        const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.status && req.query.status !== "all") {
            filter.status = req.query.status;
        }

        const [reports, total, pendingCount] = await Promise.all([
            AdReport.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate("ad", "adId title status type location")
                .populate("reporter", "accountId name phone")
                .lean(),
            AdReport.countDocuments(filter),
            AdReport.countDocuments({ status: "pending" }),
        ]);

        return res.status(200).json({
            success: true,
            reports,
            total,
            pendingCount,
            page,
            pages: Math.ceil(total / limit) || 1,
        });
    } catch (error) {
        console.error("Get Admin Reports Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch reports",
            error: error.message,
        });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["pending", "reviewed", "dismissed"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const report = await AdReport.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate("ad", "adId title status type location")
            .populate("reporter", "accountId name phone");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({ success: true, report });
    } catch (error) {
        console.error("Update Report Status Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update report",
            error: error.message,
        });
    }
};

exports.deleteReport = async (req, res) => {
    try {
        const report = await AdReport.findByIdAndDelete(req.params.id);

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Report deleted",
        });
    } catch (error) {
        console.error("Delete Report Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete report",
            error: error.message,
        });
    }
};
