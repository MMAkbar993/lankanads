require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const adRoutes = require("./routes/adRoutes");
const agentRoutes = require("./routes/agentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const adminAgentRoutes = require("./routes/adminAgentRoutes");
const adminAdRoutes = require("./routes/adminAdRoutes");
const adminDashboardRoutes = require("./routes/adminDashboardRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const cronRoutes = require("./routes/cronRoutes");

const { startScheduler } = require("./utils/adScheduler");

// Vercel sets this automatically at runtime.
const isVercel = !!process.env.VERCEL;

const CreditTransaction = require("./models/CreditTransaction");

// An earlier version of CreditTransaction had a unique index that assumed an
// ad could only ever be charged once. Re-approving an ad (after a revert or
// republish) legitimately writes a second debit, which that index rejects —
// deducting the balance but failing to record it. Mongoose doesn't drop
// indexes it no longer declares, so sync them explicitly on boot.
const syncCreditIndexes = async () => {
    try {
        await CreditTransaction.syncIndexes();
    } catch (error) {
        console.error("CreditTransaction index sync failed:", error.message);
    }
};

connectDB()
    .then(syncCreditIndexes)
    .catch((error) => {
        console.error("Initial MongoDB connection failed:", error.message);
    });

if (!isVercel) {
    // node-cron needs a long-running process to fire on schedule, which
    // Vercel's serverless functions don't provide. On Vercel, the same jobs
    // run instead via a Vercel Cron Job hitting /api/cron/expire-ads.
    startScheduler();
}

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("Backend running 1");
});

// Ensures the (cached) DB connection is ready before any route runs a
// query — matters most on a cold serverless start.
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(503).json({
            success: false,
            message: "Database unavailable",
        });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/ads", adRoutes);
app.use("/api/agents", agentRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/agents", adminAgentRoutes);
app.use("/admin/ads", adminAdRoutes);
app.use("/admin/dashboard", adminDashboardRoutes);
app.use("/api/contact", contactRoutes);
app.use('/api/admin', adminUserRoutes);
app.use("/api/cron", cronRoutes);

const PORT = process.env.PORT || 5000;

if (!isVercel) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;