import Link from "next/link";
import Image from "next/image";
import { getBlogs } from "@/lib/seoContent";

// Latest published posts, shown on the homepage. Server-rendered so the
// blog titles and excerpts are in the HTML search engines see, which is the
// whole point of running the blog.
//
// Renders nothing at all until at least one post is published, so the
// homepage never shows an empty "Blog" heading.
export default async function HomeBlogSection({ limit = 3 }) {
    const { blogs } = await getBlogs({ page: 1, limit });

    if (!blogs.length) return null;

    return (
        <section className="mt-8 rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-[18px] font-extrabold text-slate-900 sm:text-[20px]">
                        📰 From Our Blog
                    </h2>
                    <p className="mt-1 text-[13px] text-slate-500">
                        Tips, guides and updates from LankanAdsLK.
                    </p>
                </div>

                <Link
                    href="/blog"
                    className="shrink-0 rounded-md bg-teal-600 px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-teal-700"
                >
                    Blogs ➜
                </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <BlogCard key={blog._id} blog={blog} />
                ))}
            </div>
        </section>
    );
}

function BlogCard({ blog }) {
    return (
        <Link
            href={`/blog/${blog.slug}`}
            className="group flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
        >
            <div className="relative h-[150px] w-full bg-slate-100">
                {blog.coverImage?.url ? (
                    <Image
                        src={blog.coverImage.url}
                        alt={blog.title}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                        LankanAdsLK
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-[15px] font-bold leading-6 text-slate-900 group-hover:text-teal-700">
                    {blog.title}
                </h3>

                {blog.excerpt && (
                    <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-slate-500">
                        {blog.excerpt}
                    </p>
                )}

                <span className="mt-4 inline-flex w-fit rounded-md bg-[var(--primary)] px-4 py-2 text-[12px] font-semibold text-white">
                    Read More
                </span>
            </div>
        </Link>
    );
}
