"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Search,
    ShieldAlert,
    Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/store/index";
import {
    clearUserError,
    fetchUsers,
    makeAgent,
    removeAgent,
    setUserPage,
    setUserSearch,
    USERS_LIMIT,
} from "@/store/slices/userSlice";

/* ---------------- Local helpers ---------------- */

const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
};

const formatDateTime = (value?: string | null) => {
    if (!value) return "Never";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "Never";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(d);
};

const getInitial = (name?: string | null) =>
    name?.trim()?.charAt(0)?.toUpperCase() || "U";

const COLUMNS = [
    "Account ID",
    "Name",
    "Phone",
    "Verified",
    "Role",
    "Last Login",
    "Created",
    "Updated",
    "Actions",
];

/* ---------------- Page ---------------- */

export default function AllUsersPage() {
    const dispatch: AppDispatch = useDispatch();

    const { users, total, pages, page, search, loading, error } = useSelector(
        (state: RootState) => state.users
    );

    const [promotingId, setPromotingId] = useState<string | null>(null);

    const handleMakeAgent = async (id: string) => {
        setPromotingId(id);

        const result = await dispatch(makeAgent(id));

        if (makeAgent.fulfilled.match(result)) {
            toast.success("User is now an agent");
        } else {
            toast.error((result.payload as string) || "Failed to promote user");
        }

        setPromotingId(null);
    };

    const handleRemoveAgent = async (id: string) => {
        if (!window.confirm("Remove agent access from this user? Their credit balance and history are kept in case they're promoted again later.")) {
            return;
        }

        setPromotingId(id);

        const result = await dispatch(removeAgent(id));

        if (removeAgent.fulfilled.match(result)) {
            toast.success("Agent access removed");
        } else {
            toast.error((result.payload as string) || "Failed to remove agent");
        }

        setPromotingId(null);
    };

    // debounced fetch
    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(fetchUsers({ page, search }));
        }, 400);
        return () => clearTimeout(timer);
    }, [dispatch, page, search]);

    const { from, to } = useMemo(() => {
        const start = total === 0 ? 0 : (page - 1) * USERS_LIMIT + 1;
        const end = Math.min(page * USERS_LIMIT, total);
        return { from: start, to: end };
    }, [page, total]);

    const handleRetry = () => {
        dispatch(clearUserError());
        dispatch(fetchUsers({ page, search }));
    };

    return (
        <div className="p-6 md:p-8">
            {/* Page header */}
            <h1 className="text-3xl font-bold text-gray-900">All Users</h1>
            <p className="mt-1 text-base text-gray-500">
                Manage and monitor all registered users on the platform.
            </p>

            {/* Card */}
            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {/* Card header */}
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-600">
                            <Users className="h-5 w-5 text-white" />
                        </span>
                        <h2 className="text-lg font-semibold text-gray-900">Users</h2>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => dispatch(setUserSearch(e.target.value))}
                            placeholder="Search name or phone..."
                            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-pink-600 focus:ring-1 focus:ring-pink-600"
                        />
                    </div>
                </div>

                {/* Body */}
                {error ? (
                    <div className="border-t border-gray-100 px-6 py-16 text-center">
                        <p className="text-sm text-red-500">{error}</p>
                        <button
                            onClick={handleRetry}
                            className="mt-3 rounded-lg bg-pink-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-pink-700"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="w-full overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse">
                            <thead>
                                <tr className="bg-gray-50">
                                    {COLUMNS.map((col) => (
                                        <th
                                            key={col}
                                            className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading &&
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <tr key={i} className="border-t border-gray-100">
                                            {COLUMNS.map((col) => (
                                                <td key={col} className="px-6 py-5">
                                                    <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}

                                {!loading && users.length === 0 && (
                                    <tr className="border-t border-gray-100">
                                        <td
                                            colSpan={COLUMNS.length}
                                            className="px-6 py-16 text-center text-sm text-gray-400"
                                        >
                                            No users found.
                                        </td>
                                    </tr>
                                )}

                                {!loading &&
                                    users.map((user) => (
                                        <tr
                                            key={user._id}
                                            className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                                        >
                                            <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-500">
                                                {user.accountId || "—"}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pink-600 text-sm font-normal text-white">
                                                        {getInitial(user.name)}
                                                    </span>
                                                    <span className="text-[15px] font-medium text-gray-900">
                                                        {user.name || "N/A"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                                {user.phone || "—"}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                {user.isVerified ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                                                        <BadgeCheck className="h-3.5 w-3.5" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                        <ShieldAlert className="h-3.5 w-3.5" />
                                                        Unverified
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                {user.role === "agent" ? (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                                                        Agent
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                                        User
                                                    </span>
                                                )}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                                                {formatDateTime(user.lastLoginAt)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                                                {formatDate(user.createdAt)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                                                {formatDate(user.updatedAt)}
                                            </td>

                                            <td className="whitespace-nowrap px-6 py-4">
                                                {user.role === "agent" ? (
                                                    <button
                                                        onClick={() => handleRemoveAgent(user._id)}
                                                        disabled={promotingId === user._id}
                                                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {promotingId === user._id
                                                            ? "Removing..."
                                                            : "Remove Agent"}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleMakeAgent(user._id)}
                                                        disabled={promotingId === user._id}
                                                        className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {promotingId === user._id
                                                            ? "Promoting..."
                                                            : "Make Agent"}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer */}
                <div className="flex flex-col gap-3 border-t border-gray-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-500">
                        Showing {from}–{to} of {total}
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => dispatch(setUserPage(Math.max(1, page - 1)))}
                            disabled={page <= 1 || loading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Previous page"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => dispatch(setUserPage(Math.min(pages, page + 1)))}
                            disabled={page >= pages || loading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Next page"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}