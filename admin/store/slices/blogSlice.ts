import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/lib/axios';

export interface Blog {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: { url: string; filename: string };
    metaTitle: string;
    metaDescription: string;
    status: 'draft' | 'published';
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface BlogState {
    blogs: Blog[];
    current: Blog | null;
    total: number;
    page: number;
    pages: number;
    loading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: BlogState = {
    blogs: [],
    current: null,
    total: 0,
    page: 1,
    pages: 1,
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

export const fetchBlogs = createAsyncThunk(
    'blogs/fetchBlogs',
    async (params: { page?: number; search?: string } | undefined, thunkAPI) => {
        try {
            const res = await api.get('/admin/blogs', {
                params: {
                    page: params?.page ?? 1,
                    search: params?.search ?? '',
                    limit: 20,
                },
            });

            return res.data as {
                blogs: Blog[];
                total: number;
                page: number;
                pages: number;
            };
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to fetch blogs')
            );
        }
    }
);

export const fetchBlogById = createAsyncThunk(
    'blogs/fetchBlogById',
    async (id: string, thunkAPI) => {
        try {
            const res = await api.get(`/admin/blogs/${id}`);

            return res.data.blog as Blog;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to fetch blog')
            );
        }
    }
);

export const createBlog = createAsyncThunk(
    'blogs/createBlog',
    async (formData: FormData, thunkAPI) => {
        try {
            const res = await api.post('/admin/blogs', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return res.data.blog as Blog;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to create blog')
            );
        }
    }
);

export const updateBlog = createAsyncThunk(
    'blogs/updateBlog',
    async ({ id, formData }: { id: string; formData: FormData }, thunkAPI) => {
        try {
            const res = await api.patch(`/admin/blogs/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return res.data.blog as Blog;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to update blog')
            );
        }
    }
);

export const deleteBlog = createAsyncThunk(
    'blogs/deleteBlog',
    async (id: string, thunkAPI) => {
        try {
            await api.delete(`/admin/blogs/${id}`);

            return id;
        } catch (error: unknown) {
            return thunkAPI.rejectWithValue(
                extractMessage(error, 'Failed to delete blog')
            );
        }
    }
);

const blogSlice = createSlice({
    name: 'blogs',
    initialState,
    reducers: {
        clearCurrentBlog(state) {
            state.current = null;
        },
        clearBlogError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBlogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload.blogs ?? [];
                state.total = action.payload.total ?? 0;
                state.page = action.payload.page ?? 1;
                state.pages = action.payload.pages ?? 1;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? 'Failed to fetch blogs';
            })

            .addCase(fetchBlogById.pending, (state) => {
                state.loading = true;
                state.current = null;
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.current = action.payload;
            })
            .addCase(fetchBlogById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) ?? 'Failed to fetch blog';
            })

            .addCase(createBlog.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(createBlog.fulfilled, (state) => {
                state.saving = false;
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.saving = false;
                state.error = (action.payload as string) ?? 'Failed to create blog';
            })

            .addCase(updateBlog.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.saving = false;
                state.current = action.payload;
            })
            .addCase(updateBlog.rejected, (state, action) => {
                state.saving = false;
                state.error = (action.payload as string) ?? 'Failed to update blog';
            })

            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.blogs = state.blogs.filter((b) => b._id !== action.payload);
                state.total = Math.max(0, state.total - 1);
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.error = (action.payload as string) ?? 'Failed to delete blog';
            });
    },
});

export const { clearCurrentBlog, clearBlogError } = blogSlice.actions;

export default blogSlice.reducer;
