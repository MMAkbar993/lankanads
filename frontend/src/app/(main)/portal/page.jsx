"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getMyAds,
  deleteAd,
  toggleAdStatus,
  republishAd,
} from "@/../redux/features/adSlice";
import { refreshUser } from "@/../redux/features/authSlice";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { getImageUrl } from "@/lib/getImageUrl";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function PortalPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { totalAds } = useSelector((state) => state.ads);

  const isAgent = user?.role === "agent";

  useEffect(() => {
    dispatch(refreshUser());
  }, [dispatch]);

  return (
    <div className="rounded-md bg-white p-6">
      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
        <InfoCard title="Account ID" value={user?.accountId || "N/A"} />
        <InfoCard title="Account Type" value={isAgent ? "Agent" : "User"} />

        {isAgent && (
          <>
            <InfoCard
              title="Credit Balance"
              value={user?.creditBalance ?? 0}
            />
            <InfoCard title="Total Ads" value={totalAds ?? 0} />
          </>
        )}
      </div>

      <div className="flex">
        <TabLink label="My Ads" href="/portal" active />
        <TabLink label="New Ad" href="/portal/new-ad" className="-ml-px" />
        <TabLink label="Top up" href="/portal/top-up" />
      </div>

      <div className="mt-2 rounded-md rounded-tl-none border border-slate-300 p-6">
        <MyAdsTab />
      </div>
    </div>
  );
}

function TabLink({ label, href, active, className = "" }) {
  return (
    <Link
      href={href}
      className={`border border-slate-300 px-6 py-2 text-[15px] font-semibold ${
        active ? "bg-white" : "bg-slate-100 cursor-pointer"
      } ${className}`}
    >
      {label}
    </Link>
  );
}

