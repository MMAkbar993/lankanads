"use client";

import Image from "next/image";
import { useState } from "react";

/* ---------------- PRODUCTS ---------------- */
const products = [
    {
        id: 1,
        title: "OnePlus 15 16GB 512GB (Brand New)",
        image:
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        description:
            "Brand new mobile phone with official warranty and accessories.",
        likes: 0,
        views: 123,
        time: "2d ago",
    },
    {
        id: 2,
        title: "Asus VivoBook i3 13th Gen + 8GB RAM",
        image:
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        description:
            "Latest generation laptop with SSD storage and premium build quality.",
        likes: 0,
        views: 113,
        time: "4d ago",
    },
    {
        id: 3,
        title: "Dell Latitude 7470 Core i5",
        image:
            "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=500",
        description: "Business class laptop in excellent condition.",
        likes: 0,
        views: 141,
        time: "4d ago",
    },
    {
        id: 4,
        title: "Dell Inspiron 5590 i7 10th Gen",
        image:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500",
        description: "Powerful laptop with dedicated graphics card.",
        likes: 0,
        views: 281,
        time: "1w ago",
    },
    {
        id: 5,
        title: "Zebra ZD230 Barcode Label Printer",
        image:
            "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500",
        description: "Professional barcode printer for business use.",
        likes: 0,
        views: 137,
        time: "3w ago",
    },
    {
        id: 6,
        title: "1080P WiFi Security Camera",
        image:
            "https://images.unsplash.com/photo-1558002038-1055907df827?w=500",
        description: "Indoor security camera with motion detection.",
        likes: 1,
        views: 202,
        time: "1mo ago",
    },
];

/* ---------------- IMAGE COMPONENT ---------------- */
function ProductImage({ src, alt }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="relative h-[160px] w-[160px] shrink-0 overflow-hidden bg-[var(--gray)]">
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-[var(--gray)]" />
            )}

            <Image
                src={src}
                alt={alt}
                fill
                unoptimized
                className={`object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoadingComplete={() => setLoaded(true)}
            />
        </div>
    );
}

/* ---------------- SKELETON CARD ---------------- */
function SkeletonCard() {
    return (
        <div className="flex animate-pulse overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--white)]">
            <div className="h-[160px] w-[160px] bg-[var(--gray)]" />

            <div className="flex flex-1 flex-col p-4">
                <div className="h-5 w-3/4 rounded bg-[var(--gray)]" />
                <div className="mt-2 h-4 w-full rounded bg-[var(--gray)]" />
                <div className="mt-2 h-4 w-5/6 rounded bg-[var(--gray)]" />

                <div className="mt-auto flex justify-between pt-4">
                    <div className="flex gap-4">
                        <div className="h-4 w-20 rounded bg-[var(--gray)]" />
                        <div className="h-4 w-20 rounded bg-[var(--gray)]" />
                    </div>
                    <div className="h-4 w-16 rounded bg-[var(--gray)]" />
                </div>
            </div>
        </div>
    );
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function ElectronicsSection() {
    const isLoading = false;

    return (
        <section className="mx-auto max-w-7xl px-4 py-8">

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <SkeletonCard key={i} />
                    ))
                    : products.map((item) => (
                        <div
                            key={item.id}
                            className="group flex overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--white)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
                        >
                            <ProductImage src={item.image} alt={item.title} />

                            <div className="flex flex-1 flex-col p-4">
                                <h3 className="line-clamp-2 text-lg font-bold text-[var(--dark)] transition-colors group-hover:text-[var(--primary)]">
                                    {item.title}
                                </h3>

                                <p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-600">
                                    {item.description}
                                </p>

                                <div className="mt-auto flex items-center justify-between pt-4 text-sm text-gray-500">
                                    <div className="flex flex-wrap gap-4">
                                        <span className="transition-colors group-hover:text-[var(--primary)]">
                                            👍 {item.likes} Likes
                                        </span>
                                        <span>👁 {item.views} Views</span>
                                    </div>

                                    <span className="rounded-full bg-[var(--gray)] px-3 py-1 text-xs font-semibold text-[var(--dark-light)]">
                                        {item.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
}