import Image from "next/image";
import Link from "next/link";

const products = [
    {
        id: 1,
        title: "OnePlus 15 16GB 512GB (Brand New)",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
        description:
            "Brand new smartphone with latest features and premium design.",
        likes: 0,
        views: 123,
        time: "2d ago",
    },
    {
        id: 2,
        title: "Asus VivoBook i3 13th Gen +8GB RAM",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        description:
            "2026 OFFERS available. Hurry up! Limited stock available.",
        likes: 0,
        views: 113,
        time: "4d ago",
    },
    {
        id: 3,
        title: "Dell Latitude 7470 Core i5 6th Gen",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
        description:
            "Business laptop in excellent condition with SSD storage.",
        likes: 0,
        views: 141,
        time: "4d ago",
    },
    {
        id: 4,
        title: "Dell Inspiron 5590 i7 10th Gen",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
        description:
            "Dedicated graphics with powerful performance for work.",
        likes: 0,
        views: 281,
        time: "1w ago",
    },
    {
        id: 5,
        title: "Zebra ZD230 Barcode Label Printer",
        image: "https://images.unsplash.com/photo-1581091870620-6e07a3b7e5c2?w=800",
        description:
            "Barcode printer with durable performance and quality output.",
        likes: 0,
        views: 137,
        time: "3w ago",
    },
    {
        id: 6,
        title: "1080P 2.4G WiFi Security Camera",
        image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800",
        description:
            "Night vision, motion alerts and two-way audio support.",
        likes: 1,
        views: 202,
        time: "1mo ago",
    },
    {
        id: 7,
        title: "JVC Party Speaker 1600W PMPO",
        image: "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",
        description:
            "Wireless speaker with remote control and deep bass.",
        likes: 1,
        views: 170,
        time: "1mo ago",
    },
    {
        id: 8,
        title: "Modern Indoor Outdoor Wall Light",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800",
        description:
            "Decorative wall lamp with warm and RGB lighting modes.",
        likes: 1,
        views: 161,
        time: "2mos ago",
    },
];

export default function ElectronicsListing() {
    return (
        <section className="mx-auto max-w-7xl bg-[var(--gray)] px-4 py-8">


            <div className="pt-0 lg:pt-4">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {products.map((item) => (
                        <Link
                            key={item.id}
                            href="/ads/123456" // Static ID for testing
                            className="block"
                        >
                            <div className="group flex cursor-pointer gap-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--white)] p-3 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-md sm:gap-4">
                                <div className="relative h-[95px] w-[110px] flex-shrink-0 overflow-hidden rounded-md bg-[var(--gray)] sm:h-[130px] sm:w-[145px]">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        unoptimized
                                        loading="eager"
                                    />
                                </div>

                                <div className="flex flex-1 flex-col">
                                    <h3 className="line-clamp-2 text-[14px] font-bold text-[var(--dark)] transition-colors group-hover:text-[var(--primary)] sm:text-[18px]">
                                        {item.title}
                                    </h3>

                                    <p className="mt-2 line-clamp-3 text-[15px] leading-6 text-gray-500">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto flex items-center justify-between pt-3 text-[13px] sm:pt-4 sm:text-[14px]">
                                        <div className="flex items-center gap-4 sm:gap-8">
                                            <span className="font-semibold text-[var(--primary)]">
                                                👍 {item.likes} Likes
                                            </span>

                                            <span className="font-semibold text-[var(--primary)]">
                                                👁 {item.views} Views
                                            </span>
                                        </div>

                                        <span className="rounded-full bg-[var(--gray)] px-2.5 py-1 text-[12px] font-semibold text-gray-500">
                                            {item.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}