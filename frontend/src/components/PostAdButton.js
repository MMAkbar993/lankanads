"use client";

import Link from "next/link";
import { useSelector } from "react-redux";

export default function PostAdButton({ children, className, isLoggedIn, ...rest }) {
    const reduxLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const loggedIn = isLoggedIn ?? reduxLoggedIn;

    return (
        <Link href={loggedIn ? "/portal" : "/login"} className={className} {...rest}>
            {children}
        </Link>
    );
}
