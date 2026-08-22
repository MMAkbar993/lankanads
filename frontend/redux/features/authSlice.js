import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const COOKIE_MAX_AGE = 15 * 24 * 60 * 60;

const setCookie = (name, value) => {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=${encodeURIComponent(
        value
    )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
};

const getCookie = (name) => {
    if (typeof document === "undefined") return null;

    const cookies = document.cookie.split("; ");

    const cookie = cookies.find((item) =>
        item.startsWith(`${name}=`)
    );

    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
};

const removeCookie = (name) => {
    if (typeof document === "undefined") return;

    document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
};

// Picks up server-side changes to the logged-in user (e.g. an admin top-up
// or role change) without requiring a fresh OTP login.
export const refreshUser = createAsyncThunk(
    "auth/refreshUser",
    async (_, { rejectWithValue }) => {
        try {
            const token = getCookie("token");

            if (!token) {
                throw new Error("Not logged in");
            }

            const res = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return res.data.user;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to refresh user"
            );
        }
    }
);

const initialState = {
    user: null,
    token: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.user = action.payload.user || null;
            state.token = action.payload.token;
            state.isLoggedIn = true;

            setCookie("token", action.payload.token);

            if (action.payload.user) {
                setCookie("user", JSON.stringify(action.payload.user));
            }
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isLoggedIn = false;

            removeCookie("token");
            removeCookie("user");
        },

        loadUserFromStorage: (state) => {
            const token = getCookie("token");
            const user = getCookie("user");

            if (token) {
                state.token = token;
                state.isLoggedIn = true;

                if (user) {
                    try {
                        state.user = JSON.parse(user);
                    } catch {
                        state.user = null;
                    }
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(refreshUser.fulfilled, (state, action) => {
            state.user = action.payload;
            setCookie("user", JSON.stringify(action.payload));
        });
    },
});

export const { loginSuccess, logout, loadUserFromStorage } = authSlice.actions;

export default authSlice.reducer;