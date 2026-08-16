import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface AdUser {
  _id: string;
  name?: string;
  fullName?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string;
  mobile?: string;
}

export interface Ad {
  _id: string;
  adId: string;

  /*
   * Backend user populate করলে AdUser object আসবে।
   * Populate না করলে শুধু user ID string আসতে পারে।
   */
  user: AdUser | string | null;

  image: {
    url: string;
    filename: string;
  };

  type: string;
  title: string;
  category: string;
  location: string;
  price: number;
  description: string;
  phone: string;
  whatsappNumber: string;
  status: 'pending' | 'approved' | 'rejected';
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  approvedAt?: string;
  expiresAt?: string;
}

interface AdState {
  ads: Ad[];
  total: number;
  page: number;
  pages: number;
  loading: boolean;
  error: string | null;
  updateLoading: boolean;
  adTypes: string[];
}

interface FetchAdsParams {
  page?: number;
  search?: string;
  category?: string;
}

interface UpdateAdStatusParams {
  id: string;
  status: string;
}

interface UpdateAdTypeParams {
  id: string;
  type: string;
}

interface UpdateAdParams {
  id: string;
  status?: string;
  type?: string;
}

interface AdsResponse {
  ads?: Ad[];
  total?: number;
  page?: number;
  pages?: number;
  adTypes?: string[];
}

interface UpdateAdResponse {
  success?: boolean;
  message?: string;
  ad?: Ad;
}

const initialState: AdState = {
  ads: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  error: null,
  updateLoading: false,
  adTypes: [],
};

export const fetchAds = createAsyncThunk<
  AdsResponse,
  FetchAdsParams,
  {
    rejectValue: string;
  }
>(
  'ads/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get<AdsResponse>('/admin/ads', {
        params: {
          ...params,
          limit: 20,
        },
      });

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch ads'
      );
    }
  }
);

export const updateAdStatus = createAsyncThunk<
  UpdateAdResponse,
  UpdateAdStatusParams,
  {
    rejectValue: string;
  }
>(
  'ads/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<UpdateAdResponse>(
        `/admin/ads/${id}/status`,
        { status }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update status'
      );
    }
  }
);

export const updateAdType = createAsyncThunk<
  UpdateAdResponse,
  UpdateAdTypeParams,
  {
    rejectValue: string;
  }
>(
  'ads/updateType',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<UpdateAdResponse>(
        `/admin/ads/${id}/type`,
        { type }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update type'
      );
    }
  }
);

export const updateAd = createAsyncThunk<
  UpdateAdResponse,
  UpdateAdParams,
  {
    rejectValue: string;
  }
>(
  'ads/update',
  async ({ id, status, type }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch<UpdateAdResponse>(
        `/admin/ads/${id}`,
        {
          status,
          type,
        }
      );

      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update ad'
      );
    }
  }
);

/*
 * Status বা type update করার পর backend যদি populated user object
 * না পাঠিয়ে শুধু user ID পাঠায়, তাহলে আগের user information যেন
 * হারিয়ে না যায়, সেজন্য existing user preserve করা হচ্ছে।
 */
const updateAdInState = (
  state: AdState,
  updatedAd: Ad
) => {
  const index = state.ads.findIndex(
    (item) => item._id === updatedAd._id
  );

  if (index === -1) return;

  const existingAd = state.ads[index];
  let resolvedUser: Ad['user'] = existingAd.user;

  if (
    updatedAd.user &&
    typeof updatedAd.user === 'object'
  ) {
    const existingUser =
      existingAd.user &&
        typeof existingAd.user === 'object'
        ? existingAd.user
        : {};

    resolvedUser = {
      ...existingUser,
      ...updatedAd.user,
    } as AdUser;
  } else if (!existingAd.user) {
    resolvedUser = updatedAd.user;
  }

  state.ads[index] = {
    ...existingAd,
    ...updatedAd,
    user: resolvedUser,
  };
};

const adSlice = createSlice({
  name: 'ads',
  initialState,

  reducers: {
    setPage(
      state,
      action: PayloadAction<number>
    ) {
      state.page = action.payload;
    },

    clearError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch ads
      .addCase(fetchAds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAds.fulfilled, (state, action) => {
        state.loading = false;
        state.ads = action.payload.ads || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;

        state.adTypes =
          action.payload.adTypes?.length
            ? action.payload.adTypes
            : [
              'Super Ad',
              'Normal Ad',
              'VIP Ad',
              'NRA Ad',
            ];
      })

      .addCase(fetchAds.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || 'Failed to fetch ads';
      })

      // Update ad status
      .addCase(updateAdStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(
        updateAdStatus.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          if (action.payload.ad) {
            updateAdInState(
              state,
              action.payload.ad
            );
          }
        }
      )

      .addCase(
        updateAdStatus.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error =
            action.payload ||
            'Failed to update status';
        }
      )

      // Update ad type
      .addCase(updateAdType.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(
        updateAdType.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          if (action.payload.ad) {
            updateAdInState(
              state,
              action.payload.ad
            );
          }
        }
      )

      .addCase(
        updateAdType.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error =
            action.payload ||
            'Failed to update type';
        }
      )

      // Update full ad
      .addCase(updateAd.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })

      .addCase(
        updateAd.fulfilled,
        (state, action) => {
          state.updateLoading = false;

          if (action.payload.ad) {
            updateAdInState(
              state,
              action.payload.ad
            );
          }
        }
      )

      .addCase(
        updateAd.rejected,
        (state, action) => {
          state.updateLoading = false;
          state.error =
            action.payload || 'Failed to update ad';
        }
      );
  },
});

export const {
  setPage,
  clearError,
} = adSlice.actions;

export default adSlice.reducer;
