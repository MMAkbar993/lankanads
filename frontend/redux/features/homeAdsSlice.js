import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const joinUrl = (base, path) => {
    return `${base.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
};

const buildQuery = (params = {}) => {
    const query = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            query.set(key, value);
        }
    });

    return query.toString();
};

const fetchSectionAds = async ({ path, params, signal }) => {
    if (!API_BASE_URL) {
        throw new Error("NEXT_PUBLIC_API_BASE_URL is missing");
    }

    const query = buildQuery(params);
    const url = joinUrl(API_BASE_URL, `${path}${query ? `?${query}` : ""}`);

    const res = await fetch(url, {
        method: "GET",
        signal,
        cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
        throw new Error(data.message || "Failed to fetch ads");
    }

    return {
        ads: Array.isArray(data.ads) ? data.ads : [],
        totalAds: data.totalAds || 0,
        totalPages: data.totalPages || 0,
        page: data.page || params.page || 1,
    };
};

export const getHomeAds = createAsyncThunk(
    "homeAds/getHomeAds",
    async (
        {
            page = 1,
            limit = 1,
            category = "",
            location = "",
            search = "",
        } = {},
        { signal, rejectWithValue }
    ) => {
        try {
            const params = {
                page,
                limit,
                category,
                location,
                search,
            };

            const requests = [
                ["vip", "/api/ads/public/vip"],
                ["super", "/api/ads/public/super"],
                ["normal", "/api/ads/public/normal"],
            ];

            const results = await Promise.allSettled(
                requests.map(([key, path]) =>
                    fetchSectionAds({
                        path,
                        params,
                        signal,
                    }).then((data) => ({ key, data }))
                )
            );

            const payload = {
                vip: emptySection(),
                super: emptySection(),
                normal: emptySection(),
                sectionErrors: {},
            };

            results.forEach((result, index) => {
                const key = requests[index][0];

                if (result.status === "fulfilled") {
                    payload[key] = {
                        ...result.value.data,
                        error: null,
                    };
                } else {
                    payload.sectionErrors[key] =
                        result.reason?.message || "Failed to fetch ads";
                }
            });

            const allFailed = results.every((result) => result.status === "rejected");

            if (allFailed) {
                return rejectWithValue("Failed to fetch home ads");
            }

            return payload;
        } catch (error) {
            return rejectWithValue(error.message || "Failed to fetch home ads");
        }
    }
);

const emptySection = () => ({
    ads: [],
    totalAds: 0,
    totalPages: 0,
    page: 1,
    error: null,
});

const initialState = {
    vip: emptySection(),
    super: emptySection(),
    normal: emptySection(),

    loading: false,
    initialized: false,
    error: null,
    sectionErrors: {},
};

const homeAdsSlice = createSlice({
    name: "homeAds",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getHomeAds.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHomeAds.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;

                state.vip = action.payload.vip;
                state.super = action.payload.super;
                state.normal = action.payload.normal;
                state.sectionErrors = action.payload.sectionErrors || {};
            })
            .addCase(getHomeAds.rejected, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.error = action.payload || "Failed to fetch home ads";
            });
    },
});

export default homeAdsSlice.reducer;