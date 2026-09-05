import Link from "next/link";
import Image from "next/image";
import { getBlogs } from "@/lib/seoContent";

export const metadata = {
    title: "Blog | LankanAdsLK",
    description:
        "Tips, guides and updates on posting and finding classified ads in Sri Lanka.",
};

const formatDate = (value) => {
    if (!value) return "";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
};

export default async function BlogListingPage() {
    const { blogs } = await getBlogs({ page: 1, limit: 24 });

    return (
        <section className="mx-auto max-w-5xl px-4 py-6">
            <h1 className="text-[26px] font-bold text-slate-900 sm:text-[30px]">
                Blog
            </h1>
            <p className="mt-1 text-[14px] text-slate-500">
                Tips, guides and updates from LankanAdsLK.
            </p>

            {blogs.length === 0 ? (
                <div className="mt-8 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm font-semibold text-slate-400">
                    No blog posts published yet.
                </div>
            ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog) => (
                        <Link
                            key={blog._id}
                            href={`/blog/${blog.slug}`}
                            className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-md"
                        >
                            <div className="relative h-[170px] w-full bg-slate-100">
                                {blog.coverImage?.url ? (
                                    <Image
                                        src={blog.coverImage.url}
                                        alt={blog.title}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 640px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
                                        LankanAdsLK
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-1 flex-col p-4">
                                <h2 className="line-clamp-2 text-[16px] font-bold leading-6 text-slate-900 group-hover:text-teal-700">
                                    {blog.title}
                                </h2>

                                {blog.excerpt && (
                                    <p className="mt-2 line-clamp-3 text-[13px] leading-5 text-slate-500">
                                        {blog.excerpt}
                                    </p>
                                )}

                                <p className="mt-3 text-[12px] text-slate-400">
                                    {formatDate(blog.publishedAt || blog.createdAt)}
                                </p>

                                <span className="mt-4 inline-flex w-full justify-center rounded-md bg-[var(--primary)] px-4 py-2.5 text-[13px] font-semibold text-white">
                                    Read More
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
}
