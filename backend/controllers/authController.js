const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const Otp = require("../models/Otp");
const Counter = require("../models/Counter");
const sendSms = require("../utils/sendSms");

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const hashOtp = (otp) => {
    return crypto.createHash("sha256").update(otp).digest("hex");
};

const generateAccountId = async () => {
    const counter = await Counter.findOneAndUpdate(
        { name: "userAccountId" },
        { $inc: { seq: 1 } },
        {
            new: true,
            upsert: true,
        }
    );

    return `LA${counter.seq}`;
};

exports.sendOtp = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }

        const otp = generateOtp();
        const hashedOtp = hashOtp(otp);

        await Otp.deleteMany({ phone });

        await Otp.create({
            phone,
            otp: hashedOtp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        });

        const smsResponse = await sendSms({
            phone,
            message: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
        });

        return res.json({
            success: true,
            message: "OTP sent successfully",
            sms: smsResponse,
        });
    } catch (error) {
        console.error("Send OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to send OTP",
            reason: error.message,
            providerStatusCode: error.statusCode || null,
            providerResponse: error.providerResponse || null,
        });
    }
};
// exports.sendOtp = async (req, res) => {
//     try {
//         const { phone } = req.body;

//         if (!phone) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Phone number is required",
//             });
//         }

//         const isDev = true;
//         const otp = isDev ? "123456" : generateOtp();
//         const hashedOtp = hashOtp(otp);

//         await Otp.deleteMany({ phone });

//         await Otp.create({
//             phone,
//             otp: hashedOtp,
//             expiresAt: new Date(Date.now() + 5 * 60 * 1000),
//         });

//         if (!isDev) {
//             await sendSms({
//                 phone,
//                 message: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
//             });
//         }

//         return res.json({
//             success: true,
//             message: isDev ? "DEV MODE: OTP is 123456" : "OTP sent successfully",
//         });
//     } catch (error) {
//         console.error("Send OTP error:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Failed to send OTP",
//             reason: error.message,
//         });
//     }
// };
// Shared by verifyOtp (login) and verifyOtpOnly (ad contact-number
// verification) — checks the OTP and consumes it, without deciding what
// happens after a valid verification (that differs per caller).
const checkAndConsumeOtp = async (phone, otp) => {
    const otpDoc = await Otp.findOne({ phone });

    if (!otpDoc) {
        return { ok: false, status: 400, message: "OTP not found. Please request again." };
    }

    if (otpDoc.expiresAt < new Date()) {
        await Otp.deleteOne({ _id: otpDoc._id });
        return { ok: false, status: 400, message: "OTP expired. Please request again." };
    }

    if (otpDoc.otp !== hashOtp(otp)) {
        return { ok: false, status: 400, message: "Invalid OTP" };
    }

    await Otp.deleteOne({ _id: otpDoc._id });
    return { ok: true };
};

// Verifies an OTP for a phone number without logging in/creating a user —
// used when a user wants to prove ownership of a number to use as an ad's
// display contact number, which should not affect their account/session.
exports.verifyOtpOnly = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required",
            });
        }

        const result = await checkAndConsumeOtp(phone, otp);

        if (!result.ok) {
            return res.status(result.status).json({
                success: false,
                message: result.message,
            });
        }

        return res.json({
            success: true,
            message: "Phone number verified",
        });
    } catch (error) {
        console.error("Verify OTP Only error:", error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message,
        });
    }
};

// Returns the caller's own current User doc — lets the frontend pick up
// server-side changes (e.g. an admin top-up or role change) without
// requiring the user to log out and back in.
exports.getMe = async (req, res) => {
    return res.json({
        success: true,
        user: req.user,
    });
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({
                success: false,
                message: "Phone and OTP are required",
            });
        }

        const result = await checkAndConsumeOtp(phone, otp);

        if (!result.ok) {
            return res.status(result.status).json({
                success: false,
                message: result.message,
            });
        }

        let user = await User.findOne({ phone });

        if (!user) {
            const accountId = await generateAccountId();

            user = await User.create({
                accountId,
                phone,
                isVerified: true,
                lastLoginAt: new Date(),
            });
        } else {
            if (!user.accountId) {
                user.accountId = await generateAccountId();
            }

            user.lastLoginAt = new Date();
            await user.save();
        }

        const token = jwt.sign(
            {
                userId: user._id,
                accountId: user.accountId,
                phone: user.phone,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            user,
        });
    } catch (error) {
        console.error("Verify OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "OTP verification failed",
            error: error.message,
        });
    }
};