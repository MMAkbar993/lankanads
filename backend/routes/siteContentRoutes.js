const express = require("express");

const {
    getPublicSiteContent,
    getAdminSiteContent,
    updateSiteContent,
} = require("../controllers/siteContentController");

const { protectAdmin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public read — used by the frontend footer/homepage SEO sections.
router.get("/public", getPublicSiteContent);

// Admin editing.
router.get("/", protectAdmin, getAdminSiteContent);
router.patch("/:key", protectAdmin, updateSiteContent);

module.exports = router;
