import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getPublicAgents = createAsyncThunk(
    "agents/getPublicAgents",
    async ({ page = 1, limit = 20, search = "" } = {}, { rejectWithValue }) => {
        try {
            const params = new URLSearchParams();

            params.append("page", page);
            params.append("limit", limit);

            if (search.trim()) {
                params.append("search", search.trim());
            }

            const res = await axios.get(
                `${API_BASE_URL}/api/agents/public?${params.toString()}`
            );

            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to get agents"
            );
        }
    }
);

const agentSlice = createSlice({
    name: "agents",
    initialState: {
        agents: [],
        loading: false,
        error: null,

        page: 1,
        limit: 20,
        totalAgents: 0,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false,
    },
    reducers: {
        clearAgentError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getPublicAgents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPublicAgents.fulfilled, (state, action) => {
                state.loading = false;

                state.agents = action.payload?.agents || [];
                state.page = action.payload?.page || 1;
                state.limit = action.payload?.limit || 20;
                state.totalAgents = action.payload?.totalAgents || 0;
                state.totalPages = action.payload?.totalPages || 1;
                state.hasNextPage = action.payload?.hasNextPage || false;
                state.hasPrevPage = action.payload?.hasPrevPage || false;
            })
            .addCase(getPublicAgents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearAgentError } = agentSlice.actions;

export default agentSlice.reducer;