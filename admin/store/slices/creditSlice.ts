import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/axios';
import type { User } from './userSlice';

export interface Agent extends User {
    adCount: number;
}

export interface CreditTransaction {
    _id: string;
    user: string;
    type: 'credit' | 'debit';
    amount: number;
    ad: { _id: string; adId: string; title: string; type: string } | null;
    description: string;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: string;
}

export interface AdTypeCost {
    _id: string;
    type: string;
    creditCost: number;
}

interface CreditState {
    agents: Agent[];
    agentsTotal: number;
    agentsPage: number;
    agentsPages: number;
    agentsLoading: boolean;

    transactions: CreditTransaction[];
    transactionsTotal: number;
    transactionsPages: number;
    transactionsLoading: boolean;

    adTypeCosts: AdTypeCost[];
    adTypeCostsLoading: boolean;

    topUpLoading: boolean;
    error: string | null;
}

const initialState: CreditState = {
    agents: [],
    agentsTotal: 0,
    agentsPage: 1,
    agentsPages: 1,
    agentsLoading: false,

    transactions: [],
    transactionsTotal: 0,
    transactionsPages: 1,
    transactionsLoading: false,

    adTypeCosts: [],
    adTypeCostsLoading: false,

    topUpLoading: false,
    error: null,
};

const extractMessage = (error: unknown, fallback: string) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
};

export const fetchAgents = createAsyncThunk(
    'credit/fetchAgents',
    async (params: { page?: number } | undefined, thunkAPI) => {
        try {
            const res = await api.get('/api/admin/agents-list', {
                params: { page: params?.page ?? 1, limit: 20 },
            });

            return res.data as {
                agents: Agent[];
                total: number;
                page: number;
                pages: number;
            };
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to fetch agents')
            );
        }
    }
);

export const topUpAgent = createAsyncThunk(
    'credit/topUpAgent',
    async (
        { userId, amount, description }: { userId: string; amount: number; description?: string },
        thunkAPI
    ) => {
        try {
            const res = await api.post(`/api/admin/users/${userId}/top-up`, {
                amount,
                description,
            });

            return res.data.user as User;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to top up agent')
            );
        }
    }
);

export const adjustAgentBalance = createAsyncThunk(
    'credit/adjustAgentBalance',
    async (
        { userId, amount, description }: { userId: string; amount: number; description?: string },
        thunkAPI
    ) => {
        try {
            const res = await api.patch(`/api/admin/users/${userId}/adjust-balance`, {
                amount,
                description,
            });

            return res.data.user as User;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to adjust balance')
            );
        }
    }
);

export const removeAgent = createAsyncThunk(
    'credit/removeAgent',
    async (userId: string, thunkAPI) => {
        try {
            const res = await api.patch(`/api/admin/users/${userId}/remove-agent`);

            return res.data.user as User;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to remove agent')
            );
        }
    }
);

export const fetchAgentTransactions = createAsyncThunk(
    'credit/fetchAgentTransactions',
    async (userId: string, thunkAPI) => {
        try {
            const res = await api.get(`/api/admin/users/${userId}/transactions`, {
                params: { limit: 50 },
            });

            return res.data as {
                transactions: CreditTransaction[];
                total: number;
                pages: number;
            };
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to fetch transactions')
            );
        }
    }
);

export const fetchAdTypeCosts = createAsyncThunk(
    'credit/fetchAdTypeCosts',
    async (_, thunkAPI) => {
        try {
            const res = await api.get('/api/admin/ad-type-costs');

            return res.data.costs as AdTypeCost[];
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to fetch ad type costs')
            );
        }
    }
);

export const updateAdTypeCost = createAsyncThunk(
    'credit/updateAdTypeCost',
    async ({ type, creditCost }: { type: string; creditCost: number }, thunkAPI) => {
        try {
            const res = await api.patch(
                `/api/admin/ad-type-costs/${encodeURIComponent(type)}`,
                { creditCost }
            );

            return res.data.cost as AdTypeCost;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to update ad type cost')
            );
        }
    }
);

