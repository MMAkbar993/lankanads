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

export const toggleLike = createAsyncThunk(
    "adInteraction/toggleLike",
    async (adId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/ads/${adId}/toggle-like`,
                {},
                {
                    headers: getAuthHeaders(),
                }
            );

            return {
                adId,
                ...res.data,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update like"
            );
        }
    }
);

export const toggleSave = createAsyncThunk(
    "adInteraction/toggleSave",
    async (adId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/ads/${adId}/toggle-save`,
                {},
                {
                    headers: getAuthHeaders(),
                }
            );

            return {
                adId,
                ...res.data,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update save"
            );
        }
    }
);

export const getMySavedAds = createAsyncThunk(
    "adInteraction/getMySavedAds",
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

export const incrementAdView = createAsyncThunk(
    "adInteraction/incrementAdView",
    async (adId, { rejectWithValue }) => {
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/ads/${adId}/view`
            );

            return {
                adId,
                ...res.data,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update view"
            );
        }
    }
);

const adInteractionSlice = createSlice({
    name: "adInteraction",
    initialState: {
        likeLoading: false,
        saveLoading: false,
        savedListLoading: false,
        error: null,

        likedAds: {},
        savedAds: {},

        savedAdsList: [],
        page: 1,
        limit: 20,
        totalSaved: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
    reducers: {
        clearInteractionError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(toggleLike.pending, (state) => {
                state.likeLoading = true;
                state.error = null;
            })
            .addCase(toggleLike.fulfilled, (state, action) => {
                state.likeLoading = false;

                const { adId, liked } = action.payload;

                state.likedAds[adId] = liked;
            })
            .addCase(toggleLike.rejected, (state, action) => {
                state.likeLoading = false;
                state.error = action.payload;
            })

            .addCase(toggleSave.pending, (state) => {
                state.saveLoading = true;
                state.error = null;
            })
            .addCase(toggleSave.fulfilled, (state, action) => {
                state.saveLoading = false;

                const { adId, saved } = action.payload;

                state.savedAds[adId] = saved;
            })
            .addCase(toggleSave.rejected, (state, action) => {
                state.saveLoading = false;
                state.error = action.payload;
            })

            .addCase(getMySavedAds.pending, (state) => {
                state.savedListLoading = true;
                state.error = null;
            })
            .addCase(getMySavedAds.fulfilled, (state, action) => {
                state.savedListLoading = false;

                state.savedAdsList = action.payload?.ads || [];
                state.page = action.payload?.page || 1;
                state.limit = action.payload?.limit || 20;
                state.totalSaved = action.payload?.totalSaved || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.hasNextPage = action.payload?.hasNextPage || false;
                state.hasPrevPage = action.payload?.hasPrevPage || false;
            })
            .addCase(getMySavedAds.rejected, (state, action) => {
                state.savedListLoading = false;
                state.error = action.payload;
            })
            .addCase(incrementAdView.fulfilled, (state, action) => {
                // optional
            })

    },
});

export const { clearInteractionError } = adInteractionSlice.actions;

export default adInteractionSlice.reducer;