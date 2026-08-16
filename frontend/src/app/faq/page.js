'use client';

import Link from 'next/link';
import {
    Home,
    ChevronRight,
    MessageCircleQuestion,
    Mail,
    CircleHelp,
    ShoppingBag,
    CircleUserRound,
    Shield,
    Headphones,
    ArrowRight,
} from 'lucide-react';

const faqSections = [
    {
        id: 1,
        title: 'General Questions',
        icon: CircleHelp,
        questions: [
            {
                question: 'What is LankanAdsLK?',
                answer:
                    'LankanAdsLK is a Sri Lankan classified ads website where users can post and browse local ads, Lanka ads, and SL ads by category and district.',
            },
            {
                question: 'How do I post an ad?',
                answer:
                    'Log in to your account, click Post an Ad, choose your package, add your ad details, images, category, district, and contact information, then submit.',
            },
            {
                question: 'How much does it cost to post an ad?',
                answer:
                    'VIP Ad: LKR 8,000. Super Ad: LKR 1,500. Normal Ad: LKR 500.',
            },
            {
                question: 'How long do ads stay visible?',
                answer: 'All ads stay visible for 30 days from the posting date.',
            },
        ],
    },
    {
        id: 2,
        title: 'Ad Packages',
        icon: ShoppingBag,
        questions: [
            {
                question: 'How long does VIP placement last?',
                answer:
                    'VIP ads get 24 hours of premium top placement. After that, the ad continues as a normal ad until the 30-day period ends.',
            },
            {
                question: 'How long does Super placement last?',
                answer:
                    'Super ads get 24 hours of premium placement after VIP ads. After that, the ad continues as a normal ad until the 30-day period ends.',
            },
            {
                question: 'What is the difference between VIP, Super, and Normal ads?',
                answer:
                    'VIP ads appear first, Super ads appear after VIP ads, and Normal ads appear after active VIP and Super ads.',
            },
        ],
    },
    {
        id: 3,
        title: 'Account & Posting',
        icon: CircleUserRound,
        questions: [
            {
                question: 'Can I edit my ad after posting?',
                answer:
                    'No. Users cannot edit ads after posting. If changes are needed, contact support or post a new ad.',
            },
            {
                question: 'Can I delete my ad?',
                answer:
                    'Yes. Users can delete their ads by going to the My Ads page in their dashboard.',
            },
            {
                question: 'Do I need an account to post ads?',
                answer: 'Yes. Users must log in to post ads on LankanAdsLK.',
            },
        ],
    },
    {
        id: 4,
        title: 'Safety & Support',
        icon: Shield,
        questions: [
            {
                question: 'How can I increase my ad views?',
                answer:
                    'Use a VIP or Super ad package, choose the correct category and district, add clear images, and write a detailed description.',
            },
            {
                question: 'How do I report a fake ad?',
                answer:
                    'Please contact support to report any fake, suspicious, or inappropriate ad.',
            },
            {
                question: 'What ads are not allowed?',
                answer:
                    'Fake, scam, spam, illegal, misleading, harmful, underage, exploitative, or non-consensual content is not allowed.',
            },
            {
                question: 'How do I contact support?',
                answer:
                    'Email support@lankanadslk.com or use the Contact Us page.',
            },
        ],
    },
];

