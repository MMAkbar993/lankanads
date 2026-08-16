"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
    Search,
    MapPin,
    Eye,
    ThumbsUp,
    Clock3,
    Crown,
    Star,
    UserRound,
    X,
    ChevronDown,
} from "lucide-react";
import { getPublicAds } from "@/../redux/features/publicAdSlice";
import { getImageUrl } from "@/lib/getImageUrl";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const categories = [
    { label: "All Categories", value: "" },
    { label: "Girls Personal", value: "Girls Personal" },
    {
        label: "Spa & Wellness Services",
        value: "Spa & Wellness Services",
    },
    { label: "Massage", value: "Massage" },
    { label: "Live Cam", value: "Live Cam" },
    { label: "Boys Personal", value: "Boys Personal" },
];

const adTypes = [
    { label: "All Type", value: "" },
    { label: "VIP Ads", value: "VIP Ad" },
    { label: "Super Ads", value: "Super Ad" },
    { label: "Normal Ads", value: "Normal Ad" },
];

export default function CategoryAdsPage() {
    return (
        <Suspense fallback={<CategoryPageSkeleton />}>
            <CategoryAdsContent />
        </Suspense>
    );
}

function CategoryAdsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const selectedCategory = searchParams.get("category") || "";
    const selectedType = searchParams.get("type") || "";
    const activeSearch = searchParams.get("search") || "";
    const urlPage = Number(searchParams.get("page")) || 1;

    const {
        ads,
        loading,
        initialized,
        page: currentPage = 1,
        totalPages = 1,
        totalAds = 0,
        hasNextPage,
        hasPrevPage,
    } = useSelector((state) => state.publicAds);

    const [searchInput, setSearchInput] = useState(activeSearch);

    const limit = 20;

    useEffect(() => {
        setSearchInput(activeSearch);
    }, [activeSearch]);

    useEffect(() => {
        dispatch(
            getPublicAds({
                page: urlPage,
                limit,
                search: activeSearch,
                category: selectedCategory,
                type: selectedType,
            })
        );
    }, [
        dispatch,
        urlPage,
        activeSearch,
        selectedCategory,
        selectedType,
    ]);

    const paginationItems = useMemo(() => {
        return getPaginationItems(currentPage, totalPages);
    }, [currentPage, totalPages]);

    const updateUrl = (updates = {}) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });

        const queryString = params.toString();

        router.push(
            queryString
                ? `/categories/all?${queryString}`
                : "/categories/all"
        );
    };

    const handleCategoryChange = (category) => {
        updateUrl({
            category,
            page: "",
        });
    };

    const handleTypeChange = (type) => {
        updateUrl({
            type,
            page: "",
        });
    };

    const removeCategory = () => {
        updateUrl({
            category: "",
            page: "",
        });
    };

    const removeType = () => {
        updateUrl({
            type: "",
            page: "",
        });
    };

    const handleSearch = () => {
        updateUrl({
            search: searchInput.trim(),
            page: "",
        });
    };

    const clearSearch = () => {
        setSearchInput("");

        updateUrl({
            search: "",
            page: "",
        });
    };

    const goToPage = (targetPage) => {
        if (
            targetPage < 1 ||
            targetPage > totalPages ||
            targetPage === currentPage
        ) {
            return;
        }

        updateUrl({
            page: String(targetPage),
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const title = selectedCategory || "All Ads";
    const showLoader = !initialized || loading;

    const canGoPrevious =
        hasPrevPage ?? currentPage > 1;

    const canGoNext =
        hasNextPage ?? currentPage < totalPages;

    return (
        <section className="mx-auto max-w-7xl px-4 py-6">
            <div className="mb-6 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--border)] sm:p-6">
                <div>
                    <h1 className="text-[28px] font-normal text-[var(--dark)] sm:text-[36px]">
                        {title}
                    </h1>

                    <p className="mt-1 text-[14px] font-medium text-gray-500">
                        {totalAds || 0} ads found
                    </p>
                </div>

                {(selectedCategory || selectedType) && (
                    <div className="flex flex-wrap gap-2">
                        {selectedCategory && (
                            <button
                                type="button"
                                onClick={removeCategory}
                                className="flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-[14px] font-bold text-[var(--primary)]"
                            >
                                {selectedCategory}

                                <X
                                    size={15}
                                    className="cursor-pointer"
                                />
                            </button>
                        )}

                        {selectedType && (
                            <button
                                type="button"
                                onClick={removeType}
                                className="flex items-center gap-2 rounded-full bg-pink-100 px-4 py-1.5 text-[14px] font-bold text-[var(--primary)]"
                            >
                                {selectedType}

                                <X
                                    size={15}
                                    className="cursor-pointer"
                                />
                            </button>
                        )}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[var(--border)]">
                    <div className="mb-5">
                        <div className="relative mt-4">
                            <input
                                value={searchInput}
                                onChange={(event) =>
                                    setSearchInput(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                                placeholder="Type ads..."
                                className="h-12 w-full rounded-xl border border-[var(--border)] px-4 pr-10 text-[15px] outline-none focus:border-[var(--primary)]"
                            />

                            {searchInput ? (
                                <button
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--primary)]"
                                >
                                    <X size={18} />
                                </button>
                            ) : (
                                <Search
                                    size={19}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                                />
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSearch}
                            className="mt-3 h-11 w-full cursor-pointer rounded-xl bg-[var(--primary)] text-[14px] font-bold text-white transition hover:bg-[var(--primary-hover)]"
                        >
                            Search Ads
                        </button>
                    </div>

                    <div className="border-t border-[var(--border)] pt-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-[18px] font-bold uppercase text-[var(--dark)]">
                                Category
                            </h2>

                            <ChevronDown size={18} />
                        </div>

                        <div className="space-y-4">
                            {categories.map((item) => (
                                <label
                                    key={item.label}
                                    className="flex cursor-pointer items-center gap-3 text-[16px] font-medium text-gray-700"
                                >
                                    <input
                                        type="radio"
                                        name="category"
                                        value={item.value}
                                        checked={
                                            selectedCategory ===
                                            item.value
                                        }
                                        onChange={() =>
                                            handleCategoryChange(
                                                item.value
                                            )
                                        }
                                        className="h-5 w-5 accent-[var(--primary)]"
                                    />

                                    {item.label}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5 border-t border-[var(--border)] pt-5">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-[18px] font-bold uppercase text-[var(--dark)]">
                                Ads Type
                            </h2>

                            <ChevronDown size={18} />
                        </div>

                        <div className="space-y-4">
                            {adTypes.map((item) => (
                                <label
                                    key={item.label}
                                    className="flex cursor-pointer items-center gap-3 text-[16px] font-medium text-gray-700"
                                >
                                    <input
                                        type="radio"
                                        name="adType"
                                        value={item.value}
                                        checked={
                                            selectedType === item.value
                                        }
                                        onChange={() =>
                                            handleTypeChange(
                                                item.value
                                            )
                                        }
                                        className="h-5 w-5 accent-[var(--primary)]"
                                    />

                                    {item.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <main>
                    {showLoader ? (
                        <CategorySkeleton />
                    ) : ads.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-white p-12 text-center shadow-sm">
                            <h3 className="text-[22px] font-black text-[var(--dark)]">
                                No match ads
                            </h3>

                            <p className="mt-2 text-[14px] text-gray-500">
                                No ads found for selected
                                category, type or search.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                {ads.map((ad) => (
                                    <CategoryAdCard
                                        key={ad._id}
                                        ad={ad}
                                    />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalAds={totalAds}
                                hasPrevPage={
                                    canGoPrevious
                                }
                                hasNextPage={canGoNext}
                                paginationItems={
                                    paginationItems
                                }
                                onPageChange={goToPage}
                            />
                        </>
                    )}
                </main>
            </div>
        </section>
    );
}

function CategoryAdCard({ ad }) {
    const tier = getAdTier(ad);

    const imageUrl = getImageUrl(ad);

    const likes = ad.likesCount || 0;
    const views = ad.viewsCount || 0;

    const cardTheme = {
        VIP: "border-[#f0d28a] bg-[#fffaf0]",
        SUPER: "border-[#f4bfd1] bg-[#fff7fa]",
        NORMAL: "border-[#e3e6ea] bg-white",
    }[tier];

    return (
        <Link
            href={`/all-ads/${ad._id}`}
            className={`group relative grid min-h-[145px] grid-cols-1 overflow-hidden rounded-[9px] border transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[38%_minmax(0,1fr)] ${cardTheme}`}
        >
            <div className="relative m-[6px] h-[190px] overflow-hidden rounded-[6px] bg-gray-100 sm:h-auto sm:min-h-[132px]">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={
                            ad.title ||
                            "Advertisement image"
                        }
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 38vw, 230px"
                        className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
                        No Image
                    </div>
                )}

                {tier !== "NORMAL" && (
                    <TierRibbon tier={tier} />
                )}
            </div>

            <div className="relative flex min-w-0 flex-col px-3 pb-3 pt-2 sm:pl-3 sm:pr-4">
                {tier !== "NORMAL" && (
                    <TierBadge tier={tier} />
                )}

                <h3
                    className={`line-clamp-1 text-[15px] font-bold leading-6 text-[#111827] ${tier !== "NORMAL"
                        ? "pr-[92px]"
                        : ""
                        }`}
                >
                    {ad.title ||
                        "Untitled Advertisement"}
                </h3>

                <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-medium text-[#374151]">
                    <span className="flex min-w-0 items-center gap-1.5">
                        <UserRound
                            size={13}
                            strokeWidth={2.5}
                            className="shrink-0 text-[#eb0a69]"
                        />

                        <span className="max-w-[130px] truncate">
                            {ad.category || "Personal"}
                        </span>
                    </span>

                    <span className="flex min-w-0 items-center gap-1.5">
                        <MapPin
                            size={13}
                            strokeWidth={2.5}
                            className="shrink-0 text-[#eb0a69]"
                        />

                        <span className="max-w-[120px] truncate">
                            {ad.location || "Location"}
                        </span>
                    </span>
                </div>

                <p className="mt-2 line-clamp-2 text-[12px] leading-[18px] text-[#202938] sm:text-[13px]">
                    {ad.description ||
                        "No description available for this advertisement."}
                </p>

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-3 text-[11px] font-semibold text-[#172033]">
                    <div className="flex flex-wrap items-center gap-5">
                        <span className="flex items-center gap-1.5">
                            <ThumbsUp
                                size={14}
                                fill="currentColor"
                                strokeWidth={2.2}
                                className="text-[#eb0a69]"
                            />

                            {formatViews(likes)} Likes
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Eye
                                size={15}
                                strokeWidth={2.4}
                                className="text-[#172033]"
                            />

                            {formatViews(views)} Views
                        </span>
                    </div>

                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                        <Clock3
                            size={14}
                            strokeWidth={2.2}
                        />

                        {timeAgo(ad.createdAt)}
                    </span>
                </div>
            </div>
        </Link>
    );
}

function TierRibbon({ tier }) {
    const isVip = tier === "VIP";

    return (
        <div className="absolute left-0 top-0 z-10 h-[68px] w-[68px] overflow-hidden">
            <div
                className={`absolute left-[-27px] top-[12px] flex w-[105px] -rotate-45 items-center justify-center gap-1 py-[5px] text-[10px] font-extrabold text-white shadow-sm ${isVip
                    ? "bg-[#f5ac00]"
                    : "bg-[#f01435]"
                    }`}
            >
                {isVip ? (
                    <Crown
                        size={12}
                        fill="currentColor"
                    />
                ) : (
                    <Star
                        size={11}
                        fill="currentColor"
                    />
                )}

                {tier}
            </div>
        </div>
    );
}

function TierBadge({ tier }) {
    const isVip = tier === "VIP";

    return (
        <span
            className={`absolute right-3 top-2 flex h-[29px] items-center gap-1.5 rounded-[5px] border px-3 text-[12px] font-extrabold ${isVip
                ? "border-[#efcc70] bg-[#fffaf0] text-[#e6a400]"
                : "border-[#f2a8c4] bg-[#fff7fa] text-[#e41569]"
                }`}
        >
            {isVip ? (
                <Crown
                    size={15}
                    fill="currentColor"
                />
            ) : (
                <Star
                    size={14}
                    fill="currentColor"
                />
            )}

            {tier}
        </span>
    );
}

function getAdTier(ad) {
    const normalizedType = String(
        ad.type || "NORMAL"
    )
        .trim()
        .toUpperCase();

    if (normalizedType.includes("VIP")) {
        return "VIP";
    }

    if (normalizedType.includes("SUPER")) {
        return "SUPER";
    }

    return "NORMAL";
}

function CategoryPageSkeleton() {
    return (
        <section className="mx-auto max-w-7xl px-4 py-6">
            <div className="mb-6 h-[130px] animate-pulse rounded-2xl bg-gray-200" />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
                <div className="h-[500px] animate-pulse rounded-2xl bg-gray-200" />

                <CategorySkeleton />
            </div>
        </section>
    );
}

function CategorySkeleton() {
    return (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {Array.from({
                length: 6,
            }).map((_, index) => (
                <div
                    key={index}
                    className="grid min-h-[145px] grid-cols-1 overflow-hidden rounded-[9px] border border-gray-200 bg-white sm:grid-cols-[38%_minmax(0,1fr)]"
                >
                    <div className="m-[6px] h-[190px] animate-pulse rounded-[6px] bg-gray-200 sm:h-auto sm:min-h-[132px]" />

                    <div className="flex flex-col px-3 pb-3 pt-3 sm:pl-3 sm:pr-4">
                        <div className="h-4 w-3/5 animate-pulse rounded bg-gray-200" />

                        <div className="mt-3 flex gap-5">
                            <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />

                            <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                        </div>

                        <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-200" />

                        <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-gray-200" />

                        <div className="mt-auto flex justify-between pt-4">
                            <div className="flex gap-5">
                                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />

                                <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                            </div>

                            <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function Pagination({
    currentPage,
    totalPages,
    totalAds,
    hasPrevPage,
    hasNextPage,
    paginationItems,
    onPageChange,
}) {
    if (!totalPages || totalPages <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[var(--border)] lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[14px] font-medium text-gray-600">
                Page {currentPage} of {totalPages} —
                Total {totalAds} ads
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    disabled={!hasPrevPage}
                    onClick={() =>
                        onPageChange(currentPage - 1)
                    }
                    className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>

                {paginationItems.map(
                    (item, index) =>
                        item === "..." ? (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 text-[13px] font-semibold text-gray-400"
                            >
                                ...
                            </span>
                        ) : (
                            <button
                                key={item}
                                type="button"
                                onClick={() =>
                                    onPageChange(item)
                                }
                                className={`h-9 min-w-9 rounded-md border px-3 text-[13px] font-semibold transition ${item === currentPage
                                    ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                                    : "border-[var(--border)] bg-white text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)]"
                                    }`}
                            >
                                {item}
                            </button>
                        )
                )}

                <button
                    type="button"
                    disabled={!hasNextPage}
                    onClick={() =>
                        onPageChange(currentPage + 1)
                    }
                    className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function getPaginationItems(
    currentPage,
    totalPages
) {
    if (totalPages <= 5) {
        return Array.from(
            { length: totalPages },
            (_, index) => index + 1
        );
    }

    if (currentPage <= 3) {
        return [
            1,
            2,
            3,
            "...",
            totalPages,
        ];
    }

    if (currentPage >= totalPages - 2) {
        return [
            1,
            "...",
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "...",
        currentPage,
        "...",
        totalPages,
    ];
}

function timeAgo(date) {
    if (!date) {
        return "";
    }

    const seconds = Math.floor(
        (new Date() - new Date(date)) / 1000
    );

    const intervals = [
        {
            label: "y",
            seconds: 31536000,
        },
        {
            label: "mo",
            seconds: 2592000,
        },
        {
            label: "w",
            seconds: 604800,
        },
        {
            label: "d",
            seconds: 86400,
        },
        {
            label: "h",
            seconds: 3600,
        },
        {
            label: "m",
            seconds: 60,
        },
    ];

    for (const interval of intervals) {
        const count = Math.floor(
            seconds / interval.seconds
        );

        if (count >= 1) {
            return `${count}${interval.label} ago`;
        }
    }

    return "Just now";
}

function formatViews(value) {
    const num = Number(value || 0);

    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }

    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }

    return num;
}