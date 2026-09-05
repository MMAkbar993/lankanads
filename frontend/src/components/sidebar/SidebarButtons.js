"use client";

import {
    ShieldAlert,
    Heart,
    Newspaper,
    BookOpen,
    Lock,
    Users,
    LogOut,
} from "lucide-react";
import Link from "next/link";

function SidebarButton({ label, icon: Icon, className, href, onClick }) {
    const content = (
        <>
            <span>{label}</span>
            <Icon size={16} />
        </>
    );

    if (href) {
        return (
            <Link
                href={href}
                onClick={onClick}
                className={`w-full h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all hover:opacity-90 ${className}`}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            onClick={onClick}
            className={`w-full h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-all hover:opacity-90 cursor-pointer ${className}`}
        >
            {content}
        </button>
    );
}

export default function SidebarButtons({
    isLoggedIn,
    handleLogout,
    closeMenu,
}) {
    const sidebarLinks = [
        {
            label: "Agents",
            icon: Users,
            className: "bg-pink-600 text-white",
            href: "/agents",
            onClick: closeMenu,
        },
        {
            label: "All Ads",
            icon: ShieldAlert,
            className: "bg-slate-900 text-white",
            href: "/all-ads",
            onClick: closeMenu,
        },

        {
            label: "Blog",
            icon: BookOpen,
            className: "bg-teal-600 text-white",
            href: "/blog",
            onClick: closeMenu,
        },

        ...(isLoggedIn
            ? [
                {
                    label: "Saved Ads",
                    icon: Heart,
                    className: "bg-red-700 text-white",
                    href: "/saved-ads",
                    onClick: closeMenu,
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
                    onClick: closeMenu,
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
                    onClick: closeMenu,
                },
            ]),
    ];

    return (
        <div className="rounded-md border border-slate-300 bg-white p-5">
            <div className="space-y-3">
                {sidebarLinks.map((item) => (
                    <SidebarButton
                        key={item.label}
                        {...item}
                    />
                ))}
            </div>
        </div>
    );
}