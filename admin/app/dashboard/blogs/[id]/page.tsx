"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store/index";
import { fetchBlogById, clearCurrentBlog } from "@/store/slices/blogSlice";
import BlogForm from "../BlogForm";

export default function EditBlogPage() {
    const dispatch: AppDispatch = useDispatch();
    const { id } = useParams<{ id: string }>();

    const { current, loading } = useSelector((state: RootState) => state.blogs);

    useEffect(() => {
        if (id) dispatch(fetchBlogById(id));

        return () => {
            dispatch(clearCurrentBlog());
        };
    }, [dispatch, id]);

    return (
        <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">Edit Blog Post</h1>
            <p className="mt-1 text-base text-gray-500">
                Changes go live as soon as you save a published post.
            </p>

            {loading && !current ? (
                <p className="mt-8 text-sm text-gray-400">Loading...</p>
            ) : current ? (
                <BlogForm existing={current} />
            ) : (
                <p className="mt-8 text-sm text-gray-400">Blog post not found.</p>
            )}
        </div>
    );
}
