"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/store/index";
import { fetchBlogs, deleteBlog } from "@/store/slices/blogSlice";

const formatDate = (value?: string | null) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(d);
};

export default function BlogsPage() {
    const dispatch: AppDispatch = useDispatch();

    const { blogs, total, loading } = useSelector(
        (state: RootState) => state.blogs
    );

    const [search, setSearch] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(fetchBlogs({ page: 1, search }));
        }, 400);

        return () => clearTimeout(timer);
    }, [dispatch, search]);

    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;

        setDeletingId(id);

        const result = await dispatch(deleteBlog(id));

        if (deleteBlog.fulfilled.match(result)) {
            toast.success("Blog deleted");
        } else {
            toast.error((result.payload as string) || "Failed to delete blog");
        }

        setDeletingId(null);
    };

    return (
        <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Posts</h1>
                    <p className="mt-1 text-base text-gray-500">
                        Write and publish SEO articles for the public blog.
                    </p>
                </div>

                <Link
                    href="/dashboard/blogs/new"
                    className="flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
                >
                    <Plus className="h-4 w-4" />
                    New Post
                </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-600">
                            <FileText className="h-5 w-5 text-white" />
                        </span>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {total} Posts
                        </h2>
                    </div>

                    <div className="relative w-full sm:w-80">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or slug..."
                            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm text-gray-700 outline-none transition focus:border-pink-600"
                        />
                    </div>
                </div>

                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse">
                        <thead>
                            <tr className="bg-gray-50">
                                {["Title", "Slug", "Status", "Published", "Actions"].map(
                                    (col) => (
                                        <th
                                            key={col}
                                            className="whitespace-nowrap px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                                        >
                                            {col}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-16 text-center text-sm text-gray-400"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {!loading && blogs.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-6 py-16 text-center text-sm text-gray-400"
                                    >
                                        No blog posts yet — create your first one.
                                    </td>
                                </tr>
                            )}

                            {!loading &&
                                blogs.map((blog) => (
                                    <tr
                                        key={blog._id}
                                        className="border-t border-gray-100 transition-colors hover:bg-gray-50"
                                    >
                                        <td className="max-w-[260px] truncate px-6 py-4 text-[15px] font-medium text-gray-900">
                                            {blog.title}
                                        </td>

                                        <td className="max-w-[220px] truncate px-6 py-4 font-mono text-xs text-gray-500">
                                            /{blog.slug}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                    blog.status === "published"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-amber-100 text-amber-700"
                                                }`}
                                            >
                                                {blog.status}
                                            </span>
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-400">
                                            {formatDate(blog.publishedAt)}
                                        </td>

                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/dashboard/blogs/${blog._id}`}
                                                    className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(blog._id, blog.title)
                                                    }
                                                    disabled={deletingId === blog._id}
                                                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    {deletingId === blog._id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
