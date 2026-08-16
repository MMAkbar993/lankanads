"use client";

import { X } from "lucide-react";

import SidebarButtons from "./SidebarButtons";
import CategoryList from "./CategoryList";

export default function MobileMenu({
    open,
    setOpen,
    isLoggedIn,
    handleLogout,
}) {
    return (
        <div
            className={`fixed inset-0 z-50 transition-all ${open ? "visible" : "invisible"
                }`}
        >
            <div
                onClick={() => setOpen(false)}
                className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"
                    }`}
            />

            <div
                className={`absolute left-0 top-0 h-full w-[300px] overflow-y-auto bg-white p-5 transition-transform duration-300 ${open
                    ? "translate-x-0"
                    : "-translate-x-full"
                    }`}
            >
                <button
                    onClick={() => setOpen(false)}
                    className="mb-5 cursor-pointer"
                >
                    <X size={24} />
                </button>

                <div className="space-y-5">
                    <SidebarButtons
                        isLoggedIn={isLoggedIn}
                        handleLogout={handleLogout}
                        closeMenu={() => setOpen(false)}
                    />

                    {/* <CategoryList /> */}
                </div>
            </div>
        </div>
    );
}