const creditSlice = createSlice({
    name: 'credit',
    initialState,
    reducers: {
        clearCreditError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAgents.pending, (state) => {
                state.agentsLoading = true;
                state.error = null;
            })
            .addCase(fetchAgents.fulfilled, (state, action) => {
                state.agentsLoading = false;
                state.agents = action.payload.agents ?? [];
                state.agentsTotal = action.payload.total ?? 0;
                state.agentsPage = action.payload.page ?? 1;
                state.agentsPages = action.payload.pages ?? 1;
            })
            .addCase(fetchAgents.rejected, (state, action) => {
                state.agentsLoading = false;
                state.error = (action.payload as string) ?? 'Failed to fetch agents';
            })

            .addCase(topUpAgent.pending, (state) => {
                state.topUpLoading = true;
                state.error = null;
            })
            .addCase(topUpAgent.fulfilled, (state, action) => {
                state.topUpLoading = false;

                const index = state.agents.findIndex(
                    (a) => a._id === action.payload._id
                );

                if (index !== -1) {
                    state.agents[index] = {
                        ...state.agents[index],
                        ...action.payload,
                    };
                }
            })
            .addCase(topUpAgent.rejected, (state, action) => {
                state.topUpLoading = false;
                state.error = (action.payload as string) ?? 'Failed to top up agent';
            })

            .addCase(adjustAgentBalance.pending, (state) => {
                state.topUpLoading = true;
                state.error = null;
            })
            .addCase(adjustAgentBalance.fulfilled, (state, action) => {
                state.topUpLoading = false;

                const index = state.agents.findIndex(
                    (a) => a._id === action.payload._id
                );

                if (index !== -1) {
                    state.agents[index] = {
                        ...state.agents[index],
                        ...action.payload,
                    };
                }
            })
            .addCase(adjustAgentBalance.rejected, (state, action) => {
                state.topUpLoading = false;
                state.error = (action.payload as string) ?? 'Failed to adjust balance';
            })

            .addCase(removeAgent.fulfilled, (state, action) => {
                state.agents = state.agents.filter((a) => a._id !== action.payload._id);
                state.agentsTotal = Math.max(0, state.agentsTotal - 1);
            })
            .addCase(removeAgent.rejected, (state, action) => {
                state.error = (action.payload as string) ?? 'Failed to remove agent';
            })

            .addCase(fetchAgentTransactions.pending, (state) => {
                state.transactionsLoading = true;
            })
            .addCase(fetchAgentTransactions.fulfilled, (state, action) => {
                state.transactionsLoading = false;
                state.transactions = action.payload.transactions ?? [];
                state.transactionsTotal = action.payload.total ?? 0;
                state.transactionsPages = action.payload.pages ?? 1;
            })
            .addCase(fetchAgentTransactions.rejected, (state, action) => {
                state.transactionsLoading = false;
                state.error =
                    (action.payload as string) ?? 'Failed to fetch transactions';
            })

            .addCase(fetchAdTypeCosts.pending, (state) => {
                state.adTypeCostsLoading = true;
            })
            .addCase(fetchAdTypeCosts.fulfilled, (state, action) => {
                state.adTypeCostsLoading = false;
                state.adTypeCosts = action.payload;
            })
            .addCase(fetchAdTypeCosts.rejected, (state, action) => {
                state.adTypeCostsLoading = false;
                state.error =
                    (action.payload as string) ?? 'Failed to fetch ad type costs';
            })

            .addCase(updateAdTypeCost.fulfilled, (state, action) => {
                const index = state.adTypeCosts.findIndex(
                    (c) => c.type === action.payload.type
                );

                if (index !== -1) {
                    state.adTypeCosts[index] = action.payload;
                } else {
                    state.adTypeCosts.push(action.payload);
                }
            });
    },
});

export const { clearCreditError } = creditSlice.actions;

export default creditSlice.reducer;
