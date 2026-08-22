"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { Gem, Crown, ShieldCheck } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const WHATSAPP_NUMBER = "0761323624";

const EZ_CASH_NUMBER = "0761323624";

const PACKAGES = [
    { label: "Vip Ad",    price: "Rs. 8,000.00" },
    { label: "Super Ad",  price: "Rs. 1,500.00" },
    { label: "Normal Ad", price: "Rs. 500.00" },
];

const AGENT_BUTTONS = [
    { label: "Vip Ads | Pay Now",    icon: Gem,         className: "bg-red-600 hover:bg-red-700" },
    { label: "Super Ads | Pay Now",  icon: Crown,       className: "bg-amber-500 hover:bg-amber-600" },
    { label: "Normal Ads | Pay Now", icon: ShieldCheck, className: "bg-blue-600 hover:bg-blue-700" },
];

function WhatsAppIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
        >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

export default function TopUpPage() {
    const { user } = useSelector((state) => state.auth);
    const isAgent = user?.role === "agent";

    return (
        <div className="rounded-md bg-white p-6">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-4">
                <InfoCard title="Account ID"   value={user?.accountId || "N/A"} />
                <InfoCard title="Account Type" value={isAgent ? "Agent" : "User"} />
                {isAgent && (
                    <InfoCard title="Credit Balance" value={user?.creditBalance ?? 0} />
                )}
            </div>

            <div className="flex">
                <TabLink label="My Ads" href="/portal" />
                <TabLink label="New Ad" href="/portal/new-ad" className="-ml-px" />
                <TabLink label="Top up" href="/portal/top-up" active className="-ml-px" />
            </div>

            <div className="mt-2 space-y-5 rounded-md rounded-tl-none border border-slate-300 p-6">

                <div>
                    <p className="text-[16px] leading-relaxed text-slate-700">
                        Please pay the applicable amount and send the receipt along with the ad&apos;s phone number via WhatsApp to get your ad live.
                    </p>
                    <p className="mt-3 text-[16px] leading-relaxed text-slate-700">
                        ඔබගේ දැන්වීම සජීවී කර ගැනීමට කරුණාකර අදාළ මුදල ගෙවා WhatsApp හරහා රිසිට්පත හා දැන්වීම් දුරකථන අංකය එවන්න.
                    </p>
                </div>

                <ul className="space-y-2">
                    {PACKAGES.map((pkg) => (
                        <li key={pkg.label} className="text-[16px] text-slate-700">
                            {pkg.label}: <span className="font-bold text-slate-900">{pkg.price}</span>
                        </li>
                    ))}
                </ul>

                <Link
                    href={buildWhatsAppLink("I need bank details")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-slate-950 text-[16px] font-bold text-white transition hover:bg-slate-800"
                >
                    <WhatsAppIcon />
                    Contact on Whatsapp
                </Link>

                <Link
                    href={buildWhatsAppLink("I need bank details")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer h-14 w-full items-center justify-center gap-2 rounded-lg border-2 border-green-600 text-[16px] font-bold text-green-600 transition hover:bg-green-50"
                >
                    <WhatsAppIcon />
                    Bank Transfer
                </Link>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="text-[15px] font-bold text-blue-700">Ez Cash: {EZ_CASH_NUMBER}</p>
                    <p className="mt-1 text-[15px] text-blue-700">
                            ඊසි කෑශ් හරහා මුදල් ගෙවීම සදහා ඉහත අංකය භාවිතා කරන්න.
                    </p>
                </div>

                <div className="rounded-lg border border-dashed border-slate-300 p-6">
                    <h3 className="mb-4 text-center text-[17px] font-bold text-slate-900">
                        Pay through an Agent / Get Agent support
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {AGENT_BUTTONS.map(({ label, icon: Icon, className }) => (
                            <Link
                                key={label}
                                href="/agents"
                                className={`flex cursor-pointer h-12 items-center justify-center gap-2 rounded-lg text-[14px] font-bold text-white transition ${className}`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}

function TabLink({ label, href, active, className = "" }) {
    return (
        <Link
            href={href}
            className={`border border-slate-300 px-6 py-2 text-[15px] font-semibold ${
                active ? "bg-white" : "bg-slate-100 cursor-pointer"
            } ${className}`}
        >
            {label}
        </Link>
    );
}

function InfoCard({ title, value }) {
    return (
        <div className="rounded-md border border-dashed border-slate-300 px-5 py-1">
            <p className="mb-1 text-[14px] font-semibold text-slate-500">{title}</p>
            <h3 className="text-[16px] font-bold text-[#424A56]">{value}</h3>
        </div>
    );
}