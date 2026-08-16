"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavedAds } from "@/../redux/features/savedAdsSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function SavedAdsPage() {
    const dispatch = useDispatch();

    const {
        ads,
        loading,
        page: currentPage,
        totalPages,
        totalSaved,
        hasNextPage,
        hasPrevPage,
    } = useSelector((state) => state.savedAds);

    const [page, setPage] = useState(1);
    const [hasFetched, setHasFetched] = useState(false);

    const limit = 20;

    useEffect(() => {
        setHasFetched(false);

        dispatch(getSavedAds({ page, limit })).finally(() => {
            setHasFetched(true);
        });
    }, [dispatch, page]);

    const paginationItems = useMemo(() => {
        return getPaginationItems(currentPage, totalPages);
    }, [currentPage, totalPages]);

    const goToPage = (targetPage) => {
        if (
            targetPage < 1 ||
            targetPage > totalPages ||
            targetPage === currentPage
        ) {
            return;
        }

        setPage(targetPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const showLoader = loading || !hasFetched;

    return (
        <section className="mx-auto max-w-7xl bg-[var(--gray)]">
            <div className="mb-4 border-b border-[var(--border)] pb-3">
                <h2 className="text-[20px] font-bold tracking-tight text-[var(--dark)]">
                    Saved Ads
                </h2>

                <p className="mt-1 text-[14px] text-gray-500">
                    Your saved ads will appear here.
                </p>

                <div className="mt-2 h-1 w-14 rounded-full bg-[var(--primary)]" />
            </div>

            {showLoader ? (
                <Loader />
            ) : ads.length === 0 ? (
                <div className="rounded-md border border-[var(--border)] bg-white p-6 text-center">
                    <h3 className="text-[16px] font-bold text-[var(--dark)]">
                        No Saved Ads Found!
                    </h3>

                    <p className="mt-2 text-[14px] text-gray-500">
                        Save ads from the details page and they will show here.
                    </p>

                    <Link
                        href="/all-ads"
                        className="mt-4 inline-flex rounded-md bg-[var(--primary)] px-5 py-2 text-[13px] font-semibold text-white hover:bg-[var(--primary-hover)]"
                    >
                        Browse Ads
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                        {ads.map((item, index) => {
                            const imageUrl = item.image?.url
                                ? `${API_BASE_URL}${item.image.url}`
                                : null;

                            return (
                                <Link
                                    key={item._id || item.adId || index}
                                    href={`/all-ads/${item._id}`}
                                    className="group flex cursor-pointer gap-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--white)] p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-md sm:gap-4"
                                >
                                    <div className="relative h-[95px] w-[110px] flex-shrink-0 overflow-hidden rounded-md bg-[var(--gray)] sm:h-[130px] sm:w-[145px]">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={item.title || "Ad image"}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                unoptimized
                                                priority={index < 2}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-1 flex-col">
                                        <h3 className="line-clamp-2 text-[14px] font-bold text-[var(--dark)] transition-colors group-hover:text-[var(--primary)] sm:text-[18px]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-gray-500">
                                            {item.description}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-3 text-[13px] sm:pt-4 sm:text-[14px]">
                                            <div className="flex items-center gap-4 sm:gap-8">
                                                <span className="font-semibold text-[var(--primary)]">
                                                    👍 {item.likesCount || 0} Likes
                                                </span>

                                                <span className="font-semibold text-[var(--primary)]">
                                                    👁 {item.viewsCount || 0} Views
                                                </span>
                                            </div>

                                            <span className="rounded-full bg-[var(--gray)] px-2.5 py-1 text-[12px] font-semibold text-gray-500">
                                                {timeAgo(item.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalSaved={totalSaved}
                        hasPrevPage={hasPrevPage}
                        hasNextPage={hasNextPage}
                        paginationItems={paginationItems}
                        onPageChange={goToPage}
                    />
                </>
            )}
        </section>
    );
}

function Loader() {
    return (
        <div className="flex min-h-[260px] items-center justify-center rounded-md border border-[var(--border)] bg-white">
            <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[var(--border)] border-t-[var(--primary)]" />
                <p className="text-[14px] font-semibold text-[var(--primary)]">
                    Loading saved ads...
                </p>
            </div>
        </div>
    );
}

function Pagination({
    currentPage,
    totalPages,
    totalSaved,
    hasPrevPage,
    hasNextPage,
    paginationItems,
    onPageChange,
}) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className="mt-6 flex flex-col gap-4 rounded-md border border-[var(--border)] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[14px] font-medium text-gray-600">
                Page {currentPage} of {totalPages} — Total {totalSaved} saved ads
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    disabled={!hasPrevPage}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Previous
                </button>

                {paginationItems.map((item, index) =>
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
                            onClick={() => onPageChange(item)}
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
                    onClick={() => onPageChange(currentPage + 1)}
                    className="rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
}

function getPaginationItems(currentPage, totalPages) {
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
        return [1, 2, 3, "...", totalPages];
    }

    if (currentPage >= totalPages - 2) {
        return [1, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage, "...", totalPages];
}

function timeAgo(date) {
    if (!date) return "";

    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = [
        { label: "y", seconds: 31536000 },
        { label: "mo", seconds: 2592000 },
        { label: "w", seconds: 604800 },
        { label: "d", seconds: 86400 },
        { label: "h", seconds: 3600 },
        { label: "m", seconds: 60 },
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) return `${count}${interval.label} ago`;
    }

    return "Just now";
}