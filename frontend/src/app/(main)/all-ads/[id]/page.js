"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Phone, Clock, MapPin, Heart, Eye, ThumbsUp, Tag } from "lucide-react";

import {
  toggleLike,
  toggleSave,
  incrementAdView,
} from "@/../redux/features/adInteractionSlice";
import { getPublicAdById } from "@/../redux/features/publicAdSlice";
import { getImageUrl } from "@/lib/getImageUrl";

export default function AdDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  const { ads } = useSelector((state) => state.publicAds);

  const { likedAds, savedAds, likeLoading, saveLoading } = useSelector(
    (state) => state.adInteraction
  );

  const { isLoggedIn } = useSelector((state) => state.auth);

  const adFromList = ads.find((item) => item._id === id);

  const [fetchedAd, setFetchedAd] = useState(null);
  const [fetchStatus, setFetchStatus] = useState("idle"); // idle | loading | notFound

  const ad = adFromList || fetchedAd;

  const [viewsCount, setViewsCount] = useState(0);

  // Ad wasn't already in the browsed list (direct reload, link opened in a
  // new tab, etc.) — fetch it directly instead of assuming it's missing.
  useEffect(() => {
    if (adFromList || !id) return;

    setFetchStatus("loading");

    dispatch(getPublicAdById(id)).then((result) => {
      if (getPublicAdById.fulfilled.match(result)) {
        setFetchedAd(result.payload);
        setFetchStatus("idle");
      } else {
        setFetchStatus("notFound");
      }
    });
  }, [adFromList, id, dispatch]);

  useEffect(() => {
    if (!ad?._id) return;

    setViewsCount(ad.viewsCount || ad.views || 0);

    dispatch(incrementAdView(ad._id)).then((result) => {
      if (incrementAdView.fulfilled.match(result)) {
        setViewsCount(result.payload.viewsCount || 0);
      }
    });
  }, [dispatch, ad?._id]);

  if (!ad && fetchStatus === "loading") {
    return (
      <section className="mx-auto max-w-5xl bg-[var(--gray)] px-4 py-10">
        <div className="rounded-xl border border-[var(--border)] bg-white p-10 text-center text-sm font-semibold text-gray-400">
          Loading ad...
        </div>
      </section>
    );
  }

  if (!ad) {
    return (
      <section className="mx-auto max-w-5xl bg-[var(--gray)] px-4 py-10">
        <div className="rounded-xl border border-[var(--border)] bg-white p-6 text-center">
          <h1 className="text-[20px] font-bold text-[var(--dark)]">
            Ad data not found
          </h1>

          <p className="mt-2 text-[14px] text-gray-500">
            Please go back to all ads page and open the ad again.
          </p>

          <Link
            href="/"
            className="mt-5 inline-flex rounded-md bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]"
          >
            Back to All Ads
          </Link>
        </div>
      </section>
    );
  }

  const imageUrl = getImageUrl(ad);

  // The ad's own phone/WhatsApp (set at posting time, or via "Change Phone")
  // must win over the account's login number — an ad can advertise a
  // different contact number than the account owner's own login phone.
  const phone = ad.phone || ad.user?.phone || "N/A";
  const whatsappNumber = ad.whatsappNumber || phone;

  const isLiked = likedAds[ad._id] || false;
  const isSaved = savedAds[ad._id] || false;

  const likesCount = isLiked ? (ad.likesCount || 0) + 1 : ad.likesCount || 0;

  const handleLike = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    dispatch(toggleLike(ad._id));
  };

  const handleSave = () => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    dispatch(toggleSave(ad._id));
  };

  return (
    <section className="mx-auto max-w-5xl bg-[var(--gray)] px-4 py-6">
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--white)] shadow-sm">
        <div className="relative h-[280px] w-full bg-[var(--gray)] sm:h-[420px]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={ad.title || "Ad image"}
              fill
              unoptimized
              className="object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-400">
              No Image Available
            </div>
          )}

          {ad.type === "VIP Ad" && (
            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-md bg-purple-600 px-4 py-1 text-[13px] font-bold text-white shadow-md">
              VIP Ad
            </div>
          )}
          {ad.type === "Super Ad" && (
            <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-md bg-[#f5a623] px-4 py-1 text-[13px] font-bold text-[#1a1a1a] shadow-md">
              Super Ad
            </div>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <h1 className="text-[20px] font-bold text-[var(--dark)] sm:text-[24px]">
            {ad.title}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[13px] font-medium text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} className="text-[var(--primary)]" />
              {ad.location}
            </span>

            <span className="font-black text-gray-400">·</span>

            <span className="flex items-center gap-1">
              <Tag size={14} className="text-[var(--primary)]" />
              {ad.category}
            </span>

            <span className="flex items-center gap-1">
              <Eye size={14} className="text-[var(--primary)]" />
              {viewsCount} Views
            </span>

            <span className="font-black text-gray-400">·</span>

            <span className="flex items-center gap-1">
              <Clock size={14} className="text-[var(--primary)]" />
              {timeAgo(ad.approvedAt || ad.createdAt)}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isLiked
                  ? "bg-[var(--primary-hover)]"
                  : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
              }`}
            >
              {likeLoading ? (
                "Updating..."
              ) : (
                <>
                  <ThumbsUp size={18} />
                  {isLiked ? "Liked" : "Like"}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saveLoading}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-md py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isSaved
                  ? "bg-[var(--primary-hover)]"
                  : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
              }`}
            >
              {saveLoading ? (
                "Updating..."
              ) : (
                <>
                  <Heart size={18} />
                  {isSaved ? "Saved" : "Save"}
                </>
              )}
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4">
            <h2 className="text-[20px] font-bold text-[var(--primary)]">
              Rs. {Number(ad.price || 0).toLocaleString()}.00
            </h2>

            <span className="flex items-center gap-1 text-[13px] font-semibold text-[var(--primary)]">
              <Heart size={15} />
              {likesCount} Likes
            </span>
          </div>

          <a
            href={`tel:${phone}`}
            className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[var(--primary)] py-1 text-[18px] font-normal text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white"
          >
            <Phone size={16} />
            Call {phone}
          </a>

          {ad.socialAvailability?.whatsapp && (
            <a
              href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-green-500 py-1 text-[18px] font-normal text-green-600 transition hover:bg-green-500 hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {whatsappNumber}
            </a>
          )}

          <div className="mt-8 space-y-5 text-[15px] leading-7 text-gray-600">
            <p>{ad.description}</p>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm leading-7 text-blue-900">
              <p className="mb-3">
                <span className="font-bold">LankanAdsLK</span> අප විසින් සහතික
                කර ඇති සේවා සදහා අප ආයතනය වග කියන අතර අනෙකුත් ඕනෑම සේවාවක් සදහා
                හමු වීමට පෙර හෝ හමු වී ඔබ විසින් කරන ලද ගනුදෙනු සදහා අප ආයතනය වග
                කියන්නේ නැත.
              </p>
              <p>
                ඔබ Full Service සෙවාවක් ලබා ගැනීමට යාමේදී හමු වු පසුව පමණක්
                මුදල් ගෙවන්න. මෙය නිදහස් වෙබ් අඩවියකි. අප ඔබට සපයාදී ඇත්තෙ
                නිදහස් දැන්වීම් පල කරගැනීමට ඇති මාද්‍යක් පමණි. ඔබගේ ගනුදෙනු වලට
                අප වගකිවයුතු නැත.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
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

    if (count >= 1) {
      return `${count}${interval.label} ago`;
    }
  }

  return "Just now";
}

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
