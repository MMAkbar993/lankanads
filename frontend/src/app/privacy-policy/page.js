import Link from "next/link";
import {
    AlertTriangle,
    CalendarDays,
    CheckCircle2,
    Globe2,
    LockKeyhole,
    Mail,
    ShieldCheck,
} from "lucide-react";

const policySections = [
    {
        number: 1,
        title: "Information We Collect",
        description:
            "When you visit LankanAdsLK.com, we may collect:",
        bullets: [
            "Mobile phone number for OTP login",
            "Device information, including browser, IP address, and operating system",
            "Website usage information",
            "Advertisement information you publish",
            "Images and content uploaded with your advertisements",
            "Cookies and similar technologies",
        ],
        footer:
            "We collect only the information necessary to operate and improve our platform.",
    },
    {
        number: 2,
        title: "How We Use Your Information",
        description: "We use your information to:",
        bullets: [
            "Verify your identity through OTP login",
            "Create and manage your account",
            "Display your advertisements",
            "Improve website performance",
            "Detect fraud, spam, or misuse",
            "Respond to support requests",
            "Comply with legal obligations",
        ],
        notice: {
            type: "important",
            title: "Important:",
            text: "We do not sell your personal information to third parties.",
        },
    },
    {
        number: 3,
        title: "User-Generated Advertisements",
        paragraphs: [
            "LankanAdsLK is a platform where users can freely publish advertisements.",
            "All advertisements, photos, descriptions, and other content are created and managed by users.",
            "The user who posts an advertisement is solely responsible for its accuracy, legality, and content.",
            "LankanAdsLK does not guarantee or verify user-posted advertisements and is not responsible for disputes, losses, or damages resulting from interactions between users.",
        ],
        notice: {
            type: "warning",
            title: "User responsibility:",
            text: "Always verify advertisement details and the identity of other users before making payments or entering into transactions.",
        },
    },
    {
        number: 4,
        title: "Cookies",
        description: "We use cookies to:",
        bullets: [
            "Keep you logged in",
            "Improve website security",
            "Remember your preferences",
            "Analyze website traffic",
        ],
        footer:
            "You can disable optional cookies through your browser settings, although some website features may not function properly.",
    },
    {
        number: 5,
        title: "Data Security",
        paragraphs: [
            "We take reasonable technical and organizational measures to protect your information from unauthorized access, misuse, or disclosure.",
            "However, no method of data transmission or electronic storage is completely secure.",
        ],
    },
    {
        number: 6,
        title: "Third-Party Services",
        paragraphs: [
            "Our website may use trusted third-party services such as payment providers, analytics tools, or external links.",
            "These services operate under their own privacy policies, and LankanAdsLK is not responsible for their privacy practices.",
        ],
    },
    {
        number: 7,
        title: "Your Rights",
        description: "You may request to:",
        bullets: [
            "Access your personal information",
            "Correct inaccurate information",
            "Delete your account where legally permitted",
            "Contact us regarding your personal data",
        ],
    },
    {
        number: 8,
        title: "Changes to This Policy",
        paragraphs: [
            "We may update this Privacy Policy from time to time.",
            "Any changes will be published on this page together with the updated effective date.",
        ],
    },
];

export default function PrivacyPolicyPage() {
    return (
        <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto max-w-6xl">
                <PrivacyHeader />

                <div className="mt-6 overflow-hidden rounded-xl border border-[#e9e9ec] bg-white shadow-[0_8px_35px_rgba(15,23,42,0.05)]">
                    <div className="divide-y divide-[#ececef] px-5 sm:px-8 lg:px-10">
                        {policySections.map((section) => (
                            <PolicySection
                                key={section.number}
                                section={section}
                            />
                        ))}

                        <ContactSection />
                    </div>
                </div>

                <Acknowledgement />
            </div>
        </main>
    );
}

function PrivacyHeader() {
    return (
        <header className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#050505] via-[#160008] to-[#400017] px-6 py-4 shadow-lg sm:px-9 sm:py-10 lg:px-12">
                   <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_40%,rgba(190,0,52,0.30),transparent_40%),linear-gradient(90deg,#020203_0%,#090005_48%,#160009_100%)]" />
          <div className="absolute inset-y-0 right-0 w-full opacity-95 sm:w-[63%]">
            <div
              className="absolute inset-0  bg-right-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/how-to-post-banner.png')",
                backgroundSize:"60% 100%",
                backgroundPositionX:"100%"
              }}
            />
          </div>

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="relative z-10 flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#ec145b] bg-[#ec145b]/10 text-[#ff1f69]">
                    <ShieldCheck
                        size={34}
                        strokeWidth={1.8}
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Privacy Policy
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                        Learn how LankanAdsLK.com collects, uses, stores, and
                        protects your personal information.
                    </p>

                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-300">
                        <CalendarDays
                            size={16}
                            className="text-white"
                        />

                        <span>Effective Date:</span>

                        <span className="font-semibold text-[#ff3378]">
                            June 26, 2026
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

