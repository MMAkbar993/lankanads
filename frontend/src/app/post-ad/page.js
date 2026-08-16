"use client";

import Link from "next/link";
import {
    Home,
    ChevronRight,
    Globe2,
    Mail,
    MessageCircle,
    Send,
    TriangleAlert,
} from "lucide-react";
import PostAdButton from "@/components/PostAdButton";

const steps = [
    {
        id: 1,
        title: "Create or Log In to Your Account",
        description:
            "To post an ad on LankanAdsLK, you must log in to your account first. If you do not have an account, create one before posting.",
        descriptionSi:
            "LankanAdsLK වෙබ් අඩවියේ දැන්වීමක් පලකිරීමට පළමුව ඔබගේ ගිණුමට පිවිසිය යුතුය. ඔබට ගිණුමක් නොමැතිනම් දැන්වීමක් පළකිරීමට පෙර ගිණුමක් සාදාගන්න.",
    },
    {
        id: 2,
        title: "Click 'Post Ad'",
        description:
            "After logging in, click the Post Ad button on the website. This will open the ad posting form.",
        descriptionSi:
            "ගිණුමට පිවිසීමෙන් පසු, වෙබ් අඩවියේ Post Ad බොත්තම ක්ලික් කරන්න. මෙය දැන්වීම් පලකිරීමේ පිටුව වෙත යොමු කරයි.",
    },
    {
        id: 3,
        title: "Choose Your Ad Package",
        description:
            "Select the ad package you want: VIP Ad – LKR 8,000, Super Ad – LKR 1,500, Normal Ad – LKR 500. VIP and Super ads receive 24 hours of premium placement. All ads remain visible for 30 days.",
        descriptionSi:
            "ඔබට අවශ්‍ය දැන්වීම් පැකේජය තෝරන්න: VIP Ad- රු. 8,000, Super Ad- රු. 1,500,  Normal Ad- රු. 500. VIP සහ Super දැන්වීම් සදහා පැය 24ක premium සේවාවක් ලැබෙයි. සියලුම දැන්වීම් දින 30ක් පුරා දර්ශනය වේ.",
    },
    {
        id: 4,
        title: "Fill in Your Ad Details",
        description:
            "Enter your ad title, category, district, description, contact details, and upload images. Check all details carefully before submitting.",
        descriptionSi:
            "ඔබගේ දැන්වීම් මාතෘකාව, කාණ්ඩය, දිස්ත්‍රික්කය, විස්තරය, සම්බන්දතා තොරතුරු හා ජායාරූප උඩුගත කරන්න. Submit කිරීමට පෙර සියලුම තොරතුරු හොදින් පරීක්ෂා කරන්න.",
    },
    {
        id: 5,
        title: "Submit Your Ad",
        description:
            "After completing the form, submit your ad. Once approved, users cannot edit ads.",
        descriptionSi:
            "ආකෘතිය සම්පූර්ණ කළ පසු, ඔබගේ දැන්වීම submit කරන්න. දැන්වීම Approve  කළ පසු නැවත edit කල නොහැක.",
    },
    {
        id: 6,
        title: "Complete Payment",
        description:
            "After submitting your ad, complete the payment for your selected package. Then send your payment receipt to our WhatsApp support number for confirmation.",
        descriptionSi:
            "ඔබගේ දැන්වීම submit කළ පසු, ඔබ තෝරාගත් පැකේජය සදහා ගෙවීම සම්පූර්ණ කරන්න. ඉන්පසු ගෙවීමේ රිසිට්පත අපගේ Whatsapp සහාය අංකයට එවන්න.",
    },
    {
        id: 7,
        title: "Payment Confirmation",
        description:
            "Once we receive and verify your payment receipt on WhatsApp, your ad will be approved or published according to the selected package.",
        descriptionSi:
            "WhatsApp මගින් ඔබගේ ගෙවීමේ රිසිට්පත යොමු කල පසු, ඔබ තෝරාගත් පැකේජයට අනුව ඔබගේ දැන්වීම අනුමත කර වෙබ් අඩවියේ පළකරනු ලැබේ.",
    },
    {
        id: 8,
        title: "Need Help?",
        description:
            "If you have trouble posting your ad or sending your receipt, contact LankanAdsLK support on WhatsApp.",
        descriptionSi:
            "ඔබට දැන්වීමක් පලකිරීමේදී හෝ රිසිට්පත යැවීමේ ගැටලු ඇත්නම්, LankanAdsLK Support අංකයට Whatsapp පණිවිඩයක් යොමු කරන්න.",
    },
];

