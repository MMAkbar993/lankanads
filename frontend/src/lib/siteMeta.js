// Central SEO constants. The canonical host lives in NEXT_PUBLIC_SITE_URL —
// it must match whichever host the server actually serves (www vs non-www),
// otherwise every canonical tag on the site points at the wrong address.
export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.lankanadslk.com";

export const SITE_NAME = "Lankan AdsLK";

// Verification token issued by Google Search Console. Next renders this as
// <meta name="google-site-verification" ...> in <head>.
export const GOOGLE_SITE_VERIFICATION =
    "c7Xmi_OBkr_JYBzxEvJ92vGrbRv8u3w70t9ScInTwKs";

// Organization schema. The logo is served from /public rather than through
// /_next/image, so the URL stays stable across rebuilds.
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Lankan AdsLK",
    alternateName: "Lankan AdsLK Sri Lanka's Premium Ads Platform",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/logo.png`,
    sameAs: [
        process.env.NEXT_PUBLIC_FACEBOOK_URL,
        process.env.NEXT_PUBLIC_TELEGRAM_URL,
    ].filter(Boolean),
};

// Site-wide search box in Google's result snippet.
export const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    potentialAction: {
        "@type": "SearchAction",
        target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/categories/all?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
    },
};

/**
 * Builds a page's metadata export from the SEO sheet's title/description,
 * wiring up the canonical URL and OpenGraph tags consistently.
 */
export function pageMeta({ title, description, path = "/" }) {
    const canonical = `${SITE_URL}${path}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: SITE_NAME,
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
        },
    };
}
