"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "../assets/images/Logo.png";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/../redux/features/authSlice";

import MobileMenu from "@/components/sidebar/MobileMenu";
import PostAdButton from "@/components/PostAdButton";

export default function HeaderClient({ initialIsLoggedIn }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const { isLoggedIn: reduxLoggedIn } = useSelector((state) => state.auth);

    const [open, setOpen] = useState(false);
    const [cookieLoggedIn, setCookieLoggedIn] = useState(initialIsLoggedIn);

    const isLoggedIn = reduxLoggedIn || cookieLoggedIn;

    const handleLogout = () => {
        dispatch(logout());

        document.cookie = "token=; path=/; max-age=0";
        document.cookie = "user=; path=/; max-age=0";

        setCookieLoggedIn(false);
        setOpen(false);

        router.push("/login");
        router.refresh();
    };

    return (
        <>
            <header className="w-full bg-[#040106]">
                <div className="mx-auto flex h-[82px]  items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center">
                        <button
                            type="button"
                            onClick={() => setOpen(true)}
                            className="flex h-10 w-10 items-center justify-center rounded-md text-white transition hover:bg-white/10 lg:hidden"
                        >
                            <Menu size={24} />
                        </button>

                        <Link
                            href="/"
                            className="flex items-center justify-center gap-1"
                        >
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                                <Image
                                    src={Logo}
                                    alt="Lankan Ads"
                                    priority
                                    className="h-10 w-10 object-contain"
                                />
                            </div>

                            <div className="flex flex-col leading-none">
                                <h1 className="text-[22px] sm:text-[30px] font-bold tracking-[-0.5px]">
                                    <span className="text-white">Lankan </span>
                                    <span className="text-[#FF0F87]">AdsLK</span>
                                </h1>

                                <p className="mt-1 text-[9px] sm:text-[11px] font-medium text-white/90 tracking-wide">
                                    Sri Lanka&apos;s Premium Ads Platform
                                </p>
                            </div>
                        </Link>
                    </div>

                    <PostAdButton
                        isLoggedIn={isLoggedIn}
                        className="cursor-pointer rounded-md bg-[#ff0f87] px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-[#e60073] sm:px-6"
                    >
                        {isLoggedIn ? "Post Ad" : "Login/Post Ad"}
                    </PostAdButton>
                </div>
            </header>

            <MobileMenu
                open={open}
                setOpen={setOpen}
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
            />
        </>
    );
}