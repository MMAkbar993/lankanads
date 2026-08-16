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

export const createAd = createAsyncThunk(
    "ads/createAd",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/api/ads`, formData, {
                headers: getAuthHeaders(),
            });

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create ad"
            );
        }
    }
);

export const updateAd = createAsyncThunk(
    "ads/updateAd",
    async ({ id, formData }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/ads/${id}`,
                formData,
                {
                    headers: getAuthHeaders(),
                }
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update ad"
            );
        }
    }
);

export const getMyAds = createAsyncThunk(
    "ads/getMyAds",
    async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", limit);

            if (search.trim()) {
                params.append("search", search.trim());
            }

            const res = await axios.get(
                `${API_BASE_URL}/api/ads/my-ads?${params.toString()}`,
                {
                    headers: getAuthHeaders(),
                }
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to get ads"
            );
        }
    }
);

export const deleteAd = createAsyncThunk(
    "ads/deleteAd",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/ads/${id}`, {
                headers: getAuthHeaders(),
            });

            return id;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to delete ad"
            );
        }
    }
);

export const toggleAdStatus = createAsyncThunk(
    "ads/toggleAdStatus",
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/ads/${id}/toggle-status`,
                {},
                {
                    headers: getAuthHeaders(),
                }
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update ad status"
            );
        }
    }
);

export const republishAd = createAsyncThunk(
    "ads/republishAd",
    async ({ id, type }, { rejectWithValue }) => {
        try {
            const res = await axios.patch(
                `${API_BASE_URL}/api/ads/${id}/republish`,
                { type },
                {
                    headers: getAuthHeaders(),
                }
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to republish ad"
            );
        }
    }
);

const adSlice = createSlice({
    name: "ads",
    initialState: {
        ads: [],
        loading: false,
        error: null,

        page: 1,
        limit: 20,
        search: "",
        totalAds: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
    reducers: {
        clearAdError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAd.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.ad) {
                    state.ads.unshift(action.payload.ad);
                    state.totalAds += 1;
                }
            })
            .addCase(createAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateAd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAd.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.ad) {
                    const index = state.ads.findIndex(
                        (ad) => ad._id === action.payload.ad._id
                    );
                    if (index !== -1) {
                        state.ads[index] = action.payload.ad;
                    }
                }
            })
            .addCase(updateAd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getMyAds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMyAds.fulfilled, (state, action) => {
                state.loading = false;

                state.ads = action.payload?.ads || [];
                state.page = action.payload?.page || 1;
                state.limit = action.payload?.limit || 20;
                state.search = action.payload?.search || "";
                state.totalAds = action.payload?.totalAds || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.hasNextPage = action.payload?.hasNextPage || false;
                state.hasPrevPage = action.payload?.hasPrevPage || false;
            })
            .addCase(getMyAds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(deleteAd.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteAd.fulfilled, (state, action) => {
                state.ads = state.ads.filter((ad) => ad._id !== action.payload);

                if (state.totalAds > 0) {
                    state.totalAds -= 1;
                }
            })
            .addCase(deleteAd.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(toggleAdStatus.fulfilled, (state, action) => {
                if (action.payload?.ad) {
                    const index = state.ads.findIndex(
                        (ad) => ad._id === action.payload.ad._id
                    );
                    if (index !== -1) {
                        state.ads[index] = action.payload.ad;
                    }
                }
            })
            .addCase(toggleAdStatus.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(republishAd.fulfilled, (state, action) => {
                if (action.payload?.ad) {
                    const index = state.ads.findIndex(
                        (ad) => ad._id === action.payload.ad._id
                    );
                    if (index !== -1) {
                        state.ads[index] = action.payload.ad;
                    }
                }
            })
            .addCase(republishAd.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearAdError } = adSlice.actions;

export default adSlice.reducer;