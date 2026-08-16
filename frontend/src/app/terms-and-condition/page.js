import Link from "next/link";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  FileText,
  Globe2,
  Mail,
  ShieldCheck,
} from "lucide-react";

const termsSections = [
  {
    number: 1,
    title: "About LankanAdsLK",
    paragraphs: [
      "LankanAdsLK.com is a free-to-use classified platform where anyone can post and browse advertisements across Sri Lanka, including personal, premium, and featured ads.",
    ],
  },
  {
    number: 2,
    title: "Free Posting & User Responsibility",
    description: "LankanAdsLK is a free-to-post content website, which means:",
    bullets: [
      "Anyone can create and publish advertisements",
      "All content is created by users, not by LankanAdsLK",
      "We do not verify or guarantee the accuracy of any advertisement",
    ],
    notice: {
      title: "Important:",
      text: "LankanAdsLK does not take responsibility for any content posted by users, including accuracy, legality, or reliability.",
    },
  },
  {
    number: 3,
    title: "Use of the Platform",
    description: "By using our website, you confirm that:",
    bullets: [
      "You are legally allowed to use our services",
      "You will follow all applicable laws",
      "You will use the platform responsibly",
    ],
  },
  {
    number: 4,
    title: "User Accounts",
    paragraphs: ["Some features require mobile number verification."],
    description: "You are responsible for:",
    bullets: [
      "Keeping your account secure",
      "Providing accurate information",
      "All activity under your account",
    ],
    footer: "We may suspend or remove accounts that violate these Terms.",
  },
  {
    number: 5,
    title: "Advertisements",
    paragraphs: ["Users are fully responsible for the ads they post."],
    description: "Ads must:",
    bullets: [
      "Be accurate and lawful",
      "Not be misleading or fraudulent",
      "Not violate any rights or laws",
    ],
    footer: "We may remove or reject any ad at our discretion.",
  },
  {
    number: 6,
    title: "Prohibited Content",
    description: "You must not post:",
    bullets: [
      "Illegal or fraudulent content",
      "Hate, abuse, or harmful material",
      "Spam or misleading ads",
      "Copyright-infringing content",
    ],
    footer: "Violations may result in account suspension.",
  },
  {
    number: 7,
    title: "Payments & Premium Services",
    paragraphs: ["We may offer paid services such as Premium or VIP ads."],
    bullets: [
      "Payments are generally non-refundable",
      "Prices and services may change",
      "Third-party payment providers may be used",
    ],
  },
  {
    number: 8,
    title: "Cookies",
    description: "We use cookies for:",
    bullets: [
      "Website functionality and security",
      "Improving user experience",
    ],
    footer: "Optional cookies may be disabled in your browser.",
  },
  {
    number: 9,
    title: "Disclaimer",
    paragraphs: ['LankanAdsLK provides services "as-is".'],
    description: "We do not guarantee:",
    bullets: [
      "Accuracy of ads",
      "Availability of services",
      "Successful transactions",
    ],
    footer: "Users should verify information before engaging.",
  },
  {
    number: 10,
    title: "Limitation of Liability",
    description: "We are not responsible for:",
    bullets: [
      "Financial losses",
      "User disputes",
      "Fraud or misleading ads",
      "Any content posted by users",
    ],
  },
  {
    number: 11,
    title: "Account Suspension",
    paragraphs: [
      "We may suspend or terminate accounts that misuse the platform or violate these Terms.",
    ],
  },
  {
    number: 12,
    title: "Changes to Terms",
    paragraphs: [
      "We may update these Terms at any time. Continued use means you accept the updated Terms.",
    ],
  },
  {
    number: 13,
    title: "Governing Law",
    paragraphs: ["These Terms are governed by the laws of Sri Lanka."],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-6xl">
        <TermsHeader />

        <div className="mt-5 overflow-hidden rounded-xl border border-[#e8e8ec] bg-white shadow-[0_8px_35px_rgba(15,23,42,0.05)] sm:mt-6">
          <div className="divide-y divide-[#ececef] px-4 sm:px-7 lg:px-10">
            {termsSections.map((section) => (
              <TermsSection key={section.number} section={section} />
            ))}

            <ContactSection />
          </div>
        </div>

        <Acknowledgement />
      </div>
    </main>
  );
}

function TermsHeader() {
  return (
    <header className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#050505] via-[#190008] to-[#430017] px-5 py-7 shadow-lg sm:px-8 sm:py-9 lg:px-12 lg:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-32 h-[330px] w-[330px] rounded-full bg-[#a80037]/25 blur-3xl" />

        <div className="absolute -bottom-36 right-[18%] h-[280px] w-[440px] rounded-full bg-[#e40051]/15 blur-3xl" />
      </div>

      <CityDecoration />

      <div className="relative z-10 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#ec145b] bg-[#ec145b]/10 text-[#ff1f69] sm:h-16 sm:w-16">
          <FileText size={32} strokeWidth={1.8} />
        </div>

        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-white sm:text-4xl">
            Terms &amp; Conditions
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-gray-300 sm:text-sm">
            Please read these terms carefully before using LankanAdsLK.com.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-gray-300 sm:mt-4 sm:text-sm">
            <CalendarDays size={16} className="shrink-0 text-white" />

            <span>Effective Date:</span>

            <span className="font-semibold text-[#ff3378]">June 26, 2026</span>
          </div>
        </div>
      </div>
    </header>
  );
}

