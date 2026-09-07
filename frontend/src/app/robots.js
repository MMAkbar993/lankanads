import { SITE_URL } from "@/lib/siteMeta";

export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                // Logged-in-only areas: nothing here is useful in search
                // results and crawling them just wastes crawl budget.
                disallow: ["/portal", "/portal/", "/saved-ads"],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
