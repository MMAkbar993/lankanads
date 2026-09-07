import { pageMeta } from "@/lib/siteMeta";

// page.js here is a client component, which can't export `metadata` — this
// route-level layout carries the SEO tags instead. Same pattern is used for
// the other interactive pages (login, contact-us, cities, faq, agents,
// categories/all).
export const metadata = pageMeta({
    title: "Post an Advertisement | Sri Lanka Advertisement Website",
    description:
        "Easily Post an Advertisement today on LankaNads! We are a Reliable Ad Posting Platform Sri Lanka. Join now to Post Ads Online and grow your business.",
    path: "/post-ad",
});

export default function PostAdLayout({ children }) {
    return children;
}
