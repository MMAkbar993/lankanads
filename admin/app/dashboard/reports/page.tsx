'use client';

import { useEffect, useState } from 'react';
import { Flag, Trash2, Check, X, ExternalLink } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import type { AppDispatch, RootState } from '@/store/index';
import {
    fetchReports,
    updateReportStatus,
    deleteReport,
    type AdReport,
    type ReportStatus,
} from '@/store/slices/reportSlice';

const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://lankanadslk.com';

const FILTERS: { label: string; value: ReportStatus | 'all' }[] = [
    { label: 'Pending', value: 'pending' },
    { label: 'Reviewed', value: 'reviewed' },
    { label: 'Dismissed', value: 'dismissed' },
    { label: 'All', value: 'all' },
];

const STATUS_STYLES: Record<ReportStatus, { bg: string; color: string }> = {
    pending: { bg: '#fef3c7', color: '#b45309' },
    reviewed: { bg: '#dcfce7', color: '#15803d' },
    dismissed: { bg: '#f1f5f9', color: '#64748b' },
};

const formatDate = (value: string) => {
    if (!value) return '—';

    return new Date(value).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

// The ad's public URL, so a reviewer can open the reported ad in one click.
// Mirrors buildAdUrl on the frontend but only needs the ID form, which the
// public route resolves on its own.
const adPublicUrl = (report: AdReport) => {
    const ad = typeof report.ad === 'object' && report.ad ? report.ad : null;
    const identifier = ad?.adId || report.adId;

    if (!identifier) return null;

    return `${SITE_URL}/all-ads/${identifier}`;
};

export default function ReportsPage() {
    const dispatch: AppDispatch = useDispatch();

    const { reports, loading, saving, pendingCount, total } = useSelector(
        (state: RootState) => state.reports
    );

    const [filter, setFilter] = useState<ReportStatus | 'all'>('pending');

    useEffect(() => {
        dispatch(fetchReports({ status: filter, limit: 50 }));
    }, [dispatch, filter]);

    const handleStatus = async (id: string, status: ReportStatus) => {
        const result = await dispatch(updateReportStatus({ id, status }));

        if (updateReportStatus.fulfilled.match(result)) {
            toast.success(`Marked as ${status}`);
        } else {
            toast.error((result.payload as string) || 'Failed to update report');
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this report permanently?')) return;

        const result = await dispatch(deleteReport(id));

        if (deleteReport.fulfilled.match(result)) {
            toast.success('Report deleted');
        } else {
            toast.error((result.payload as string) || 'Failed to delete report');
        }
    };

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-600">
                    <Flag className="h-5 w-5 text-white" />
                </span>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reported Ads
                    </h1>
                    <p className="mt-1 text-base text-gray-500">
                        {pendingCount} pending · {total} in this view
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                {FILTERS.map((item) => (
                    <button
                        key={item.value}
                        onClick={() => setFilter(item.value)}
                        className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${filter === item.value
                            ? 'bg-pink-600 text-white'
                            : 'border border-gray-200 bg-white text-gray-600 hover:border-pink-600 hover:text-pink-600'
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="mt-5 space-y-4">
                {loading && reports.length === 0 && (
                    <p className="text-sm text-gray-400">Loading reports...</p>
                )}

                {!loading && reports.length === 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm font-semibold text-gray-400">
                        No reports in this view.
                    </div>
                )}

                {reports.map((report) => {
                    const ad =
                        typeof report.ad === 'object' && report.ad ? report.ad : null;

                    const reporter =
                        typeof report.reporter === 'object' && report.reporter
                            ? report.reporter
                            : null;

                    const url = adPublicUrl(report);
                    const badge = STATUS_STYLES[report.status];

                    return (
                        <div
                            key={report._id}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-base font-semibold text-gray-900">
                                            {ad?.title || report.adTitle || 'Deleted ad'}
                                        </h2>

                                        <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs text-purple-700">
                                            {ad?.adId || report.adId || '—'}
                                        </code>

                                        <span
                                            className="rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize"
                                            style={{
                                                background: badge.bg,
                                                color: badge.color,
                                            }}
                                        >
                                            {report.status}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm font-semibold text-red-600">
                                        {report.reason}
                                    </p>

                                    {report.message && (
                                        <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                                            {report.message}
                                        </p>
                                    )}

                                    <p className="mt-3 text-xs text-gray-400">
                                        Reported {formatDate(report.createdAt)}
                                        {reporter?.name ? ` · by ${reporter.name}` : ''}
                                        {report.reporterPhone
                                            ? ` · ${report.reporterPhone}`
                                            : ''}
                                        {ad?.status ? ` · ad is ${ad.status}` : ''}
                                    </p>
                                </div>

                                {url && (
                                    <a
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-semibold text-gray-600 transition hover:border-pink-600 hover:text-pink-600"
                                    >
                                        <ExternalLink size={15} />
                                        Open ad
                                    </a>
                                )}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
                                {report.status !== 'reviewed' && (
                                    <button
                                        onClick={() => handleStatus(report._id, 'reviewed')}
                                        disabled={saving}
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
                                    >
                                        <Check size={15} />
                                        Mark reviewed
                                    </button>
                                )}

                                {report.status !== 'dismissed' && (
                                    <button
                                        onClick={() => handleStatus(report._id, 'dismissed')}
                                        disabled={saving}
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-gray-400 disabled:opacity-50"
                                    >
                                        <X size={15} />
                                        Dismiss
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(report._id)}
                                    disabled={saving}
                                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
