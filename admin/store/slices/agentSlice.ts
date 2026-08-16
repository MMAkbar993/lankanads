import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface Agent {
  _id: string;
  name: string;
  image: { url: string; filename: string };
  whatsapp: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface AgentState {
  agents: Agent[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
}

const initialState: AgentState = {
  agents: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
};

export const fetchAgents = createAsyncThunk(
  'agents/fetchAll',
  async (params: { page?: number; search?: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/admin/agents', { params: { ...params, limit: 20 } });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch agents');
    }
  }
);

export const createAgent = createAsyncThunk(
  'agents/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/admin/agents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create agent');
    }
  }
);

export const updateAgent = createAsyncThunk(
  'agents/update',
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/agents/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update agent');
    }
  }
);

export const deleteAgent = createAsyncThunk(
  'agents/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/agents/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete agent');
    }
  }
);

const agentSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) { state.page = action.payload; },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgents.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchAgents.fulfilled, (state, action) => {
        state.loading = false;
        state.agents = action.payload.agents;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAgents.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(createAgent.pending, (state) => { state.createLoading = true; })
      .addCase(createAgent.fulfilled, (state) => { state.createLoading = false; })
      .addCase(createAgent.rejected, (state, action) => { state.createLoading = false; state.error = action.payload as string; })
      .addCase(updateAgent.pending, (state) => { state.updateLoading = true; })
      .addCase(updateAgent.fulfilled, (state, action) => {
        state.updateLoading = false;
        const idx = state.agents.findIndex(a => a._id === action.payload.agent._id);
        if (idx !== -1) state.agents[idx] = action.payload.agent;
      })
      .addCase(updateAgent.rejected, (state, action) => { state.updateLoading = false; state.error = action.payload as string; })
      .addCase(deleteAgent.pending, (state) => { state.deleteLoading = true; })
      .addCase(deleteAgent.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.agents = state.agents.filter(a => a._id !== action.payload);
        state.total -= 1;
      })
      .addCase(deleteAgent.rejected, (state, action) => { state.deleteLoading = false; state.error = action.payload as string; });
  },
});

export const { setPage, clearError } = agentSlice.actions;
export default agentSlice.reducer;
