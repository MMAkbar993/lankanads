"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import type { AppDispatch, RootState } from "@/store/index";
import {
    fetchSiteContent,
    updateSiteContent,
    type ContentBlock,
} from "@/store/slices/siteContentSlice";

function BlockEditor({ block }: { block: ContentBlock }) {
    const dispatch: AppDispatch = useDispatch();
    const { saving } = useSelector((state: RootState) => state.siteContent);

    // Rendered only once blocks have loaded (and keyed by block.key), so
    // props are correct at mount — no effect needed to sync them.
    const [title, setTitle] = useState(block.title);
    const [content, setContent] = useState(block.content);
    const [isActive, setIsActive] = useState(block.isActive);

    const handleSave = async () => {
        const result = await dispatch(
            updateSiteContent({ key: block.key, title, content, isActive })
        );

        if (updateSiteContent.fulfilled.match(result)) {
            toast.success(`${block.label} saved`);
        } else {
            toast.error((result.payload as string) || "Failed to save");
        }
    };

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-900">
                    {block.label}
                </h2>

                <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4"
                    />
                    Show on site
                </label>
            </div>

            <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                Heading (optional)
            </label>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Post Free Classified Ads in Sri Lanka"
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
            />

            <label className="mb-1 mt-4 block text-sm font-medium text-gray-700">
                Content
            </label>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                placeholder="Paste the SEO copy here. Line breaks are preserved and basic HTML is allowed."
                className="w-full resize-y rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-pink-600"
            />

            <button
                onClick={handleSave}
                disabled={saving}
                className="mt-4 rounded-lg bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50"
            >
                {saving ? "Saving..." : "Save"}
            </button>
        </div>
    );
}

export default function SeoContentPage() {
    const dispatch: AppDispatch = useDispatch();

    const { blocks, loading } = useSelector(
        (state: RootState) => state.siteContent
    );

    useEffect(() => {
        dispatch(fetchSiteContent());
    }, [dispatch]);

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-pink-600">
                    <Globe className="h-5 w-5 text-white" />
                </span>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">SEO Content</h1>
                    <p className="mt-1 text-base text-gray-500">
                        Editable content sections shown on the public site.
                    </p>
                </div>
            </div>

            <div className="mt-6 space-y-5">
                {loading && blocks.length === 0 && (
                    <p className="text-sm text-gray-400">Loading...</p>
                )}

                {blocks.map((block) => (
                    <BlockEditor key={block.key} block={block} />
                ))}
            </div>
        </div>
    );
}
