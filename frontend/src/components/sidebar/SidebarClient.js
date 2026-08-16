"use client";

import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/../redux/features/authSlice";

import SidebarButtons from "./SidebarButtons";
import CategoryList from "./CategoryList";

export default function SidebarClient({
    initialIsLoggedIn,
}) {
    const router = useRouter();
    const dispatch = useDispatch();

    const reduxLoggedIn = useSelector(
        (state) => state.auth.isLoggedIn
    );

    const isLoggedIn =
        reduxLoggedIn || initialIsLoggedIn;

    const handleLogout = () => {
        dispatch(logout());
        router.push("/login");
        router.refresh();
    };

    return (
        <aside className="w-full max-w-[320px] space-y-5">
            <SidebarButtons
                isLoggedIn={isLoggedIn}
                handleLogout={handleLogout}
            />

            {/* <CategoryList /> */}
        </aside>
    );
}