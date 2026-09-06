import Link from "next/link";
import { MessageCircle, Send, Tag } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "";
const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/Lankanadd";

// Sits at the bottom of every ad page: how to reach us, where to follow us,
// and a route through to the pricing page for anyone who just decided they
// want to post an ad of their own.
export default function AdContactSection() {
    return (
        <div className="mt-6 rounded-xl border border-[var(--border)] bg-white p-5">
            <h2 className="text-[17px] font-bold text-slate-900">
                Need help or want to post your own ad?
            </h2>

            <p className="mt-1 text-[13px] leading-6 text-slate-500">
                Contact the LankanAdsLK team directly, follow us for the latest
                listings, or check our ad packages and pricing.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <a
                    href={buildWhatsAppLink("Hello, I need help with LankanAdsLK.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-green-700"
                >
                    <MessageCircle size={17} />
                    Contact Us on WhatsApp
                </a>

                <Link
                    href="/pricing"
                    className="flex items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[var(--primary-hover)]"
                >
                    <Tag size={17} />
                    Check Ad Pricing
                </Link>

                {FACEBOOK_URL && (
                    <a
                        href={FACEBOOK_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-md bg-[#1877F2] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#145fc4]"
                    >
                        <FacebookIcon />
                        Follow us on Facebook
                    </a>
                )}

                <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-sky-600"
                >
                    <Send size={17} />
                    Join us on Telegram
                </a>
            </div>
        </div>
    );
}

// lucide-react in this version has no Facebook glyph, so the brand mark is
// inlined — same approach as the WhatsApp icon on the ad page.
function FacebookIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 3.932 23.094 9.101 24v-8.437H6.627v-3.49h2.474V9.797c0-2.99 1.492-4.669 4.155-4.669 1.276 0 2.61.235 2.61.235v2.953H14.65c-1.366 0-1.792.86-1.792 1.742v2.015h3.05l-.487 3.49h-2.563V24C20.068 23.094 24 18.1 24 12.073z" />
        </svg>
    );
}
