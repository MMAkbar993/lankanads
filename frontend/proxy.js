import { NextResponse } from "next/server";

export function proxy(request) {
    const token = request.cookies.get("token")?.value;
    const pathname = request.nextUrl.pathname;

    // Protect Portal Routes
    if (pathname.startsWith("/portal") && !token) {
        return NextResponse.redirect(
            new URL("/login", request.url)
        );
    }

    // Already Logged In User
    if (pathname.startsWith("/login") && token) {
        return NextResponse.redirect(
            new URL("/portal", request.url)
        );
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/portal/:path*",
        "/login",
    ],
};