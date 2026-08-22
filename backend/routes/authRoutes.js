const express = require("express");
const { sendOtp, verifyOtp, verifyOtpOnly, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/verify-otp-only", verifyOtpOnly);
router.get("/me", protect, getMe);

module.exports = router;