import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getCookie = (name) => {
    if (typeof document === "undefined") return null;

    const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const getAuthHeaders = () => {
    const token = getCookie("token");

    return {
        Authorization: `Bearer ${token}`,
    };
};

export const getSavedAds = createAsyncThunk(
    "savedAds/getSavedAds",
    async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
        try {
            const res = await axios.get(
                `${API_BASE_URL}/api/ads/saved/my-ads?page=${page}&limit=${limit}`,
                {
                    headers: getAuthHeaders(),
                }
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to get saved ads"
            );
        }
    }
);

const savedAdsSlice = createSlice({
    name: "savedAds",
    initialState: {
        ads: [],
        loading: false,
        error: null,

        page: 1,
        limit: 20,
        totalSaved: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
    reducers: {
        clearSavedAdsError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getSavedAds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSavedAds.fulfilled, (state, action) => {
                state.loading = false;

                state.ads = action.payload?.ads || [];
                state.page = action.payload?.page || 1;
                state.limit = action.payload?.limit || 20;
                state.totalSaved = action.payload?.totalSaved || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.hasNextPage = action.payload?.hasNextPage || false;
                state.hasPrevPage = action.payload?.hasPrevPage || false;
            })
            .addCase(getSavedAds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSavedAdsError } = savedAdsSlice.actions;

export default savedAdsSlice.reducer;