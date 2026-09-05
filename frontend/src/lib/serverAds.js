const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Server-side single-ad fetch used by the SEO ad route. Accepts either the
// public adId (from /ads/... URLs) or a Mongo _id (legacy links) — the
// backend resolves both.
export async function getPublicAd(identifier) {
    try {
        if (!API_BASE_URL || !identifier) return null;

        const res = await fetch(
            `${API_BASE_URL}/api/ads/public/${encodeURIComponent(identifier)}`,
            { cache: "no-store" }
        );

        if (!res.ok) return null;

        const data = await res.json();

        return data?.ad || null;
    } catch {
        return null;
    }
}
