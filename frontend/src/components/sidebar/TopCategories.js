"use client";

import Link from "next/link";
import { IoWoman } from "react-icons/io5";
import { PiFlowerLotusFill } from "react-icons/pi";
import { TbMassage } from "react-icons/tb";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FaCrown, FaCarSide, FaHome } from "react-icons/fa";
import { HiBriefcase } from "react-icons/hi2";
import { BsGrid3X3GapFill } from "react-icons/bs";
import { HiArrowLongRight } from "react-icons/hi2";

const categories = [
    {
        id: 1,
        name: "Girls",
        ads: "12,458 Ads",
        icon: IoWoman,
        bg: "bg-pink-100",
        color: "text-pink-600",
        href: "/categories/all",
    },
    {
        id: 2,
        name: "Spa",
        ads: "2,345 Ads",
        icon: PiFlowerLotusFill,
        bg: "bg-purple-100",
        color: "text-purple-600",
        href: "/categories/all",
    },
    {
        id: 3,
        name: "Massage",
        ads: "3,567 Ads",
        icon: TbMassage,
        bg: "bg-orange-100",
        color: "text-orange-500",
        href: "/categories/all",
    },
    {
        id: 4,
        name: "Live Cam",
        ads: "1,234 Ads",
        icon: HiMiniVideoCamera,
        bg: "bg-blue-100",
        color: "text-blue-600",
        href: "/categories/all",
    },
    {
        id: 5,
        name: "VIP Ads",
        ads: "856 Ads",
        icon: FaCrown,
        bg: "bg-yellow-100",
        color: "text-yellow-500",
        href: "/categories/all",
    },
    {
        id: 6,
        name: "Jobs",
        ads: "2,345 Ads",
        icon: HiBriefcase,
        bg: "bg-green-100",
        color: "text-green-600",
        href: "/categories/all",
    },
    {
        id: 7,
        name: "Vehicles",
        ads: "5,678 Ads",
        icon: FaCarSide,
        bg: "bg-blue-100",
        color: "text-blue-700",
        href: "/categories/all",
    },
    {
        id: 8,
        name: "Property",
        ads: "4,321 Ads",
        icon: FaHome,
        bg: "bg-violet-100",
        color: "text-violet-600",
        href: "/categories/all",
    },
    {
        id: 9,
        name: "More",
        ads: "10+ Categories",
        icon: BsGrid3X3GapFill,
        bg: "bg-cyan-100",
        color: "text-cyan-600",
        href: "/categories",
    },
];

export default function TopCategories() {
    return (
        <section className="w-full px-5 mt-2">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                    Browse Categories
                </h2>

                <Link
                    href="/categories"
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 transition hover:text-[#FF0F87]"
                >
                    View all categories
                    <HiArrowLongRight className="text-lg" />
                </Link>
            </div>

            <div className="md:grid hidden grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9">
                {categories.map((item) => {
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className="group rounded-xl border border-gray-200 bg-white px-4 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FF0F87]/30 hover:shadow-lg"
                        >
                            <div
                                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${item.bg}`}
                            >
                                <Icon
                                    className={`${item.color} text-[30px] transition duration-300 group-hover:scale-110`}
                                />
                            </div>

                            <h3 className="text-center text-[16px] font-bold text-gray-900">
                                {item.name}
                            </h3>

                            <p className="mt-1 text-center text-[14px] text-gray-500">
                                {item.ads}
                            </p>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}