function FaqSection({ section }) {
    const Icon = section.icon;

    return (
        <section className="rounded-[9px] border border-[#e6e6e6] bg-white px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:px-5 sm:py-5">
            <div className="mb-2.5 flex items-center gap-3">
                <Icon
                    size={27}
                    strokeWidth={1.8}
                    className="shrink-0 text-[#f10b46]"
                />

                <h2 className="text-[16px] font-bold leading-none text-[#ed0b43] sm:text-[17px]">
                    {section.id}. {section.title}
                </h2>
            </div>

            <div>
                {section.questions.map((item, index) => (
                    <article
                        key={item.question}
                        className={`py-3 ${index !== section.questions.length - 1
                                ? 'border-b border-[#e5e5e5]'
                                : 'pb-0'
                            }`}
                    >
                        <h3 className="mb-1 text-[13px] font-bold leading-[1.4] text-[#191919] sm:text-[13.5px]">
                            {item.question}
                        </h3>

                        <p className="text-[12px] font-normal leading-[1.55] text-[#222222] sm:text-[12.5px]">
                            {item.answer}
                        </p>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default function FaqPage() {
    return (
        <main className="min-h-screen bg-[#fafafa] text-[#171717]">
            <div className="mx-auto w-full max-w-[1240px] px-3 py-4 sm:px-5 lg:px-6">
                {/* Breadcrumb */}
                <nav
                    aria-label="Breadcrumb"
                    className="mb-4 flex items-center gap-2 text-[12px]"
                >
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 font-medium text-[#ed0b43] transition hover:text-[#c60036]"
                    >
                        <Home size={13} fill="currentColor" strokeWidth={1.8} />
                        Home
                    </Link>

                    <ChevronRight size={13} className="text-[#b6b6b6]" />

                    <span className="font-medium text-[#ed0b43]">FAQ</span>
                </nav>

                {/* Hero banner */}
                <section className="relative mb-6 overflow-hidden rounded-[11px] bg-black">
                    {/* Background layers */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_76%_50%,rgba(219,0,56,0.4),transparent_43%),linear-gradient(90deg,#030303_0%,#050505_44%,#25000b_100%)]" />

                    <div className="absolute right-0 top-0 h-full w-[68%] opacity-55">
                        <div className="absolute inset-0 bg-[url('/images/faq-skyline.png')] bg-contain bg-right-bottom bg-no-repeat" />
                    </div>

                    {/* Decorative dots */}
                    <div className="absolute right-4 top-3 hidden grid-cols-10 gap-[4px] opacity-50 md:grid">
                        {Array.from({ length: 50 }).map((_, index) => (
                            <span
                                key={index}
                                className="h-[2px] w-[2px] rounded-full bg-[#f30a45]"
                            />
                        ))}
                    </div>

                    <div className="relative z-10 flex min-h-[205px] items-center px-5 py-7 sm:px-8 md:min-h-[220px] md:px-10 lg:min-h-[235px]">
                        <div className="flex max-w-[710px] items-start gap-4 sm:gap-6">
                            {/* FAQ bubble */}
                            <div className="relative mt-1 flex h-[76px] w-[76px] shrink-0 items-center justify-center rounded-full border-[3px] border-[#ed0b43] sm:h-[88px] sm:w-[88px]">
                                <span className="text-[23px] font-medium text-[#ed0b43] sm:text-[27px]">
                                    FAQ
                                </span>

                                <span className="absolute -bottom-[7px] left-[10px] h-[19px] w-[19px] rotate-[28deg] border-b-[3px] border-l-[3px] border-[#ed0b43] bg-black" />
                            </div>

                            <div>
                                <h1 className="text-[25px] font-bold leading-tight text-white sm:text-[31px] lg:text-[34px]">
                                    Frequently Asked Questions
                                </h1>

                                <p className="mt-2 max-w-[500px] text-[12px] leading-[1.6] text-[#e8e8e8] sm:text-[13px]">
                                    Find answers to common questions about ads, pricing,
                                    payments, accounts, and support on LankanAdsLK.
                                </p>

                                <a
                                    href="mailto:support@lankanadslk.com"
                                    className="mt-4 inline-flex items-center gap-2 text-[12px] font-medium text-white transition hover:text-[#ff245c] sm:text-[13px]"
                                >
                                    <Mail size={16} strokeWidth={1.7} />
                                    support@lankanadslk.com
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {faqSections.map((section) => (
                        <FaqSection key={section.id} section={section} />
                    ))}
                </div>

                {/* Bottom help banner */}
                <section className="relative mt-4 overflow-hidden rounded-[10px] bg-black">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_100%,rgba(225,0,57,0.42),transparent_40%),linear-gradient(90deg,#020202_0%,#050505_58%,#26000c_100%)]" />

                    <div className="absolute bottom-0 right-0 h-full w-[48%] opacity-60">
                        <div className="absolute inset-0 bg-[url('/images/faq-skyline.png')] bg-contain bg-right-bottom bg-no-repeat" />
                    </div>

                    <div className="relative z-10 flex flex-col gap-5 px-5 py-5 sm:px-7 md:min-h-[115px] md:flex-row md:items-center md:justify-between md:gap-8 md:px-9">
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full border border-[#94102f]">
                                <div className="absolute inset-[6px] rounded-full border border-dashed border-[#ed0b43]" />

                                <Headphones
                                    size={31}
                                    strokeWidth={1.5}
                                    className="relative z-10 text-[#ed0b43]"
                                />
                            </div>

                            <div>
                                <h2 className="text-[21px] font-bold leading-tight text-white sm:text-[23px]">
                                    Still Need Help?
                                </h2>

                                <p className="mt-1 text-[12px] text-[#dedede]">
                                    Our support team is here to help you.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/contact-us"
                                className="inline-flex h-[45px] min-w-[172px] items-center justify-center rounded-[5px] bg-[#ed0b43] px-6 text-[12px] font-semibold text-white transition hover:bg-[#ca0036]"
                            >
                                Contact Support
                            </Link>

                            <Link
                                href="/post-ad"
                                className="group inline-flex h-[45px] min-w-[150px] items-center justify-center gap-2 rounded-[5px] border border-[#ed0b43] bg-transparent px-6 text-[12px] font-semibold text-[#ed0b43] transition hover:bg-[#ed0b43] hover:text-white"
                            >
                                How to Post
                                <ArrowRight
                                    size={15}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}