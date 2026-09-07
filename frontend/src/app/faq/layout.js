import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta({
    title: "Lankan Ads FAQ | Sri Lanka Ads Posting Guide | Learn More",
    description:
        "Got questions about posting ads? Explore the Lankan Ads FAQ page to find quick answers about our classified platform, account settings, and much more.",
    path: "/faq",
});

export default function FaqLayout({ children }) {
    return children;
}
