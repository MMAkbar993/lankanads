import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta({
    title: "All Ad Categories | Browse All Sri Lanka Ads | Lankan Ads",
    description:
        "Explore All Ad Categories on Lankan Ads. Browse our complete directory to find the best deals or post your ads across various Sri Lanka categories!",
    path: "/categories/all",
});

export default function AllCategoriesLayout({ children }) {
    return children;
}
