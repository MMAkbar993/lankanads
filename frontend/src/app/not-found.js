import Link from "next/link";
import { Home, Search, ArrowLeft, AlertTriangle } from "lucide-react";

export default function NotFound() {
    return (
        <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
            <div className="w-full max-w-xl text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                    <AlertTriangle className="h-10 w-10 text-[#FF0F87]" />
                </div>

                <h1 className="text-[80px] font-black leading-none text-gray-900 sm:text-[110px]">
                    404
                </h1>

                <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Page Not Found
                </h2>

                <p className="mx-auto mt-3 max-w-md text-[15px] leading-7 text-gray-500">
                    Sorry, the page you are looking for is unavailable, may have been moved,
                    or the link might be incorrect.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#FF0F87] px-6 text-sm font-semibold text-white transition hover:bg-[#e60076]"
                    >
                        <Home size={18} />
                        Back to Home
                    </Link>


                </div>

                <Link
                    href="/"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#FF0F87]"
                >
                    <ArrowLeft size={17} />
                    Go back safely
                </Link>
            </div>
        </section>
    );
}