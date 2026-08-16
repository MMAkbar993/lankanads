"use client";

import { Search, Crown, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroBg from "@/assets/images/Banner.webp";
import PostAdButton from "@/components/PostAdButton";

const tags = ["Girls", "Spa","Massage", "VIP", "Colombo"];

export default function Banner() {
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");

    const goToSearch = (term) => {
        const value = term.trim();
        if (!value) return;

        router.push(`/categories/all?search=${encodeURIComponent(value)}`);
    };

    return (
        <section className="relative isolate overflow-hidden">
            <Image
                src={HeroBg}
                alt="Search hero background"
                fill
                priority
                className="z-0 object-cover"
            />

            <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-[#1b0826]/95 via-[#490d39]/70 to-black/50" />

            <div className="relative z-[2] flex flex-col gap-5 px-4 py-5 sm:px-6 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-7">
                <div className="relative z-[3] w-full max-w-[650px]">
                    <h1 className="text-[22px] font-bold leading-[1.08] text-white sm:text-[36px] lg:text-[48px]">
                        Find Your Perfect
                        <br />
                        <span className="text-[#ff0f87]">Advertisement</span>
                    </h1>

                    <p className="mt-2 text-[12px] font-medium text-white/90 sm:text-[15px]">
                        Sri Lanka&apos;s Most Trusted Ads Platform
                    </p>

                    <div className="relative z-[4] mt-4 flex rounded-lg bg-white p-1 shadow-xl sm:mt-7 sm:rounded-xl">
                        <input
                            type="text"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") goToSearch(searchValue);
                            }}
                            placeholder="Search for ads..."
                            className="h-9 flex-1 rounded-md px-3 text-[12px] placeholder:text-[12px] outline-none sm:h-12 sm:px-5 sm:text-[15px] sm:placeholder:text-[15px]"
                        />

                        <button
                            type="button"
                            onClick={() => goToSearch(searchValue)}
                            className="flex h-9 w-10 items-center justify-center rounded-md bg-[#ff0f87] text-white transition hover:bg-[#e60073] sm:h-12 sm:w-auto sm:gap-2 sm:px-7 cursor-pointer "
                        >
                            <Search size={15} />
                            <span className="hidden text-[15px] font-semibold sm:inline">
                                Search
                            </span>
                        </button>
                    </div>

                    <div className="relative z-[4] mt-4 hidden md:flex flex-wrap items-center gap-2 sm:mt-5">
                        <span className="text-[11px] font-semibold text-white sm:text-sm">
                            Popular Searches:
                        </span>

                        {tags.map((item) => (
                            <button
                                key={item}
                                type="button"
                                onClick={() => goToSearch(item)}
                                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm transition hover:bg-[#ff0f87] sm:px-4 sm:py-1.5 sm:text-sm"
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="relative z-[5] w-full rounded-xl border border-white/25 bg-black/30 p-4 backdrop-blur-md sm:max-w-[270px] sm:p-6">
                    <div className="hidden md:flex justify-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff0f87]/20 sm:h-14 sm:w-14">
                            <Crown
                                size={22}
                                className="text-[#FFD34E] sm:h-7 sm:w-7"
                            />
                        </div>
                    </div>

                    <h3 className="md:block hidden relative z-[6] mt-3 select-text whitespace-nowrap text-center text-[17px] font-bold leading-none text-white sm:mt-4 sm:text-2xl">
                        Post Your Ad
                    </h3>

                    <p className="md:block hidden relative z-[6] mt-2 text-center text-[11px] leading-5 text-white/80 sm:mt-3 sm:text-sm sm:leading-6">
                        Get more views and reach thousands of potential customers.
                    </p>

                    <PostAdButton className="relative z-[6] mt-4 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#ff0f87] text-[12px] font-semibold text-white transition hover:bg-[#e60073] sm:mt-6 sm:h-12 sm:text-sm cursor-pointer">
                        Post an Ad Now
                        <ChevronRight size={16} />
                    </PostAdButton>
                </div>
            </div>
        </section>
    );
}