function MyAdsTab() {
  const dispatch = useDispatch();

  const {
    ads,
    loading,
    page: currentPage,
    totalPages,
    totalAds,
    hasNextPage,
    hasPrevPage,
  } = useSelector((state) => state.ads);

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [hasFetched, setHasFetched] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  const [republishModalOpen, setRepublishModalOpen] = useState(false);
  const [republishAdId, setRepublishAdId] = useState(null);
  const [republishType, setRepublishType] = useState("Super Ad");
  const [republishLoading, setRepublishLoading] = useState(false);

  const limit = 20;

  useEffect(() => {
    setHasFetched(false);

    dispatch(
      getMyAds({
        page,
        limit,
        search: activeSearch,
      })
    ).finally(() => {
      setHasFetched(true);
    });
  }, [dispatch, page, activeSearch]);

  const paginationItems = useMemo(() => {
    return getPaginationItems(currentPage, totalPages);
  }, [currentPage, totalPages]);

  const handleSearch = () => {
    setPage(1);
    setActiveSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearchInput("");
    setActiveSearch("");
    setPage(1);
  };

  const goToPage = (targetPage) => {
    if (
      targetPage < 1 ||
      targetPage > totalPages ||
      targetPage === currentPage
    ) {
      return;
    }

    setPage(targetPage);
  };

  const handleDeleteClick = (id) => {
    setSelectedAdId(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;

    setDeleteModalOpen(false);
    setSelectedAdId(null);
  };

  const confirmDelete = async () => {
    if (!selectedAdId) return;

    setDeleteLoading(true);

    const result = await dispatch(deleteAd(selectedAdId));

    if (deleteAd.fulfilled.match(result)) {
      toast.success("Ad deleted successfully");

      dispatch(
        getMyAds({
          page,
          limit,
          search: activeSearch,
        })
      );

      setDeleteModalOpen(false);
      setSelectedAdId(null);
    } else {
      toast.error(result.payload || "Failed to delete ad");
    }

    setDeleteLoading(false);
  };

  const handleToggleStatus = async (id) => {
    setToggleLoadingId(id);

    const result = await dispatch(toggleAdStatus(id));

    if (toggleAdStatus.fulfilled.match(result)) {
      toast.success(result.payload?.message || "Ad status updated");
    } else {
      toast.error(result.payload || "Failed to update ad status");
    }

    setToggleLoadingId(null);
  };

  const openRepublishModal = (id) => {
    setRepublishAdId(id);
    setRepublishType("Super Ad");
    setRepublishModalOpen(true);
  };

  const closeRepublishModal = () => {
    if (republishLoading) return;

    setRepublishModalOpen(false);
    setRepublishAdId(null);
  };

  const confirmRepublish = async () => {
    if (!republishAdId) return;

    setRepublishLoading(true);

    const result = await dispatch(
      republishAd({ id: republishAdId, type: republishType })
    );

    if (republishAd.fulfilled.match(result)) {
      const refundedAmount = result.payload?.refundedAmount;

      toast.success(
        typeof refundedAmount === "number" && refundedAmount > 0
          ? `Ad submitted for republishing — ${refundedAmount} credits refunded`
          : "Ad submitted for republishing"
      );

      setRepublishModalOpen(false);
      setRepublishAdId(null);
    } else {
      toast.error(result.payload || "Failed to republish ad");
    }

    setRepublishLoading(false);
  };

  const showSkeleton = loading || !hasFetched;

  return (
    <>
      <div className="mb-6 flex gap-3">
        <div className="relative flex-1">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by title, category, location, ad ID..."
            className="h-10 w-full rounded-md border border-slate-300 px-5 pr-10 text-[16px] placeholder:text-[16px] outline-none"
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-red-600"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleSearch}
          className="h-10 cursor-pointer rounded-md bg-slate-950 px-8 font-semibold text-white"
        >
          Search
        </button>
      </div>

      <div className="mb-5 rounded-md border border-green-400 bg-green-50 p-4 text-center font-semibold text-green-600">
        For any question, please contact Admin.
        <br />
        ඕනෑම ප්‍රශ්නයක් සඳහා Admin සහය ලබාගන්න.
        <br />
        <button
          type="button"
          onClick={() =>
            window.open(
              `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER.replace(
                /\D/g,
                ""
              )}`,
              "_blank",
              "noreferrer"
            )
          }
          className="mt-3 rounded-md border border-green-500 px-5 py-2"
        >
          Contact Admin
        </button>

        <a
          href={buildWhatsAppLink("I need bank details")}
          target="_blank"
          rel="noreferrer"
          className="mt-3 ml-3 inline-block rounded-md border border-green-500 px-5 py-2"
        >
          I Need Bank Details
        </a>
      </div>

      {showSkeleton ? (
        <AdsListSkeleton count={5} />
      ) : ads.length === 0 ? (
        <div className="rounded-md border border-blue-400 bg-blue-50 p-5 font-semibold text-blue-600">
          No Ads Found!
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {ads.map((ad) => (
              <div
                key={ad._id}
                className="rounded-md border border-slate-300 p-4"
              >
                <div className="flex gap-4">
                  {getImageUrl(ad) && (
                    <Image
                      unoptimized
                      src={getImageUrl(ad)}
                      alt={ad.title}
                      width={80}
                      height={80}
                      className="h-20 w-20 rounded-md object-contain"
                    />
                  )}

                  {!ad.image?.url && (
                    <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-400">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-[16px] font-bold text-slate-900">
                      {ad.title}
                    </h3>

                    <p className="text-[14px] text-slate-500">
                      {ad.category} • {ad.location}
                    </p>

                    <p className="text-[14px] font-semibold text-slate-800">
                      Price: {ad.price}
                    </p>

                    <p className="text-[13px] text-slate-500">
                      Status: {ad.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {ad.status === "pending" && (
                      <Link
                        href={`/portal/edit-ad/${ad._id}`}
                        className="h-9 cursor-pointer rounded-md bg-slate-700 px-4 text-[13px] font-semibold text-white hover:bg-slate-800 flex items-center justify-center"
                      >
                        Edit
                      </Link>
                    )}

                    {(ad.status === "approved" || ad.status === "inactive") && (
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ad._id)}
                        disabled={toggleLoadingId === ad._id}
                        className="h-9 cursor-pointer rounded-md bg-amber-600 px-4 text-[13px] font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                      >
                        {toggleLoadingId === ad._id
                          ? "..."
                          : ad.status === "approved"
                          ? "Pause"
                          : "Resume"}
                      </button>
                    )}

                    {ad.status !== "pending" && (
                      <button
                        type="button"
                        onClick={() => openRepublishModal(ad._id)}
                        className="h-9 cursor-pointer rounded-md bg-blue-600 px-4 text-[13px] font-semibold text-white hover:bg-blue-700"
                      >
                        Republish
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(ad._id)}
                      className="h-9 cursor-pointer rounded-md bg-red-600 px-4 text-[13px] font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {loading && ads.length > 0 && (
            <p className="mt-4 text-center text-[13px] font-semibold text-slate-500">
              Updating ads...
            </p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalAds={totalAds}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            paginationItems={paginationItems}
            onPageChange={goToPage}
          />
        </>
      )}

      {deleteModalOpen && (
        <DeleteConfirmModal
          loading={deleteLoading}
          onCancel={closeDeleteModal}
          onConfirm={confirmDelete}
        />
      )}

      {republishModalOpen && (
        <RepublishModal
          type={republishType}
          onTypeChange={setRepublishType}
          loading={republishLoading}
          onCancel={closeRepublishModal}
          onConfirm={confirmRepublish}
        />
      )}
    </>
  );
}

function AdsListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="rounded-md border border-slate-300 p-4">
          <div className="flex gap-4">
            <div className="h-20 w-20 flex-shrink-0 animate-pulse rounded-md bg-slate-200" />

            <div className="flex flex-1 flex-col">
              <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-slate-200" />
              <div className="mt-3 h-3 w-1/4 animate-pulse rounded bg-slate-200" />
              <div className="mt-2 h-3 w-20 animate-pulse rounded bg-slate-200" />
            </div>

            <div className="h-9 w-20 animate-pulse rounded-md bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function DeleteConfirmModal({ loading, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4c-.77-1.33-2.69-1.33-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z"
            />
          </svg>
        </div>

        <h3 className="text-[20px] font-bold text-slate-900">Delete Ad</h3>

        <p className="mt-2 text-[15px] leading-6 text-slate-500">
          Are you sure you want to delete this advertisement? This action cannot
          be undone.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-md border border-slate-300 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const REPUBLISH_TYPES = ["VIP Ad", "Super Ad", "Normal Ad"];

function RepublishModal({ type, onTypeChange, loading, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h3 className="text-[20px] font-bold text-slate-900">Republish Ad</h3>

        <p className="mt-2 text-[15px] leading-6 text-slate-500">
          Choose a publishing type. Your ad will be resubmitted for admin
          review before it goes live again.
        </p>

        <div className="mt-4 space-y-2">
          {REPUBLISH_TYPES.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 rounded-md border border-slate-300 px-4 py-2 text-[14px] font-medium text-slate-700"
            >
              <input
                type="radio"
                name="republishType"
                value={option}
                checked={type === option}
                onChange={() => onTypeChange(option)}
              />
              {option}
            </label>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-md border border-slate-300 py-2 font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 cursor-pointer rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Republish"}
          </button>
        </div>
      </div>
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
  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-md border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-[14px] font-medium text-slate-600">
        Page {currentPage} of {totalPages} — Total {totalAds} ads
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={!hasPrevPage}
          onClick={() => onPageChange(currentPage - 1)}
          className="cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {paginationItems.map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="px-2 text-[13px] font-semibold text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`h-9 min-w-9 rounded-md border px-3 text-[13px] font-semibold transition ${
                item === currentPage
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
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
          className="cursor-pointer rounded-md border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
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

function InfoCard({ title, value }) {
  return (
    <div className="rounded-md border border-dashed border-slate-300 px-5 py-1">
      <p className="mb-1 text-[14px] font-semibold text-slate-500">{title}</p>
      <h3 className="text-[16px] font-bold text-[#424A56]">{value}</h3>
    </div>
  );
}
