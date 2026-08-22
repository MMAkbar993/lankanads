import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/axios';

export const USERS_LIMIT = 20;

export interface User {
    _id: string;
    accountId: string;
    name: string | null;
    phone: string;
    isVerified: boolean;
    lastLoginAt: string | null;
    role: 'user' | 'agent';
    creditBalance: number;
    createdAt: string;
    updatedAt: string;
}

export interface FetchUsersParams {
    page?: number;
    search?: string;
}

export interface FetchUsersResponse {
    success?: boolean;
    users: User[];
    total: number;
    page: number;
    pages: number;
}

export interface UserState {
    users: User[];
    total: number;
    page: number;
    pages: number;
    search: string;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    total: 0,
    page: 1,
    pages: 1,
    search: '',
    loading: false,
    error: null,
};

export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (params: FetchUsersParams, thunkAPI) => {
        const page = params?.page ?? 1;
        const search = params?.search ?? '';

        try {
            const res = await api.get('/api/admin/users', {
                params: {
                    page,
                    search,
                    limit: USERS_LIMIT,
                },
            });

            return res.data as FetchUsersResponse;
        } catch (error: unknown) {
            let message = 'Failed to fetch users';

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message ?? message;
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const makeAgent = createAsyncThunk(
    'users/makeAgent',
    async (userId: string, thunkAPI) => {
        try {
            const res = await api.patch(`/api/admin/users/${userId}/make-agent`);

            return res.data.user as User;
        } catch (error: unknown) {
            let message = 'Failed to promote user to agent';

            if (axios.isAxiosError(error)) {
                message = error.response?.data?.message ?? message;
            }

            return thunkAPI.rejectWithValue(message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,

    reducers: {
        setUserSearch(state, action: PayloadAction<string>) {
            state.search = action.payload;
            state.page = 1;
        },

        setUserPage(state, action: PayloadAction<number>) {
            state.page = action.payload;
        },

        clearUserError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users ?? [];
                state.total = Number(action.payload.total) || 0;
                state.pages = Number(action.payload.pages) || 1;
            })

            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    (action.payload as string) ?? 'Failed to fetch users';
                state.users = [];
                state.total = 0;
                state.pages = 1;
            })

            .addCase(makeAgent.fulfilled, (state, action) => {
                const index = state.users.findIndex(
                    (u) => u._id === action.payload._id
                );

                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            });
    },
});

export const { setUserSearch, setUserPage, clearUserError } = userSlice.actions;

export default userSlice.reducer;