function CityDecoration() {
  const buildings = [36, 58, 44, 86, 52, 118, 72, 150, 62, 108, 80, 132];

  return (
    <div className="pointer-events-none absolute right-0 top-0 hidden h-full w-[48%] overflow-hidden lg:block">

      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_40%,rgba(190,0,52,0.30),transparent_40%),linear-gradient(90deg,#020203_0%,#090005_48%,#160009_100%)]" />
      <div className="absolute inset-y-0 right-0 w-full opacity-95 sm:w-[63%]">
        <div
          className="absolute inset-0  bg-right-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/how-to-post-banner.png')",
            backgroundSize: "100% 100%",
            backgroundPositionX: "100%",
          }}
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />
    </div>
  );
}

function TermsSection({ section }) {
  return (
    <section className="py-6 sm:py-7 lg:py-8">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ec145b] text-xs font-bold text-white shadow-sm">
          {section.number}
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold text-[#16161a] sm:text-lg">
            {section.title}
          </h2>

          {section.paragraphs?.length > 0 && (
            <div className="mt-3 space-y-3">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-[13px] leading-6 text-[#4f5159] sm:text-sm"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {section.description && (
            <p className="mt-3 text-[13px] leading-6 text-[#4f5159] sm:text-sm">
              {section.description}
            </p>
          )}

          {section.bullets?.length > 0 && (
            <ul className="mt-3 space-y-1.5 sm:space-y-2">
              {section.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex items-start gap-3 text-[13px] leading-6 text-[#4f5159] sm:text-sm"
                >
                  <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#ec145b]" />

                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          )}

          {section.footer && (
            <p className="mt-4 text-[13px] leading-6 text-[#4f5159] sm:text-sm">
              {section.footer}
            </p>
          )}

          {section.notice && <ImportantNotice notice={section.notice} />}
        </div>
      </div>
    </section>
  );
}

function ImportantNotice({ notice }) {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#f5c8d7] bg-[#fff5f8] px-4 py-3">
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#ec145b]" />

      <p className="text-[13px] leading-6 text-[#454750] sm:text-sm">
        <span className="font-bold text-[#ec145b]">{notice.title}</span>{" "}
        {notice.text}
      </p>
    </div>
  );
}

function ContactSection() {
  return (
    <section className="py-6 sm:py-7 lg:py-8">
      <div className="flex items-start gap-3 sm:gap-4">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ec145b] text-xs font-bold text-white shadow-sm">
          14
        </span>

        <div className="min-w-0 flex-1">
          <h2 className="text-[15px] font-bold text-[#16161a] sm:text-lg">
            Contact Us
          </h2>

          <p className="mt-3 text-[13px] leading-6 text-[#4f5159] sm:text-sm">
            Contact LankanAdsLK if you have any questions regarding these Terms
            &amp; Conditions.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <ContactCard
              icon={Globe2}
              label="Website"
              value="lankanadslk.com"
              href="https://lankanadslk.com"
              external
            />

            <ContactCard
              icon={Mail}
              label="Email"
              value="support@lankanadslk.com"
              href="contact-us"
            />
          </div>

          <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold text-[#25262b] sm:text-sm">
            <ShieldCheck size={17} className="text-[#ec145b]" />
            LankanAdsLK
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, label, value, href, external = false }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex min-w-0 items-center gap-3 rounded-lg border border-[#ececef] bg-[#fafafa] p-3.5 transition hover:border-[#ec145b]/40 hover:bg-[#fff7fa] sm:p-4"
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#ec145b]/10 text-[#ec145b]">
        <Icon size={20} />
      </span>

      <span className="min-w-0">
        <span className="block text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:text-xs">
          {label}
        </span>

        <span className="mt-0.5 block truncate text-[13px] font-semibold text-[#25262b] transition group-hover:text-[#ec145b] sm:text-sm">
          {value}
        </span>
      </span>
    </Link>
  );
}

function Acknowledgement() {
  return (
    <div className="mt-5 flex items-start gap-3 rounded-xl border border-[#f5c8d7] bg-[#fff5f8] px-4 py-4 sm:mt-6 sm:px-6">
      <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-[#ec145b]" />

      <p className="text-[13px] leading-6 text-[#454750] sm:text-sm">
        By using{" "}
        <span className="font-semibold text-[#202126]">LankanAdsLK.com</span>,
        you agree to these Terms &amp; Conditions.
      </p>
    </div>
  );
}
