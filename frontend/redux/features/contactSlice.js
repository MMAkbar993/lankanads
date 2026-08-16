import {
    createAsyncThunk,
    createSlice,
} from "@reduxjs/toolkit";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;

export const sendContactMessage =
    createAsyncThunk(
        "contact/sendContactMessage",

        async (
            contactData,
            { rejectWithValue }
        ) => {
            try {
                if (!API_BASE_URL) {
                    return rejectWithValue(
                        "API base URL is missing"
                    );
                }

                const response = await fetch(
                    `${API_BASE_URL.replace(
                        /\/$/,
                        ""
                    )}/api/contact`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify(
                            contactData
                        ),
                    }
                );

                const result =
                    await response.json();

                if (!response.ok) {
                    return rejectWithValue(
                        result?.message ||
                        "Failed to send message"
                    );
                }

                return result;
            } catch (error) {
                return rejectWithValue(
                    error?.message ||
                    "Something went wrong"
                );
            }
        }
    );

const initialState = {
    isLoading: false,
    isSubmitted: false,
    successMessage: "",
    error: null,
};

const contactSlice = createSlice({
    name: "contact",

    initialState,

    reducers: {
        resetContactState: (state) => {
            state.isLoading = false;
            state.isSubmitted = false;
            state.successMessage = "";
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(
                sendContactMessage.pending,
                (state) => {
                    state.isLoading = true;
                    state.isSubmitted = false;
                    state.successMessage = "";
                    state.error = null;
                }
            )

            .addCase(
                sendContactMessage.fulfilled,
                (state, action) => {
                    state.isLoading = false;
                    state.isSubmitted = true;

                    state.successMessage =
                        action.payload?.message ||
                        "Message sent successfully";

                    state.error = null;
                }
            )

            .addCase(
                sendContactMessage.rejected,
                (state, action) => {
                    state.isLoading = false;
                    state.isSubmitted = false;
                    state.successMessage = "";

                    state.error =
                        action.payload ||
                        "Failed to send message";
                }
            );
    },
});

export const { resetContactState } =
    contactSlice.actions;

export default contactSlice.reducer;