function StepCard({ step }) {
    return (
        <article className="rounded-[8px] border border-[#ededed] bg-white p-4 shadow-[0_1px_5px_rgba(0,0,0,0.04)] sm:p-5">
            <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f40b46] text-[16px] font-bold text-white sm:h-10 sm:w-10">
                    {step.id}
                </div>

                <div className="min-w-0 flex-1">
                    <h2 className="text-[14px] font-bold leading-[1.35] text-[#131313] sm:text-[15px]">
                        {step.title}
                    </h2>

                    <p className="mt-1 text-[11px] leading-[1.55] text-[#252525] sm:text-[12px]">
                        {step.description}
                    </p>

                    <div className="mt-4 rounded-[4px] bg-gradient-to-r from-[#fff5f8] to-[#fff9fa] p-3">
                        <p className="text-[11px] leading-[1.7] text-[#252525] sm:text-[12px]">
                            {step.descriptionSi}
                        </p>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function HowToPostPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] text-[#171717]">
            <div className="mx-auto w-full max-w-[1180px] px-3 py-3 sm:px-5 sm:py-4 lg:px-6">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-4 flex items-center gap-2 text-[11px] sm:text-[12px]"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 font-semibold text-[#ed0b43] transition hover:text-[#c50037]"
                    >
                        <Home
                            size={13}
                            fill="currentColor"
                            strokeWidth={1.8}
                        />
                        Home
                    </Link>

                    <ChevronRight size={13} className="text-[#bcbcbc]" />

                    <span className="font-semibold text-[#ed0b43]">
                        How to Post
                    </span>
                </nav>

                {/* Hero */}
                <section className="relative mb-5 overflow-hidden rounded-[9px] bg-[#030303]">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,#020202_0%,#070707_42%,rgba(65,0,18,0.94)_100%)]" />

                    <div className="absolute inset-y-0 right-0 w-full opacity-90 sm:w-[68%]">
                        <div className="absolute inset-0 bg-[url('/images/how-to-post-banner.png')] bg-cover bg-right-center bg-no-repeat" />
                    </div>

                    <div className="absolute right-4 top-3 hidden grid-cols-12 gap-[4px] opacity-60 sm:grid">
                        {Array.from({ length: 72 }).map((_, index) => (
                            <span
                                key={`hero-dot-${index}`}
                                className="h-[2px] w-[2px] rounded-full bg-[#ff164e]"
                            />
                        ))}
                    </div>

                    <div className="relative z-10 flex min-h-[210px] items-center px-5 py-7 sm:min-h-[240px] sm:px-8 lg:min-h-[255px] lg:px-9">
                        <div className="max-w-[560px]">
                            <h1 className="max-w-[440px] text-[27px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-[34px] lg:text-[38px]">
                                How to Post Your Ad
                                <br />
                                on LankanAdsLK
                            </h1>

                            <p className="mt-3 text-[11px] leading-[1.55] text-white/85 sm:text-[12px]">
                                Follow these simple steps to publish your ad on
                                LankanAdsLK.
                            </p>

                            <div className="mt-4 space-y-2 text-[10px] font-medium text-white sm:text-[11px]">
                                <div className="flex items-center gap-2">
                                    <Globe2
                                        size={14}
                                        strokeWidth={1.8}
                                        className="shrink-0"
                                    />
                                    <span>
                                        We support ad posts in Sinhala, English,
                                        and Tamil.
                                    </span>
                                </div>

                                <a
                                    href="mailto:support@lankanadslk.com"
                                    className="flex w-fit items-center gap-2 transition hover:text-[#ff1b55]"
                                >
                                    <Mail
                                        size={14}
                                        strokeWidth={1.8}
                                        className="shrink-0"
                                    />
                                    support@lankanadslk.com
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Step cards */}
                <section className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                    {steps.map((step) => (
                        <StepCard key={step.id} step={step} />
                    ))}
                </section>

                {/* WhatsApp support */}
                <section className="relative mt-4 overflow-hidden rounded-[9px] bg-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_50%,rgba(255,0,69,0.24),transparent_22%),linear-gradient(90deg,#020202_0%,#070707_55%,#100006_100%)]" />

                    <div className="relative z-10 flex flex-col gap-5 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:px-7">
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border border-[#ee0d46]">
                                <div className="absolute inset-[6px] rounded-full border border-dashed border-[#ee0d46]" />

                                <div className="relative flex h-[51px] w-[51px] items-center justify-center rounded-full bg-[#21bd59] shadow-[0_0_18px_rgba(33,189,89,0.45)]">
                                    <MessageCircle
                                        size={32}
                                        strokeWidth={2}
                                        className="text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-[18px] font-semibold leading-tight text-white sm:text-[20px]">
                                    Need help? Contact us on WhatsApp.
                                </h2>

                                <p className="mt-2 max-w-[430px] text-[10px] leading-[1.55] text-white/70 sm:text-[11px]">
                                    Our support team can help you with posting
                                    ads, payments, receipts, account issues, and
                                    ad package questions.
                                </p>
                            </div>
                        </div>

                        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:max-w-[455px]">
                            <a
                                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-[#f20d47] px-5 text-[11px] font-semibold text-white transition hover:bg-[#f20d47]"
                            >
                                <MessageCircle size={16} />
                                Chat on WhatsApp
                            </a>

                            <PostAdButton className="flex h-11 items-center justify-center gap-2 rounded-[5px] border border-[#f20d47] px-5 text-[11px] font-semibold text-white transition hover:bg-[#f20d47]">
                                <Send size={16} />
                                Post Ad
                            </PostAdButton>

                            <a
                                href="agents"
                                rel="noreferrer"
                                className="flex h-11 items-center justify-center rounded-[5px] bg-[#f20d47] px-5 text-[12px] font-semibold text-white transition hover:bg-[#d90039] sm:col-span-2"
                            >
                                Get Agent Support
                            </a>
                        </div>
                    </div>
                </section>

                {/* Information rows */}
                <section className="mt-3 space-y-2">
                    <div className="flex items-center gap-4 rounded-[7px] border border-[#ededed] bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                        <div className="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-[#f20d47]">
                            <TriangleAlert
                                size={30}
                                strokeWidth={1.8}
                                className="text-white"
                            />
                        </div>

                        <p className="text-[11px] font-semibold leading-[1.55] text-[#222] sm:text-[12px]">
                            Users must log in to post ads. Ads cannot be edited
                            after posting. Users can delete ads from the My Ads
                            page in their dashboard.
                        </p>
                    </div>

                    <div className="flex items-center gap-4 rounded-[7px] border border-[#ededed] bg-white px-4 py-3 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                        <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#f20d47]">
                            <Globe2
                                size={23}
                                strokeWidth={1.8}
                                className="text-white"
                            />
                        </div>

                        <p className="text-[11px] font-semibold leading-[1.5] text-[#222] sm:text-[12px]">
                            We support ad posts in Sinhala, English, and Tamil.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
}