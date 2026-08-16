"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPublicAgents } from "@/../redux/features/agentSlice";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function OurAgents() {
    const dispatch = useDispatch();

    const {
        agents,
        loading,
        page: currentPage,
        totalPages,
        totalAgents,
        hasNextPage,
        hasPrevPage,
    } = useSelector((state) => state.agents);

    const [page, setPage] = useState(1);
    const [hasFetched, setHasFetched] = useState(false);

    const limit = 20;

    useEffect(() => {
        setHasFetched(false);

        dispatch(getPublicAgents({ page, limit })).finally(() => {
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

    const showSkeleton = loading || !hasFetched;

    return (
        <section className="mx-auto max-w-7xl bg-white px-4 py-5 sm:px-6 lg:px-7">
            <div className="border-b border-[#d9dee6] pb-7">
                <h1 className="text-[22px] font-bold leading-tight text-[#071d39]">
                    Our Agents
                </h1>

                <p className="mt-2 text-[14px] font-normal leading-tight text-[#667085]">
                    Browse all the our agents here.
                </p>
            </div>

            {showSkeleton ? (
                <AgentsSkeleton count={8} />
            ) : agents.length === 0 ? (
                <div className="mt-5 rounded-md border border-[var(--border)] bg-white p-6 text-center">
                    <h3 className="text-[16px] font-bold text-[var(--dark)]">
                        No Agents Found!
                    </h3>
                </div>
            ) : (
                <>
                    <div className="mt-5 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
                        {agents.map((agent, index) => {
                            const imageUrl = agent.image?.url
                                ? `${agent.image.url}`
                                : null;

                            return (
                                <div
                                    key={agent._id || index}
                                    className="rounded-[10px] border border-[#dce2ea] bg-white p-3 transition hover:border-[var(--primary)]"
                                >
                                    <div className="relative aspect-square w-full overflow-hidden rounded-[4px] bg-[#f5f5f5]">
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={agent.name || "Agent image"}
                                                fill
                                                unoptimized
                                                priority={index < 4}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-[13px] font-semibold text-gray-400">
                                                No Image
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4">
                                        <h2 className="line-clamp-1 text-[17px] font-bold leading-[1.15] text-[#071d39]">
                                            {agent.name}
                                        </h2>

                                        <p className="mt-1 text-[14px] leading-tight text-[#667085]">
                                            Agent
                                        </p>
                                    </div>

                                    <Link
                                        href={`https://wa.me/${formatWhatsapp(agent.whatsapp)}`}
                                        target="_blank"
                                        className="mt-4 flex h-[35px] items-center justify-center gap-2 rounded-[8px] border border-[#05b642] bg-white text-[16px] font-normal text-[#05b642] transition hover:bg-[#05b642] hover:text-white"
                                    >
                                        <MessageCircle size={15} />
                                        Contact
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalAgents={totalAgents}
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

function AgentsSkeleton({ count = 8 }) {
    return (
        <div className="mt-5 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="rounded-[10px] border border-[#dce2ea] bg-white p-3"
                >
                    <div className="aspect-square w-full animate-pulse rounded-[4px] bg-gray-200" />

                    <div className="mt-4">
                        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
                        <div className="mt-2 h-4 w-16 animate-pulse rounded bg-gray-200" />
                    </div>

                    <div className="mt-4 h-[35px] w-full animate-pulse rounded-[8px] bg-gray-200" />
                </div>
            ))}
        </div>
    );
}

function Pagination({
    currentPage,
    totalPages,
    totalAgents,
    hasPrevPage,
    hasNextPage,
    paginationItems,
    onPageChange,
}) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className="mt-6 flex flex-col gap-4 rounded-md border border-[var(--border)] bg-white p-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-[14px] font-medium text-gray-600">
                Page {currentPage} of {totalPages} — Total {totalAgents} agents
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    disabled={!hasPrevPage}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="cursor-pointer rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
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
                            className={`h-9 min-w-9 cursor-pointer rounded-md border px-3 text-[13px] font-semibold transition ${item === currentPage
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
                    className="cursor-pointer rounded-md border border-[var(--border)] bg-white px-4 py-2 text-[13px] font-semibold text-gray-700 hover:border-[var(--primary)] hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
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

function formatWhatsapp(number) {
    if (!number) return "";

    return String(number).replace("+", "").replace(/\s/g, "");
}