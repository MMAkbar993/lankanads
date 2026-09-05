// SEO-friendly ad URLs: /ads/{location}/{title}-{adId}
//
// The slug parts are derived from the ad's own title/location rather than
// stored, so every existing ad gets a proper URL with no migration, and an
// edited title simply produces a new URL. Resolution always happens on the
// trailing ad ID, so older links keep working after any title/location edit.

export function slugify(value = "") {
    return String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
}

export function buildAdUrl(ad) {
    if (!ad) return "/all-ads";

    const identifier = ad.adId || ad._id;

    // No adId (very old records) — fall back to the legacy route, which
    // redirects to the canonical URL anyway.
    if (!ad.adId) return `/all-ads/${ad._id}`;

    const location = slugify(ad.location) || "sri-lanka";
    const title = slugify(ad.title) || "ad";

    return `/ads/${location}/${title}-${String(identifier).toLowerCase()}`;
}

// Pulls the ad ID back out of the slug segment — it's always the last
// dash-separated token (e.g. "professional-spa-service-ad123" -> "ad123").
export function extractAdId(slug = "") {
    const parts = String(slug).split("-");
    return parts[parts.length - 1] || "";
}
