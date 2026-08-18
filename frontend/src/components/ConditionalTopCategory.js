"use client";

import { usePathname } from "next/navigation";
import TopCategory from "@/components/sidebar/TopCategories";

const HIDDEN_ON = ["/portal", "/portal/new-ad", "/portal/top-up"];

export default function ConditionalTopCategory() {
    const pathname = usePathname();
    if (HIDDEN_ON.includes(pathname)) return null;
    return <TopCategory />;
}