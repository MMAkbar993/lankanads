const express = require("express");
const { sendOtp, verifyOtp, verifyOtpOnly } = require("../controllers/authController");

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/verify-otp-only", verifyOtpOnly);

module.exports = router;