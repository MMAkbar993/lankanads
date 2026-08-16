import Image from "next/image";
import Link from "next/link";
import BannerImage from "@/assets/images/CategoryBanner.webp";

import {
    FaCrown,
    FaCarSide,
    FaHome,
    FaBriefcase,
    FaMobileAlt,
    FaTools,
} from "react-icons/fa";
import { IoWoman } from "react-icons/io5";
import { PiFlowerLotusFill } from "react-icons/pi";
import { TbMassage } from "react-icons/tb";
import { HiMiniVideoCamera } from "react-icons/hi2";
import { FiChevronRight, FiArrowRight } from "react-icons/fi";

const categories = [
    {
        name: "Girls Personal",
        ads: "12,458 Ads",
        desc: "Find personal ads posted by verified users across Sri Lanka.",
        icon: IoWoman,
        bg: "bg-pink-100",
        color: "text-pink-600",
        href: "/categories/girls-personal",
    },
    {
        name: "Spa & Wellness Services",
        ads: "2,345 Ads",
        desc: "Discover spa, wellness and beauty services near you.",
        icon: PiFlowerLotusFill,
        bg: "bg-purple-100",
        color: "text-purple-600",
        href: "/categories/spa-wellness-services",
    },
    {
        name: "Massage",
        ads: "3,567 Ads",
        desc: "Professional massage and relaxation services.",
        icon: TbMassage,
        bg: "bg-orange-100",
        color: "text-orange-500",
        href: "/categories/massage",
    },
    {
        name: "Live Cam",
        ads: "1,234 Ads",
        desc: "Live cam shows and entertainment.",
        icon: HiMiniVideoCamera,
        bg: "bg-blue-100",
        color: "text-blue-600",
        href: "/categories/live-cam",
    },
    {
        name: "VIP Ads",
        ads: "856 Ads",
        desc: "Premium ads for maximum visibility and reach.",
        icon: FaCrown,
        bg: "bg-yellow-100",
        color: "text-yellow-500",
        href: "/categories/vip-ads",
    },
    {
        name: "Jobs",
        ads: "2,345 Ads",
        desc: "Find job opportunities across Sri Lanka.",
        icon: FaBriefcase,
        bg: "bg-green-100",
        color: "text-green-600",
        href: "/categories/jobs",
    },
    {
        name: "Vehicles",
        ads: "5,678 Ads",
        desc: "Buy and sell cars, bikes and other vehicles.",
        icon: FaCarSide,
        bg: "bg-blue-100",
        color: "text-blue-700",
        href: "/categories/vehicles",
    },
    {
        name: "Property",
        ads: "4,321 Ads",
        desc: "Houses, apartments and lands for sale or rent.",
        icon: FaHome,
        bg: "bg-violet-100",
        color: "text-violet-600",
        href: "/categories/property",
    },
    {
        name: "Electronics",
        ads: "2,189 Ads",
        desc: "Buy and sell phones, gadgets and electronics.",
        icon: FaMobileAlt,
        bg: "bg-pink-100",
        color: "text-pink-600",
        href: "/categories/electronics",
    },
    {
        name: "Services",
        ads: "1,987 Ads",
        desc: "Find local services and service providers.",
        icon: FaTools,
        bg: "bg-teal-100",
        color: "text-teal-600",
        href: "/categories/services",
    },
];

export default function Categories() {
    return (
        <main className="min-h-screen bg-[#f8f8fb]">
            <section className="relative h-[175px] overflow-hidden bg-[#140b2f]">
                <Image
                    src={BannerImage}
                    alt="Categories banner"
                    fill
                    priority
                    className="object-cover opacity-60"
                />

                <div className="absolute inset-0 bg-black/35" />

                <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6">
                    <div className="flex items-center gap-2 pt-7 text-[13px] text-white/80">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <FiChevronRight />
                        <span>Categories</span>
                    </div>

                    <div className="flex flex-1 flex-col items-center justify-center text-center pb-5">
                        <h1 className="text-[26px] font-bold text-white sm:text-[42px]">
                            Categories
                        </h1>
                        <p className="mt-2 text-[15px] font-medium text-white">
                            Browse all advertisement categories available on LankanAdsLK
                        </p>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {categories.map((item) => {
                        const Icon = item.icon;

                        return (
                            <div
                                key={item.name}
                                className="flex h-full min-h-[280px] flex-col rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div
                                    className={`mx-auto flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full ${item.bg}`}
                                >
                                    <Icon className={`${item.color} text-[36px]`} />
                                </div>

                                <h2 className="mt-5 min-h-[56px] text-[20px] font-bold leading-7 text-gray-900">
                                    {item.name}
                                </h2>

                                <p className="mt-1 text-[15px] font-bold text-gray-700">
                                    {item.ads}
                                </p>

                                <p className="mx-auto mt-3 max-w-[210px] flex-1 text-[14px] leading-6 text-gray-600">
                                    {item.desc}
                                </p>

                                <Link
                                    href="/categories/all"
                                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-pink-200 text-[14px] font-bold text-[#FF0F87] transition hover:border-[#FF0F87] hover:bg-pink-50"
                                >
                                    Browse Ads
                                    <FiArrowRight />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}