"use client";

import { useEffect, useState } from "react";
import { Coins, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/store/index";
import {
    fetchAgents,
    topUpAgent,
    adjustAgentBalance,
    removeAgent,
    fetchAgentTransactions,
    fetchAdTypeCosts,
    updateAdTypeCost,
} from "@/store/slices/creditSlice";

const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    }).format(d);
};

function TopUpModal({
    userId,
    onClose,
}: {
    userId: string;
    onClose: () => void;
}) {
    const dispatch: AppDispatch = useDispatch();
    const { topUpLoading } = useSelector((state: RootState) => state.credit);

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            toast.error("Enter a valid positive amount");
            return;
        }

        const result = await dispatch(
            topUpAgent({ userId, amount: numericAmount, description })
        );

        if (topUpAgent.fulfilled.match(result)) {
            toast.success("Credits added successfully");
            onClose();
        } else {
            toast.error((result.payload as string) || "Failed to top up agent");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-bold text-gray-900">Top Up Credits</h2>

                <div className="mt-4 space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Amount
                        </label>
                        <input
                            type="number"
                            min={1}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Description (optional)
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Bank transfer received"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-600"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={topUpLoading}
                        className="w-full rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {topUpLoading ? "Adding..." : "Add Credits"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function AdjustBalanceModal({
    userId,
    currentBalance,
    onClose,
}: {
    userId: string;
    currentBalance: number;
    onClose: () => void;
}) {
    const dispatch: AppDispatch = useDispatch();
    const { topUpLoading } = useSelector((state: RootState) => state.credit);

    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount === 0) {
            toast.error("Enter a non-zero amount — positive to add, negative to deduct");
            return;
        }

        const result = await dispatch(
            adjustAgentBalance({
                userId,
                amount: numericAmount,
                description: description || "Balance correction",
            })
        );

        if (adjustAgentBalance.fulfilled.match(result)) {
            toast.success("Balance adjusted");
            onClose();
        } else {
            toast.error((result.payload as string) || "Failed to adjust balance");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-bold text-gray-900">Adjust Balance</h2>
                <p className="mt-1 text-xs text-gray-400">
                    Current balance: {currentBalance}. Use this to fix a wrong top-up —
                    positive amounts add credits, negative amounts deduct them.
                </p>

                <div className="mt-4 space-y-3">
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Amount (e.g. -50 to remove 50 credits)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-500">
                            Reason
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="e.g. Corrected wrong top-up amount"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-600"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={topUpLoading}
                        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {topUpLoading ? "Saving..." : "Save Adjustment"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function LedgerModal({
    userId,
    onClose,
}: {
    userId: string;
    onClose: () => void;
}) {
    const dispatch: AppDispatch = useDispatch();
    const { transactions, transactionsLoading } = useSelector(
        (state: RootState) => state.credit
    );

    useEffect(() => {
        dispatch(fetchAgentTransactions(userId));
    }, [dispatch, userId]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="absolute inset-0" onClick={onClose} />

            <div className="relative z-10 w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100"
                >
                    <X size={18} />
                </button>

                <h2 className="text-lg font-bold text-gray-900">Credit Ledger</h2>

                <div className="mt-4 max-h-[420px] overflow-y-auto">
                    {transactionsLoading ? (
                        <p className="py-8 text-center text-sm text-gray-400">
                            Loading...
                        </p>
                    ) : transactions.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-400">
                            No transactions yet.
                        </p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                                    <th className="py-2">Type</th>
                                    <th className="py-2">Amount</th>
                                    <th className="py-2">Balance</th>
                                    <th className="py-2">Description</th>
                                    <th className="py-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx._id} className="border-b border-gray-50">
                                        <td className="py-2">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    tx.type === "credit"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="py-2 font-semibold">
                                            {tx.type === "credit" ? "+" : "-"}
                                            {tx.amount}
                                        </td>
                                        <td className="py-2 text-gray-500">
                                            {tx.balanceBefore} → {tx.balanceAfter}
                                        </td>
                                        <td className="py-2 text-gray-500">
                                            {tx.description}
                                            {tx.ad ? ` (${tx.ad.adId})` : ""}
                                        </td>
                                        <td className="py-2 text-gray-400">
                                            {formatDateTime(tx.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

function AdTypeCostEditor() {
    const dispatch: AppDispatch = useDispatch();
    const { adTypeCosts, adTypeCostsLoading } = useSelector(
        (state: RootState) => state.credit
    );

    const [edits, setEdits] = useState<Record<string, string>>({});

    useEffect(() => {
        dispatch(fetchAdTypeCosts());
    }, [dispatch]);

    const relevantTypes = ["VIP Ad", "Super Ad", "Normal Ad"];
    const visibleCosts = adTypeCosts.filter((c) => relevantTypes.includes(c.type));

    const handleSave = async (type: string) => {
        const value = Number(edits[type]);

        if (!Number.isFinite(value) || value < 0) {
            toast.error("Enter a valid non-negative number");
            return;
        }

        const result = await dispatch(updateAdTypeCost({ type, creditCost: value }));

        if (updateAdTypeCost.fulfilled.match(result)) {
            toast.success(`${type} cost updated`);
        } else {
            toast.error((result.payload as string) || "Failed to update cost");
        }
    };

    return (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-5 py-4">
                <h2 className="text-base font-semibold text-gray-900">
                    Ad Type Credit Costs
                </h2>
                <p className="mt-0.5 text-sm text-gray-400">
                    Credits deducted from an agent&apos;s balance when an ad of this
                    type is approved.
                </p>
            </div>

            <div className="divide-y divide-gray-100 px-5">
                {adTypeCostsLoading && (
                    <p className="py-4 text-sm text-gray-400">Loading...</p>
                )}

                {!adTypeCostsLoading &&
                    visibleCosts.map((cost) => (
                        <div
                            key={cost.type}
                            className="flex items-center justify-between gap-3 py-3"
                        >
                            <span className="text-sm font-medium text-gray-700">
                                {cost.type}
                            </span>

                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min={0}
                                    placeholder={String(cost.creditCost)}
                                    value={edits[cost.type] ?? ""}
                                    onChange={(e) =>
                                        setEdits((prev) => ({
                                            ...prev,
                                            [cost.type]: e.target.value,
                                        }))
                                    }
                                    className="w-24 rounded-lg border border-gray-200 px-3 py-1.5 text-sm outline-none focus:border-pink-600"
                                />

                                <button
                                    onClick={() => handleSave(cost.type)}
                                    className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-gray-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default function AgentUsersPage() {
    const dispatch: AppDispatch = useDispatch();

    const { agents, agentsTotal, agentsPage, agentsPages, agentsLoading } =
        useSelector((state: RootState) => state.credit);

    const [topUpTarget, setTopUpTarget] = useState<string | null>(null);
    const [adjustTarget, setAdjustTarget] = useState<string | null>(null);
    const [ledgerTarget, setLedgerTarget] = useState<string | null>(null);
    const [removingId, setRemovingId] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchAgents({ page: agentsPage }));
    }, [dispatch, agentsPage]);

    const handleRemoveAgent = async (id: string) => {
        if (!window.confirm("Remove agent access from this user? Their balance and history are kept.")) {
            return;
        }

        setRemovingId(id);

        const result = await dispatch(removeAgent(id));

        if (removeAgent.fulfilled.match(result)) {
            toast.success("Agent access removed");
        } else {
            toast.error((result.payload as string) || "Failed to remove agent");
        }

        setRemovingId(null);
    };

    return (
        <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Agent Credits</h1>
            <p className="mt-1 text-base text-gray-500">
                Manage promoted agent accounts, their credit balances, and
                per-ad-type costs.
            </p>

            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex items-center gap-3 p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-600">
                        <Coins className="h-5 w-5 text-white" />
                    </span>
                    <h2 className="text-lg font-semibold text-gray-900">
                        {agentsTotal} Agents
                    </h2>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[800px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                {[
                                    "Account ID",
                                    "Name",
                                    "Phone",
                                    "Credit Balance",
                                    "Ad Count",
                                    "Actions",
                                ].map((col) => (
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
                            {agentsLoading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!agentsLoading && agents.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">
                                        No agents yet — promote a user from the Users page.
                                    </td>
                                </tr>
                            )}

                            {!agentsLoading &&
                                agents.map((agent) => (
                                    <tr
                                        key={agent._id}
                                        className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                                    >
                                        <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-gray-500">
                                            {agent.accountId || "—"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                            {agent.name || "N/A"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                                            {agent.phone || "—"}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                                            {agent.creditBalance}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                            {agent.adCount}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => setTopUpTarget(agent._id)}
                                                    className="rounded-lg bg-pink-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-pink-700"
                                                >
                                                    Top Up
                                                </button>
                                                <button
                                                    onClick={() => setAdjustTarget(agent._id)}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                                                >
                                                    Adjust
                                                </button>
                                                <button
                                                    onClick={() => setLedgerTarget(agent._id)}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                                                >
                                                    Ledger
                                                </button>
                                                <button
                                                    onClick={() => handleRemoveAgent(agent._id)}
                                                    disabled={removingId === agent._id}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {removingId === agent._id ? "Removing..." : "Remove"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
                    <p className="text-sm text-gray-500">
                        Page {agentsPage} of {agentsPages}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() =>
                                dispatch(fetchAgents({ page: Math.max(1, agentsPage - 1) }))
                            }
                            disabled={agentsPage <= 1 || agentsLoading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() =>
                                dispatch(
                                    fetchAgents({ page: Math.min(agentsPages, agentsPage + 1) })
                                )
                            }
                            disabled={agentsPage >= agentsPages || agentsLoading}
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <AdTypeCostEditor />

            {topUpTarget && (
                <TopUpModal userId={topUpTarget} onClose={() => setTopUpTarget(null)} />
            )}

            {adjustTarget && (
                <AdjustBalanceModal
                    userId={adjustTarget}
                    currentBalance={
                        agents.find((a) => a._id === adjustTarget)?.creditBalance ?? 0
                    }
                    onClose={() => setAdjustTarget(null)}
                />
            )}

            {ledgerTarget && (
                <LedgerModal userId={ledgerTarget} onClose={() => setLedgerTarget(null)} />
            )}
        </div>
    );
}
