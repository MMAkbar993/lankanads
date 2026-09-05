"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/store/index";
import { createBlog, updateBlog, type Blog } from "@/store/slices/blogSlice";

interface BlogFormProps {
    existing?: Blog | null;
}

export default function BlogForm({ existing = null }: BlogFormProps) {
    const dispatch: AppDispatch = useDispatch();
    const router = useRouter();

    const { saving } = useSelector((state: RootState) => state.blogs);

    // The edit page only mounts this form once the post has loaded, so the
    // initial values are already correct — no effect needed to sync them.
    const [title, setTitle] = useState(existing?.title ?? "");
    const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
    const [content, setContent] = useState(existing?.content ?? "");
    const [metaTitle, setMetaTitle] = useState(existing?.metaTitle ?? "");
    const [metaDescription, setMetaDescription] = useState(
        existing?.metaDescription ?? ""
    );
    const [status, setStatus] = useState<"draft" | "published">(
        existing?.status ?? "draft"
    );
    const [coverFile, setCoverFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim() || !content.trim()) {
            toast.error("Title and content are required");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("excerpt", excerpt);
        formData.append("metaTitle", metaTitle);
        formData.append("metaDescription", metaDescription);
        formData.append("status", status);

        if (coverFile) formData.append("coverImage", coverFile);

        const result = existing
            ? await dispatch(updateBlog({ id: existing._id, formData }))
            : await dispatch(createBlog(formData));

        const succeeded = existing
            ? updateBlog.fulfilled.match(result)
            : createBlog.fulfilled.match(result);

        if (succeeded) {
            toast.success(existing ? "Blog updated" : "Blog created");
            router.push("/dashboard/blogs");
        } else {
            toast.error((result.payload as string) || "Failed to save blog");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="How to post a successful ad in Colombo"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
                />

                {existing && (
                    <p className="mt-2 text-xs text-gray-400">
                        URL: /blog/{existing.slug}
                        {existing.status === "published" &&
                            " — the URL stays fixed once published so existing links keep working."}
                    </p>
                )}

                <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                    Excerpt
                </label>
                <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    rows={2}
                    placeholder="Short summary shown on the blog listing and in search results."
                    className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
                />

                <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                    Content
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={16}
                    placeholder={"Write the article here.\n\nBasic HTML is supported, e.g. <h2>Heading</h2> and <p>paragraph</p>."}
                    className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-sm outline-none focus:border-pink-600"
                />
                <p className="mt-1 text-xs text-gray-400">
                    Line breaks are preserved. Basic HTML tags are allowed for
                    headings, links and lists.
                </p>

                <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                    Cover image
                </label>
                <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {existing?.coverImage?.url && !coverFile && (
                    <p className="mt-1 text-xs text-gray-400">
                        A cover image is already set — upload a new one to replace it.
                    </p>
                )}
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900">SEO</h2>
                <p className="mt-0.5 text-sm text-gray-400">
                    Leave blank to fall back to the title and excerpt.
                </p>

                <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                    Meta title
                </label>
                <input
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
                />

                <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                    Meta description
                </label>
                <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={2}
                    className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <select
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value as "draft" | "published")
                    }
                    className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
                >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                </select>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50"
                >
                    {saving ? "Saving..." : existing ? "Save Changes" : "Create Post"}
                </button>

                <Link
                    href="/dashboard/blogs"
                    className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
