"use client";

import { usePathname } from "next/navigation";
import TopCategory from "@/components/sidebar/TopCategories";

export default function ConditionalTopCategory() {
    const pathname = usePathname();
    if (pathname === "/portal") return null;
    return <TopCategory />;
}