"use client";

import { useState } from "react";
import { Flag, X } from "lucide-react";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Kept in sync with REPORT_REASONS in backend/models/AdReport.js — the
// server rejects anything not on its own list, so this is only the picker.
const REASONS = [
    "Fake or scam ad",
    "Wrong or fake phone number",
    "Offensive or illegal content",
    "Duplicate ad",
    "Wrong category",
    "Other",
];

export default function ReportAdButton({ adId }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState(REASONS[0]);
    const [message, setMessage] = useState("");
    const [reporterPhone, setReporterPhone] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const closeModal = () => {
        if (submitting) return;
        setOpen(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!adId || !API_BASE_URL) {
            toast.error("Unable to send the report right now.");
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/ads/${adId}/report`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reason, message, reporterPhone }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || data?.success === false) {
                throw new Error(data?.message || "Failed to submit report");
            }

            toast.success(data?.message || "Thank you. Our team will review this ad.");

            setOpen(false);
            setMessage("");
            setReporterPhone("");
            setReason(REASONS[0]);
        } catch (error) {
            toast.error(error.message || "Failed to submit report");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-red-300 py-2 text-[14px] font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
            >
                <Flag size={16} />
                Report This Ad
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={closeModal}
                >
                    <div
                        className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h3 className="text-[17px] font-bold text-slate-900">
                                    Report this ad
                                </h3>
                                <p className="mt-1 text-[13px] text-slate-500">
                                    Tell us what&apos;s wrong and our team will review it.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeModal}
                                className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                aria-label="Close"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-700">
                                    Reason
                                </label>
                                <select
                                    value={reason}
                                    onChange={(event) => setReason(event.target.value)}
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-[var(--primary)]"
                                >
                                    {REASONS.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-700">
                                    Details (optional)
                                </label>
                                <textarea
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Anything else we should know?"
                                    className="w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-[var(--primary)]"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-slate-700">
                                    Your phone number (optional)
                                </label>
                                <input
                                    value={reporterPhone}
                                    onChange={(event) => setReporterPhone(event.target.value)}
                                    placeholder="So we can follow up if needed"
                                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-[14px] outline-none focus:border-[var(--primary)]"
                                />
                            </div>

                            <div className="flex gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={submitting}
                                    className="flex-1 cursor-pointer rounded-md border border-slate-300 py-2 text-[14px] font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 cursor-pointer rounded-md bg-red-600 py-2 text-[14px] font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                                >
                                    {submitting ? "Sending..." : "Submit Report"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
