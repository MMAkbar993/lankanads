"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Crown,
  Eye,
  MapPin,
  Star,
  ThumbsUp,
  UserRound,
} from "lucide-react";

import { getPublicAds } from "@/../redux/features/publicAdSlice";
import { getImageUrl } from "@/lib/getImageUrl";

export default function AdsCards({ limit = 20, showPagination = true }) {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const {
    ads,
    loading,
    initialized,
    error,
    page: currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.publicAds);

  useEffect(() => {
    dispatch(
      getPublicAds({
        page,
        limit,
      })
    );
  }, [dispatch, page, limit]);

  const paginationItems = useMemo(() => {
    return getPaginationItems(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (targetPage) => {
    if (
      targetPage < 1 ||
      targetPage > totalPages ||
      targetPage === currentPage ||
      loading
    ) {
      return;
    }

    setPage(targetPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!initialized || (loading && ads.length === 0)) {
    return <AdsCardsSkeleton count={Math.min(limit, 6)} />;
  }

  if (error && ads.length === 0) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-600">
        {error}
      </div>
    );
  }

  if (!loading && ads.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-5 text-sm font-semibold text-gray-500">
        No Ads Found!
      </div>
    );
  }

  return (
    <section>
      <div
        className={`grid grid-cols-1 gap-3 lg:grid-cols-2 ${
          loading ? "pointer-events-none opacity-70" : ""
        }`}
      >
        {ads.map((item, index) => (
          <AdCard key={item._id || item.adId || index} item={item} />
        ))}
      </div>

      {showPagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          hasPrevPage={hasPrevPage}
          hasNextPage={hasNextPage}
          paginationItems={paginationItems}
          loading={loading}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}

function AdCard({ item }) {
  const tier = getAdTier(item);
  const imageUrl = getImageUrl(item);

  const category =
    getDisplayText(item.category) ||
    getDisplayText(item.categoryName) ||
    "Personal";

  const location =
    getDisplayText(item.location) || getDisplayText(item.city) || "Location";

  const likes = item.likesCount ?? item.totalLikes ?? item.likes?.length ?? 0;

  const views = item.viewsCount ?? item.totalViews ?? item.views ?? 0;

  const detailsUrl = `/all-ads/${item._id || item.adId}`;

  const cardTheme = {
    VIP: "border-[#f0d28a] bg-[#fffaf0]",
    SUPER: "border-[#f4bfd1] bg-[#fff7fa]",
    NORMAL: "border-[#e3e6ea] bg-white",
  }[tier];

  return (
    <Link
      href={detailsUrl}
      className={`group relative grid min-h-[145px] grid-cols-1 overflow-hidden rounded-[9px] border transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:grid-cols-[38%_minmax(0,1fr)] ${cardTheme}`}
    >
      <div className="relative m-[6px] h-[190px] overflow-hidden rounded-[6px] bg-gray-100 sm:h-auto sm:min-h-[132px]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title || "Advertisement image"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 38vw, 230px"
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-gray-400">
            No Image
          </div>
        )}

        {tier !== "NORMAL" && <TierRibbon tier={tier} />}
      </div>

      <div className="relative flex min-w-0 flex-col px-3 pb-3 pt-2 sm:pl-3 sm:pr-4">
        {tier !== "NORMAL" && <TierBadge tier={tier} />}

        <h3
          className={`line-clamp-1 text-[15px] font-bold leading-6 text-[#111827] ${
            tier !== "NORMAL" ? "pr-[92px]" : ""
          }`}
        >
          {item.title || "Untitled Advertisement"}
        </h3>

        <div className="mt-1 flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-[11px] font-medium text-[#374151]">
          <span className="flex min-w-0 items-center gap-1.5">
            <UserRound
              size={13}
              strokeWidth={2.5}
              className="shrink-0 text-[#eb0a69]"
            />

            <span className="max-w-[130px] truncate">{category}</span>
          </span>

          <span className="flex min-w-0 items-center gap-1.5">
            <MapPin
              size={13}
              strokeWidth={2.5}
              className="shrink-0 text-[#eb0a69]"
            />

            <span className="max-w-[120px] truncate">{location}</span>
          </span>
        </div>

        <p className="mt-2 line-clamp-2 text-[12px] leading-[18px] text-[#202938] sm:text-[13px]">
          {item.description ||
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
              {formatCount(likes)} Likes
            </span>

            <span className="flex items-center gap-1.5">
              <Eye size={15} strokeWidth={2.4} className="text-[#172033]" />
              {formatCount(views)} Views
            </span>
          </div>

          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock3 size={14} strokeWidth={2.2} />
            {timeAgo(item.approvedAt || item.createdAt)}{" "}
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
        className={`absolute left-[-27px] top-[12px] flex w-[105px] -rotate-45 items-center justify-center gap-1 py-[5px] text-[10px] font-extrabold text-white shadow-sm ${
          isVip ? "bg-[#f5ac00]" : "bg-[#f01435]"
        }`}
      >
        {isVip ? (
          <Crown size={12} fill="currentColor" />
        ) : (
          <Star size={11} fill="currentColor" />
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
      className={`absolute right-3 top-2 flex h-[29px] items-center gap-1.5 rounded-[5px] border px-3 text-[12px] font-extrabold ${
        isVip
          ? "border-[#efcc70] bg-[#fffaf0] text-[#e6a400]"
          : "border-[#f2a8c4] bg-[#fff7fa] text-[#e41569]"
      }`}
    >
      {isVip ? (
        <Crown size={15} fill="currentColor" />
      ) : (
        <Star size={14} fill="currentColor" />
      )}

      {tier}
    </span>
  );
}

function Pagination({
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  paginationItems,
  loading,
  onPageChange,
}) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Ads pagination"
      className="mt-4 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={!hasPrevPage || loading}
        onClick={() => onPageChange(currentPage - 1)}
        className="flex h-9 items-center gap-1 rounded-[6px] border border-[#f2c8d8] bg-white px-3 text-[12px] font-semibold text-[#e91569] transition hover:bg-[#fff3f7] disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft size={15} strokeWidth={2.5} />
        Previous
      </button>

      {paginationItems.map((item, index) => {
        if (item === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 min-w-9 items-center justify-center rounded-[6px] border border-gray-200 bg-white px-2 text-sm font-bold text-gray-500"
            >
              ...
            </span>
          );
        }

        const active = item === currentPage;

        return (
          <button
            key={item}
            type="button"
            disabled={loading}
            aria-current={active ? "page" : undefined}
            onClick={() => onPageChange(item)}
            className={`flex h-9 min-w-9 items-center justify-center rounded-[6px] border px-3 text-[12px] font-bold transition ${
              active
                ? "border-[#eb0a69] bg-[#eb0a69] text-white shadow-sm"
                : "border-gray-200 bg-white text-[#172033] hover:border-[#eb0a69] hover:text-[#eb0a69]"
            }`}
          >
            {item}
          </button>
        );
      })}

      <button
        type="button"
        disabled={!hasNextPage || loading}
        onClick={() => onPageChange(currentPage + 1)}
        className="flex h-9 items-center gap-1 rounded-[6px] border border-[#f2c8d8] bg-white px-3 text-[12px] font-semibold text-[#e91569] transition hover:bg-[#fff3f7] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
        <ChevronRight size={15} strokeWidth={2.5} />
      </button>
    </nav>
  );
}

function AdsCardsSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
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

function getAdTier(item) {
  const rawType =
    item.type ||
    item.adType ||
    item.packageType ||
    item.package?.name ||
    item.plan?.name ||
    "NORMAL";

  const normalizedType = String(rawType).trim().toUpperCase();

  if (normalizedType.includes("VIP")) {
    return "VIP";
  }

  if (normalizedType.includes("SUPER")) {
    return "SUPER";
  }

  return "NORMAL";
}

function getDisplayText(value) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  return value.name || value.title || value.city || value.label || "";
}

function formatCount(value) {
  const number = Number(value) || 0;

  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(number >= 10_000_000 ? 0 : 1)}M`;
  }

  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(number >= 10_000 ? 0 : 1)}K`;
  }

  return String(number);
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
}

function timeAgo(date) {
  if (!date) {
    return "";
  }

  const createdDate = new Date(date);

  if (Number.isNaN(createdDate.getTime())) {
    return "";
  }

  const seconds = Math.max(
    0,
    Math.floor((Date.now() - createdDate.getTime()) / 1000)
  );

  const intervals = [
    {
      singular: "year",
      plural: "years",
      seconds: 31_536_000,
    },
    {
      singular: "month",
      plural: "months",
      seconds: 2_592_000,
    },
    {
      singular: "week",
      plural: "weeks",
      seconds: 604_800,
    },
    {
      singular: "day",
      plural: "days",
      seconds: 86_400,
    },
    {
      singular: "hour",
      plural: "hours",
      seconds: 3_600,
    },
    {
      singular: "minute",
      plural: "minutes",
      seconds: 60,
    },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);

    if (count >= 1) {
      const label = count === 1 ? interval.singular : interval.plural;

      return `${count} ${label} ago`;
    }
  }

  return "Just now";
}
