const express = require("express");

const {
    getAdminReports,
    updateReportStatus,
    deleteReport,
} = require("../controllers/reportController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protectAdmin);

router.get("/", getAdminReports);
router.patch("/:id", updateReportStatus);
router.delete("/:id", deleteReport);

module.exports = router;
