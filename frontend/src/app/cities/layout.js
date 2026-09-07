import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta({
    title: "Sri Lanka Ads by City | Find Local Ads Online | Lankan Ads",
    description:
        "Looking for local deals? Browse Sri Lanka Ads by City on Lankan Ads. Find buyers and sellers in your area easily. Explore local listings today!",
    path: "/cities",
});

export default function CitiesLayout({ children }) {
    return children;
}
