const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Server-side fetch for the admin-managed SEO content blocks. Failures are
// swallowed on purpose — an SEO block is decorative, so if the API is down
// the page should still render rather than error out.
export async function getSiteContent(keys = []) {
    try {
        if (!API_BASE_URL) return {};

        const query = keys.length ? `?keys=${encodeURIComponent(keys.join(","))}` : "";

        const res = await fetch(`${API_BASE_URL}/api/site-content/public${query}`, {
            // Revalidate periodically so admin edits appear without a redeploy.
            next: { revalidate: 300 },
        });

        if (!res.ok) return {};

        const data = await res.json();

        return data?.content || {};
    } catch {
        return {};
    }
}

export async function getBlogs({ page = 1, limit = 12 } = {}) {
    try {
        if (!API_BASE_URL) return { blogs: [], pages: 1, total: 0 };

        const res = await fetch(
            `${API_BASE_URL}/api/blogs?page=${page}&limit=${limit}`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) return { blogs: [], pages: 1, total: 0 };

        const data = await res.json();

        return {
            blogs: data?.blogs || [],
            pages: data?.pages || 1,
            total: data?.total || 0,
        };
    } catch {
        return { blogs: [], pages: 1, total: 0 };
    }
}

export async function getBlogBySlug(slug) {
    try {
        if (!API_BASE_URL) return null;

        const res = await fetch(
            `${API_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`,
            { next: { revalidate: 300 } }
        );

        if (!res.ok) return null;

        const data = await res.json();

        return data?.blog || null;
    } catch {
        return null;
    }
}
