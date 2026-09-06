import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/axios';

export type ReportStatus = 'pending' | 'reviewed' | 'dismissed';

export interface ReportedAd {
    _id: string;
    adId?: string;
    title?: string;
    status?: string;
    type?: string;
    location?: string;
}

export interface Reporter {
    _id: string;
    accountId?: string;
    name?: string;
    phone?: string;
}

export interface AdReport {
    _id: string;
    ad: ReportedAd | string | null;
    adId: string;
    adTitle: string;
    reason: string;
    message: string;
    reporter: Reporter | string | null;
    reporterPhone: string;
    status: ReportStatus;
    createdAt: string;
    updatedAt: string;
}

interface ReportState {
    reports: AdReport[];
    total: number;
    pendingCount: number;
    page: number;
    pages: number;
    loading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: ReportState = {
    reports: [],
    total: 0,
    pendingCount: 0,
    page: 1,
    pages: 1,
    loading: false,
    saving: false,
    error: null,
};

const extractMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
};

export const fetchReports = createAsyncThunk(
    'reports/fetchReports',
    async (
        { page = 1, limit = 20, status = 'all' }: {
            page?: number;
            limit?: number;
            status?: ReportStatus | 'all';
        } = {},
        { rejectWithValue }
    ) => {
        try {
            const { data } = await api.get('/admin/reports', {
                params: { page, limit, status },
            });

            return data;
        } catch (error) {
            return rejectWithValue(extractMessage(error, 'Failed to fetch reports'));
        }
    }
);

export const updateReportStatus = createAsyncThunk(
    'reports/updateReportStatus',
    async (
        { id, status }: { id: string; status: ReportStatus },
        { rejectWithValue }
    ) => {
        try {
            const { data } = await api.patch(`/admin/reports/${id}`, { status });

            return data.report as AdReport;
        } catch (error) {
            return rejectWithValue(extractMessage(error, 'Failed to update report'));
        }
    }
);

export const deleteReport = createAsyncThunk(
    'reports/deleteReport',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/reports/${id}`);

            return id;
        } catch (error) {
            return rejectWithValue(extractMessage(error, 'Failed to delete report'));
        }
    }
);

const reportSlice = createSlice({
    name: 'reports',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReports.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReports.fulfilled, (state, action) => {
                state.loading = false;
                state.reports = action.payload.reports ?? [];
                state.total = action.payload.total ?? 0;
                state.pendingCount = action.payload.pendingCount ?? 0;
                state.page = action.payload.page ?? 1;
                state.pages = action.payload.pages ?? 1;
            })
            .addCase(fetchReports.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateReportStatus.pending, (state) => {
                state.saving = true;
            })
            .addCase(updateReportStatus.fulfilled, (state, action) => {
                state.saving = false;

                const updated = action.payload;
                const index = state.reports.findIndex((r) => r._id === updated._id);

                if (index !== -1) state.reports[index] = updated;

                state.pendingCount = state.reports.filter(
                    (r) => r.status === 'pending'
                ).length;
            })
            .addCase(updateReportStatus.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload as string;
            })

            .addCase(deleteReport.pending, (state) => {
                state.saving = true;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.saving = false;
                state.reports = state.reports.filter((r) => r._id !== action.payload);
                state.total = Math.max(state.total - 1, 0);
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload as string;
            });
    },
});

export default reportSlice.reducer;
