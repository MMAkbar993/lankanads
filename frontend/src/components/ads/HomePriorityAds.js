"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHomeAds } from "@/../redux/features/homeAdsSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const sections = [
    {
        key: "vip",
        title: "VIP Advertisements",
        viewText: "View all VIP ads",
        href: "/categories/all?type=VIP+Ad",
        icon: "🔥",
        badge: "👑 VIP",
        ribbon: "VIP",
        headerClass: "text-orange-500",
        cardClass: "border-orange-300 bg-gradient-to-r from-orange-50 to-white",
        badgeClass: "border-orange-300 bg-orange-50 text-orange-500",
        ribbonClass: "bg-orange-500 text-white",
    },
    {
        key: "super",
        title: "Super Advertisements",
        viewText: "View all Super ads",
        href: "/categories/all?type=Super+Ad",
        icon: "⭐",
        badge: "⭐ SUPER",
        ribbon: "SUPER",
        headerClass: "text-orange-500",
        cardClass: "border-pink-300 bg-gradient-to-r from-pink-50 to-white",
        badgeClass: "border-pink-300 bg-pink-50 text-pink-500",
        ribbonClass: "bg-pink-500 text-white",
    },
    {
        key: "normal",
        title: "Normal Advertisements",
        viewText: "View all ads",
        href: "/categories/all?type=Normal+Ad",
        icon: "⚪",
        badge: "NORMAL",
        ribbon: "NORMAL",
        headerClass: "text-gray-400",
        cardClass: "border-gray-200 bg-white",
        badgeClass: "border-gray-200 bg-gray-50 text-gray-500",
        ribbonClass: "bg-gray-500 text-white",
    },
];

export default function HomePriorityAds({ limit = 1 }) {
    const dispatch = useDispatch();

    const {
        vip,
        super: superAds,
        normal,
        loading,
        initialized,
        error,
    } = useSelector((state) => state.homeAds);

    useEffect(() => {
        dispatch(getHomeAds({ limit }));
    }, [dispatch, limit]);

    const data = {
        vip,
        super: superAds,
        normal,
    };

    const hasAnyAds = sections.some((section) => {
        return data[section.key]?.ads?.length > 0;
    });

    /**
     * Main fix:
     * First render-e loading false thakte pare.
     * Tai initialized false hole skeleton show korte hobe.
     */
    if (!initialized || (loading && !hasAnyAds)) {
        return <HomePriorityAdsSkeleton />;
    }

    if (error) {
        return (
            <div className="rounded-lg border border-red-200 bg-white p-5 text-sm font-semibold text-red-500">
                {error}
            </div>
        );
    }

    const visibleSections = sections.filter((section) => {
        return data[section.key]?.ads?.length > 0;
    });

    /**
     * Ads na thakle kono VIP/Super/Normal title show korbe na.
     */
    if (visibleSections.length === 0) {
        return null;
    }

    return (
        <div className="space-y-4">
            {visibleSections.map((section) => (
                <AdSection
                    key={section.key}
                    section={section}
                    ads={data[section.key].ads}
                />
            ))}
        </div>
    );
}

function AdSection({ section, ads }) {
    return (
        <section>
            <div className="mb-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className={`text-[18px] ${section.headerClass}`}>
                        {section.icon}
                    </span>

                    <h2 className="text-[15px] font-extrabold text-gray-800 sm:text-[17px]">
                        {section.title}
                    </h2>
                </div>

                <Link
                    href={section.href}
                    className="shrink-0 text-[12px] font-bold text-gray-700 hover:text-gray-950"
                >
                    {section.viewText} <span>➜</span>
                </Link>
            </div>

            <div className="space-y-3">
                {ads.map((ad, index) => (
                    <PriorityAdCard
                        key={ad._id || ad.adId || index}
                        ad={ad}
                        section={section}
                    />
                ))}
            </div>
        </section>
    );
}

function PriorityAdCard({ ad, section }) {
    const imageUrl = getImageUrl(ad.image?.url);
    const detailsUrl = `/all-ads/${ad._id}`;

    return (
        <Link
            href={detailsUrl}
            className={`group relative flex overflow-hidden rounded-lg border p-3 shadow-sm transition-all duration-300 hover:-translate-y-[2px] hover:shadow-md ${section.cardClass}`}
        >
            <div className="relative h-[95px] w-[118px] shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-[115px] sm:w-[185px]">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={ad.title || "Ad image"}
                        fill
                        sizes="(max-width: 640px) 118px, 185px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[12px] font-bold text-gray-400">
                        No Image
                    </div>
                )}

                <div
                    className={`absolute -left-8 top-3 w-28 -rotate-45 py-1 text-center text-[10px] font-black tracking-wide ${section.ribbonClass}`}
                >
                    {section.ribbon}
                </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col px-3 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-1 text-[15px] font-black text-gray-900 sm:text-[20px]">
                            {ad.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-bold text-gray-700 sm:text-[13px]">
                            <span>👥 {ad.category || "Uncategorized"}</span>
                            <span>📍 {ad.location || "Unknown"}</span>
                        </div>
                    </div>

                    <span
                        className={`hidden rounded-md border px-3 py-1.5 text-[12px] font-black sm:inline-flex ${section.badgeClass}`}
                    >
                        {section.badge}
                    </span>
                </div>

                <p className="mt-2 line-clamp-2 text-[12px] font-medium leading-5 text-gray-700 sm:text-[14px]">
                    {ad.description}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-[11px] font-bold text-gray-700 sm:text-[13px]">
                    <div className="flex items-center gap-4">
                        <span className="text-pink-500">
                            👍 {ad.likesCount || 0} Likes
                        </span>

                        <span>
                            👁 {formatViews(ad.viewsCount || 0)} Views
                        </span>
                    </div>

                    <span className="text-gray-700">
                    🕘 {timeAgo(ad.approvedAt || ad.createdAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function HomePriorityAdsSkeleton() {
    return (
        <div className="space-y-4">
            {[1, 2, 3].map((item) => (
                <div key={item}>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="h-5 w-56 animate-pulse rounded bg-gray-200" />
                        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                    </div>

                    <PriorityCardSkeleton />
                </div>
            ))}
        </div>
    );
}

function PriorityCardSkeleton() {
    return (
        <div className="flex rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="h-[95px] w-[118px] shrink-0 animate-pulse rounded-md bg-gray-200 sm:h-[115px] sm:w-[185px]" />

            <div className="flex flex-1 flex-col px-3 sm:px-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-gray-200" />

                <div className="mt-auto flex justify-between pt-3">
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                </div>
            </div>
        </div>
    );
}

function getImageUrl(url) {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (!API_BASE_URL) return url;

    return `${API_BASE_URL.replace(/\/$/, "")}${url.startsWith("/") ? url : `/${url}`}`;
}

function formatViews(value) {
    const number = Number(value) || 0;

    if (number >= 1000000) return `${(number / 1000000).toFixed(1)}M`;
    if (number >= 1000) return `${(number / 1000).toFixed(1)}K`;

    return number;
}

function timeAgo(date) {
    if (!date) return "Just now";

    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

    const intervals = [
        { label: "year", seconds: 31536000 },
        { label: "month", seconds: 2592000 },
        { label: "week", seconds: 604800 },
        { label: "day", seconds: 86400 },
        { label: "hour", seconds: 3600 },
        { label: "minute", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);

        if (count >= 1) {
            return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
        }
    }

    return "Just now";
}