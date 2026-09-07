import { SITE_URL } from "@/lib/siteMeta";
import { getBlogs } from "@/lib/seoContent";
import { buildAdUrl } from "@/lib/adUrl";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Regenerated hourly. Google re-crawls a sitemap on its own schedule, so
// there's no value in rebuilding it per request.
export const revalidate = 3600;

const STATIC_ROUTES = [
    { path: "/", changeFrequency: "hourly", priority: 1 },
    { path: "/all-ads", changeFrequency: "hourly", priority: 0.9 },
    { path: "/categories", changeFrequency: "weekly", priority: 0.9 },
    { path: "/categories/all", changeFrequency: "hourly", priority: 0.9 },
    { path: "/cities", changeFrequency: "weekly", priority: 0.8 },
    { path: "/agents", changeFrequency: "weekly", priority: 0.8 },
    { path: "/post-ad", changeFrequency: "monthly", priority: 0.8 },
    { path: "/pricing", changeFrequency: "monthly", priority: 0.8 },
    { path: "/blog", changeFrequency: "daily", priority: 0.7 },
    { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/login", changeFrequency: "yearly", priority: 0.4 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-and-condition", changeFrequency: "yearly", priority: 0.3 },
];

// The public ads endpoint caps `limit` at 100 server-side, so the sitemap
// pages through it. Capped at maxPages overall — a sitemap file may hold at
// most 50,000 URLs and a bloated one gets crawled less thoroughly, so the
// newest ads are the ones worth listing.
async function getSitemapAds({ perPage = 100, maxPages = 20 } = {}) {
    if (!API_BASE_URL) return [];

    const collected = [];

    for (let page = 1; page <= maxPages; page += 1) {
        try {
            const res = await fetch(
                `${API_BASE_URL}/api/ads/public?page=${page}&limit=${perPage}`,
                { next: { revalidate: 3600 } }
            );

            if (!res.ok) break;

            const data = await res.json();
            const ads = data?.ads || [];

            collected.push(...ads);

            if (!data?.hasNextPage || ads.length === 0) break;
        } catch {
            // Partial sitemap beats no sitemap — keep whatever was fetched.
            break;
        }
    }

    return collected;
}

export default async function sitemap() {
    const now = new Date();

    const staticEntries = STATIC_ROUTES.map((route) => ({
        url: `${SITE_URL}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
    }));

    // The public blog endpoint caps `limit` at 50.
    const [ads, { blogs }] = await Promise.all([
        getSitemapAds(),
        getBlogs({ page: 1, limit: 50, revalidate: 3600 }),
    ]);

    const adEntries = ads
        .filter((ad) => ad?.adId)
        .map((ad) => ({
            url: `${SITE_URL}${buildAdUrl(ad)}`,
            lastModified: new Date(ad.approvedAt || ad.updatedAt || now),
            changeFrequency: "weekly",
            priority: 0.7,
        }));

    const blogEntries = blogs
        .filter((blog) => blog?.slug)
        .map((blog) => ({
            url: `${SITE_URL}/blog/${blog.slug}`,
            lastModified: new Date(blog.publishedAt || blog.createdAt || now),
            changeFrequency: "monthly",
            priority: 0.6,
        }));

    return [...staticEntries, ...adEntries, ...blogEntries];
}
