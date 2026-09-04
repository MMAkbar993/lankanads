// Shared between adController.js (public listings) and adminAdController.js
// (admin listings) so both agree on exactly what "24 hours" means — no risk
// of the two drifting out of sync with separate copies of this constant.
const PREMIUM_WINDOW_MS = 24 * 60 * 60 * 1000;

// Computes what an ad's type should display as *right now*, independent of
// whether adScheduler.js's hourly downgrade job has already updated the
// stored `type` field to match. Without this, an ad's VIP/Super badge can
// keep showing for up to an hour after its real 24h window has passed.
const getEffectiveType = (ad, now = new Date()) => {
    if (!ad || (ad.type !== "VIP Ad" && ad.type !== "Super Ad")) {
        return ad?.type;
    }

    if (!ad.approvedAt) return ad.type;

    const ageMs = now.getTime() - new Date(ad.approvedAt).getTime();

    return ageMs > PREMIUM_WINDOW_MS ? "Normal Ad" : ad.type;
};

// Returns a shallow copy of a lean/plain ad object with `type` corrected to
// its live effective value. Never mutates the input or touches the DB —
// safe to apply to any ad object right before sending it in a response.
const withEffectiveType = (ad) => {
    if (!ad) return ad;

    return { ...ad, type: getEffectiveType(ad) };
};

module.exports = { PREMIUM_WINDOW_MS, getEffectiveType, withEffectiveType };
