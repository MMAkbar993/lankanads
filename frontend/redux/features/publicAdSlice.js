import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getPublicAds = createAsyncThunk(
    "publicAds/getPublicAds",
    async (
        {
            page = 1,
            limit = 20,
            search = "",
            category = "",
            type = "",
            location = "",
        } = {},
        { rejectWithValue }
    ) => {
        try {
            if (!API_BASE_URL) {
                throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
            }

            const params = new URLSearchParams();

            params.set("page", String(page));
            params.set("limit", String(limit));

            const cleanSearch = String(search || "").trim();
            const cleanCategory = String(category || "").trim();
            const cleanType = String(type || "").trim();
            const cleanLocation = String(location || "").trim();

            if (cleanSearch) {
                params.set("search", cleanSearch);
            }

            if (cleanCategory) {
                params.set("category", cleanCategory);
            }

            if (cleanType) {
                params.set("type", cleanType);
            }

            if (cleanLocation) {
                params.set("location", cleanLocation);
            }

            const res = await fetch(
                `${API_BASE_URL}/api/ads/public?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                    },
                    cache: "no-store",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to get ads");
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to get ads");
        }
    }
);

const initialState = {
    ads: [],
    loading: false,
    initialized: false,
    error: null,

    page: 1,
    limit: 20,
    search: "",
    category: "",
    type: "",
    location: "",

    totalAds: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
};

const publicAdSlice = createSlice({
    name: "publicAds",

    initialState,

    reducers: {
        resetPublicAds: () => initialState,
    },

    extraReducers: (builder) => {
        builder
            .addCase(getPublicAds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(getPublicAds.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.error = null;

                state.ads = action.payload?.ads || [];

                state.page = action.payload?.page || 1;
                state.limit = action.payload?.limit || 20;
                state.search = action.payload?.search || "";
                state.category = action.payload?.category || "";
                state.type = action.payload?.type || "";
                state.location = action.payload?.location || "";

                state.totalAds = action.payload?.totalAds || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.hasNextPage = action.payload?.hasNextPage || false;
                state.hasPrevPage = action.payload?.hasPrevPage || false;
            })

            .addCase(getPublicAds.rejected, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.error = action.payload || "Failed to get ads";

                state.ads = [];
                state.totalAds = 0;
                state.totalPages = 1;
                state.hasNextPage = false;
                state.hasPrevPage = false;
            });
    },
});

export const { resetPublicAds } = publicAdSlice.actions;

export default publicAdSlice.reducer;