function PolicySection({ section }) {
    return (
        <section className="py-7 sm:py-8">
            <div className="flex items-start gap-3 sm:gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ec145b] text-xs font-bold text-white shadow-sm">
                    {section.number}
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-[#16161a] sm:text-lg">
                        {section.title}
                    </h2>

                    {section.description && (
                        <p className="mt-3 text-sm leading-6 text-[#4f5159]">
                            {section.description}
                        </p>
                    )}

                    {section.paragraphs && (
                        <div className="mt-3 space-y-3">
                            {section.paragraphs.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-sm leading-6 text-[#4f5159]"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    )}

                    {section.bullets && (
                        <ul className="mt-3 space-y-2">
                            {section.bullets.map((bullet) => (
                                <li
                                    key={bullet}
                                    className="flex items-start gap-3 text-sm leading-6 text-[#4f5159]"
                                >
                                    <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ec145b]" />
                                    <span>{bullet}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {section.footer && (
                        <p className="mt-4 text-sm leading-6 text-[#4f5159]">
                            {section.footer}
                        </p>
                    )}

                    {section.notice && (
                        <NoticeBox notice={section.notice} />
                    )}
                </div>
            </div>
        </section>
    );
}

function NoticeBox({ notice }) {
    const warning = notice.type === "warning";

    return (
        <div
            className={`mt-5 flex items-start gap-3 rounded-lg border px-4 py-3 ${warning
                ? "border-amber-200 bg-amber-50"
                : "border-[#f5c8d7] bg-[#fff5f8]"
                }`}
        >
            <AlertTriangle
                size={18}
                className={`mt-0.5 shrink-0 ${warning
                    ? "text-amber-600"
                    : "text-[#ec145b]"
                    }`}
            />

            <p className="text-sm leading-6 text-[#454750]">
                <span
                    className={`font-bold ${warning
                        ? "text-amber-700"
                        : "text-[#ec145b]"
                        }`}
                >
                    {notice.title}
                </span>{" "}
                {notice.text}
            </p>
        </div>
    );
}

function ContactSection() {
    return (
        <section className="py-7 sm:py-8">
            <div className="flex items-start gap-3 sm:gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ec145b] text-xs font-bold text-white shadow-sm">
                    9
                </span>

                <div className="min-w-0 flex-1">
                    <h2 className="text-base font-bold text-[#16161a] sm:text-lg">
                        Contact Us
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#4f5159]">
                        If you have questions regarding this Privacy Policy,
                        please contact us.
                    </p>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <ContactCard
                            icon={Globe2}
                            label="Website"
                            value="lankanadslk.com"
                            href="https://lankanadslk.com"
                        />

                        <ContactCard
                            icon={Mail}
                            label="Email"
                            value="support@lankanadslk.com"
                            href="contact-us"
                        />
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#25262b]">
                        <LockKeyhole
                            size={16}
                            className="text-[#ec145b]"
                        />
                        LankanAdsLK
                    </div>
                </div>
            </div>
        </section>
    );
}

function ContactCard({
    icon: Icon,
    label,
    value,
    href,
}) {
    return (
        <Link
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={
                href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
            }
            className="group flex items-center gap-3 rounded-lg border border-[#ececef] bg-[#fafafa] p-4 transition hover:border-[#ec145b]/40 hover:bg-[#fff7fa]"
        >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ec145b]/10 text-[#ec145b]">
                <Icon size={20} />
            </span>

            <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {label}
                </span>

                <span className="mt-0.5 block truncate text-sm font-semibold text-[#25262b] transition group-hover:text-[#ec145b]">
                    {value}
                </span>
            </span>
        </Link>
    );
}

function Acknowledgement() {
    return (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-[#f5c8d7] bg-[#fff5f8] px-5 py-4 sm:px-6">
            <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-[#ec145b]"
            />

            <p className="text-sm leading-6 text-[#454750]">
                By using{" "}
                <span className="font-semibold text-[#202126]">
                    LankanAdsLK.com
                </span>
                , you acknowledge that you have read and understood this
                Privacy Policy.
            </p>
        </div>
    );
}