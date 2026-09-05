"use client";

import BlogForm from "../BlogForm";

export default function NewBlogPage() {
    return (
        <div className="p-6 md:p-8">
            <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
            <p className="mt-1 text-base text-gray-500">
                Drafts stay hidden from the public blog until you publish them.
            </p>

            <BlogForm />
        </div>
    );
}
