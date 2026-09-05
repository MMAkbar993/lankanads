import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug } from "@/lib/seoContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lankanadslk.com";

// Server-rendered metadata is the whole point of this page being a server
// component — search engines get a real title/description/canonical in the
// initial HTML rather than something filled in client-side.
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) {
        return { title: "Blog | LankanAdsLK" };
    }

    const title = blog.metaTitle || `${blog.title} | LankanAdsLK`;
    const description = blog.metaDescription || blog.excerpt || "";
    const canonical = `${SITE_URL}/blog/${blog.slug}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
            images: blog.coverImage?.url ? [blog.coverImage.url] : undefined,
        },
    };
}

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
};

export default async function BlogDetailPage({ params }) {
    const { slug } = await params;
    const blog = await getBlogBySlug(slug);

    if (!blog) notFound();

    return (
        <article className="mx-auto max-w-3xl px-4 py-6">
            <Link
                href="/blog"
                className="text-[13px] font-semibold text-[#FF0F87] hover:underline"
            >
                ← Back to blog
            </Link>

            <h1 className="mt-4 text-[26px] font-bold leading-9 text-slate-900 sm:text-[32px]">
                {blog.title}
            </h1>

            <p className="mt-2 text-[13px] text-slate-400">
                {formatDate(blog.publishedAt || blog.createdAt)}
            </p>

            {blog.coverImage?.url && (
                <div className="relative mt-5 h-[220px] w-full overflow-hidden rounded-xl bg-slate-100 sm:h-[360px]">
                    <Image
                        src={blog.coverImage.url}
                        alt={blog.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                    />
                </div>
            )}

            {/* Content is authored by admins in the dashboard, so basic HTML
                is rendered as-is; whitespace-pre-line keeps plain-text line
                breaks intact for posts written without any markup. */}
            <div
                className="mt-6 whitespace-pre-line text-[15px] leading-7 text-slate-700 [&_a]:text-[#FF0F87] [&_a]:underline [&_h2]:mt-6 [&_h2]:text-[20px] [&_h2]:font-bold [&_h3]:mt-5 [&_h3]:text-[17px] [&_h3]:font-bold [&_li]:ml-5 [&_li]:list-disc"
                dangerouslySetInnerHTML={{ __html: blog.content }}
            />
        </article>
    );
}
