"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

const categories = [
    "Girls Personal",
    "Live Cam",
    "Spa & Wellness Services",
    "Boys Personal",
];

export default function CategoryList() {
    return (
        <div className="rounded-md border border-slate-300 bg-white p-5">
            <div className="mb-5">
                <h2 className="text-[18px] font-bold text-slate-800">
                    Top Categories
                </h2>

                <div className="mt-2 h-1 w-12 rounded-full bg-red-600" />
            </div>

            <ul className="space-y-4">
                {categories.map((category) => (
                    <li key={category}>
                        <Link
                            href={`/all-ads?category=${encodeURIComponent(
                                category
                            )}`}
                            className="group flex items-center gap-3"
                        >
                            <Flame
                                size={15}
                                className="text-red-600"
                            />

                            <span className="text-[15px] font-medium text-slate-600 group-hover:text-red-600">
                                {category}
                            </span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}