"use client";

import {
    ShieldAlert,
    Heart,
    Newspaper,
    Lock,
    Users,
    LogOut,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/../redux/features/authSlice";
import TopCategories from "./sidebar/TopCategories";

function SidebarButton({ label, icon: Icon, className, href, onClick }) {
    const content = (
        <>
            <span>{label}</span>
            <Icon size={16} />
        </>
    );

    const commonClass = `w-full h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all duration-200 hover:opacity-90 ${className}`;

    if (href) {
        return (
            <Link href={href} className={commonClass}>
                {content}
            </Link>
        );
    }

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${commonClass} cursor-pointer`}
        >
            {content}
        </button>
    );
}

export default function SidebarClient({ initialIsLoggedIn }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const reduxLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const isLoggedIn = reduxLoggedIn || initialIsLoggedIn;

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
        router.refresh();
    };

    const sidebarLinks = [
        {
            label: "Agents",
            icon: Users,
            className: "bg-pink-600 text-white",
            href: "/agents",
        },
        {
            label: "All Ads",
            icon: ShieldAlert,
            className: "bg-slate-900 text-white",
            href: "/categories/all",
        },
        ...(isLoggedIn
            ? [
                {
                    label: "Saved Ads",
                    icon: Heart,
                    className: "bg-red-700 text-white",
                    href: "/saved-ads",
                },
            ]
            : []),
        ...(isLoggedIn
            ? [
                {
                    label: "Dashboard",
                    icon: Newspaper,
                    className: "bg-cyan-600 text-white",
                    href: "/portal",
                },
                {
                    label: "Logout",
                    icon: LogOut,
                    className: "bg-slate-950 text-white",
                    onClick: handleLogout,
                },
            ]
            : [
                {
                    label: "Login",
                    icon: Lock,
                    className: "bg-slate-950 text-white",
                    href: "/login",
                },
            ]),
    ];

    return (
        <aside className="w-full min-w-[280px] max-w-[320px] self-start space-y-5">
            <div className="w-full rounded-md border border-slate-300 bg-white p-5">
                <div className="w-full space-y-3">
                    {sidebarLinks.map((item) => (
                        <SidebarButton
                            key={item.label}
                            label={item.label}
                            icon={item.icon}
                            className={item.className}
                            href={item.href}
                            onClick={item.onClick}
                        />
                    ))}
                </div>
            </div>

            {/* <TopCategories /> */}
        </aside>
    );
}