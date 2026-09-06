import Image from "next/image";
import Link from "next/link";
import { Send, Heart } from "lucide-react";
import Logo from "../assets/images/Logo.png";

const FACEBOOK_URL = process.env.NEXT_PUBLIC_FACEBOOK_URL || "";
const TELEGRAM_URL = process.env.NEXT_PUBLIC_TELEGRAM_URL || "https://t.me/Lankanadd";

export default function Footer() {
    return (
        <footer className="w-full bg-[#050609] text-white">
            <div className="mx-auto px-5 py-7">
                <div className="grid grid-cols-1 md:gap-8 gap-[6px] sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                        <Link href="/" className="mb-3 flex items-center gap-1">
                            <div className="flex h-12 w-12 items-center justify-center overflow-hidden">
                                <Image
                                    src={Logo}
                                    alt="Lankan Ads"
                                    priority
                                    className="h-10 w-10 object-contain"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <h2 className="text-[22px] font-bold tracking-[-0.5px]">
                                    <span className="text-white">Lankan </span>
                                    <span className="text-[#FF0F87]">AdsLK</span>
                                </h2>
                                <p className="mt-1 text-[10px] font-medium text-white/90 tracking-wide">
                                    Sri Lanka&apos;s Premium Ads Platform
                                </p>
                            </div>
                        </Link>

                        <p className="max-w-[260px] text-[14px] leading-5 text-white/70">
                            Sri Lanka&apos;s trusted platform for personal ads,
                            live cam, spa &amp; wellness and more.
                        </p>

                        <div className="mt-4 flex items-center gap-3">
                            {FACEBOOK_URL && (
                                <a
                                    href={FACEBOOK_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                >
                                    <SocialButton label="f" />
                                </a>
                            )}
                            <Link href={TELEGRAM_URL} aria-label="Telegram"><SocialButton label={<Send size={16} />} /> </Link>
                        </div>

                        <p className="mt-5 hidden text-[13px] text-white/55 sm:block">
                            © 2024 Lankan Ads. All Rights Reserved.
                        </p>
                    </div>

                    <FooterColumn
                        title="Quick Links"
                        links={[
                            { label: "Home",       href: "/" },
                            { label: "Categories", href: "/categories" },
                            { label: "Cities",     href: "/cities" },
                            { label: "Pricing",    href: "/pricing" },
                            { label: "Blog",       href: "/blog" },
                        ]}
                    />

                    <FooterColumn
                        title="Information"
                        links={[
                            { label: "How to post",       href: "/post-ad" },
                            { label: "Privacy Policy",    href: "/privacy-policy" },
                            { label: "Terms & Conditions", href: "/terms-and-condition" },
                        ]}
                    />

                    <FooterColumn
                        title="Support"
                        links={[
                            { label: "FAQ",        href: "/faq" },
                            { label: "Contact Us", href: "/contact-us" },
                        ]}
                    />

                </div>

                <p className="mt-5 text-center text-[13px] text-white/55 sm:hidden">
                    © 2024 Lankan Ads. All Rights Reserved.
                </p>

            </div>
        </footer>
    );
}

function FooterColumn({ title, links }) {
    return (
        <div>
            <h3 className="mb-3 hidden text-[17px] font-bold text-white sm:block">{title}</h3>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 sm:block sm:space-y-1.5">
                {links.map((item) => (
                    <li key={item.href + item.label}>
                        <Link
                            href={item.href}
                            className="text-[14px] font-medium text-white/65 transition hover:text-[#FF0F87]"
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function SocialButton({ label }) {
    return (
        <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-[16px] font-bold text-white transition hover:bg-[#FF0F87]"
        >
            {label}
        </button>
    );
}