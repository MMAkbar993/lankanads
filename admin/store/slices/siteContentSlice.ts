import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/axios';

export interface ContentBlock {
    key: string;
    label: string;
    title: string;
    content: string;
    isActive: boolean;
}

interface SiteContentState {
    blocks: ContentBlock[];
    loading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: SiteContentState = {
    blocks: [],
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

export const fetchSiteContent = createAsyncThunk(
    'siteContent/fetch',
    async (_, thunkAPI) => {
        try {
            const res = await api.get('/api/site-content');

            return res.data.blocks as ContentBlock[];
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to fetch site content')
            );
        }
    }
);

export const updateSiteContent = createAsyncThunk(
    'siteContent/update',
    async (
        {
            key,
            title,
            content,
            isActive,
        }: { key: string; title: string; content: string; isActive: boolean },
        thunkAPI
    ) => {
        try {
            const res = await api.patch(`/api/site-content/${key}`, {
                title,
                content,
                isActive,
            });

            return res.data.block as ContentBlock;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to update content')
            );
        }
    }
);

const siteContentSlice = createSlice({
    name: 'siteContent',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSiteContent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSiteContent.fulfilled, (state, action) => {
                state.loading = false;
                state.blocks = action.payload ?? [];
            })
            .addCase(fetchSiteContent.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ?? 'Failed to fetch site content';
            })

            .addCase(updateSiteContent.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(updateSiteContent.fulfilled, (state, action) => {
                state.saving = false;

                const index = state.blocks.findIndex(
                    (b) => b.key === action.payload.key
                );

                if (index !== -1) {
                    state.blocks[index] = {
                        ...state.blocks[index],
                        ...action.payload,
                    };
                }
            })
            .addCase(updateSiteContent.rejected, (state, action) => {
                state.saving = false;
                state.error = (action.payload as string) ?? 'Failed to update content';
            });
    },
});

export default siteContentSlice.reducer;
