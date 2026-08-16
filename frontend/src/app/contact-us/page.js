"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  resetContactState,
  sendContactMessage,
} from "../../../redux/features/contactSlice";

import {
  ChevronRight,
  CircleHelp,
  Clock3,
  Headphones,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Send,
} from "lucide-react";

const SUPPORT_EMAIL = "support@lankanadslk.com";

const BUILDINGS = [
  58, 82, 115, 75, 130, 96, 145, 78, 110, 138, 89, 122, 70, 102, 150, 85,
];

export default function ContactUsPage() {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.contact);

  useEffect(() => {
    dispatch(resetContactState());

    return () => {
      dispatch(resetContactState());
    };
  }, [dispatch]);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const accepted = formData.get("accepted");

    if (!accepted) {
      toast.error("Please accept the contact consent.");

      return;
    }

    const contactData = {
      fullName: String(formData.get("fullName") || "").trim(),

      email: String(formData.get("email") || "").trim(),

      phone: String(formData.get("phone") || "").trim(),

      subject: String(formData.get("subject") || "").trim(),

      message: String(formData.get("message") || "").trim(),

      agreedToContact: true,
    };

    try {
      const response = await dispatch(sendContactMessage(contactData)).unwrap();

      toast.success(response?.message || "Message sent successfully.");

      form.reset();
    } catch (submitError) {
      console.error("Contact form submit error:", submitError);

      toast.error(
        typeof submitError === "string"
          ? submitError
          : submitError?.message || "Failed to send message."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f7f8] px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1450px]">
        <Breadcrumb />

        <ContactHero />

        <section className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(300px,0.9fr)]">
          <ContactForm handleSubmit={handleSubmit} isLoading={isLoading} />

          <aside className="space-y-5">
            <ContactInformation />

            <WhatsAppCard
              whatsappLink={whatsappLink}
              isConfigured={Boolean(whatsappNumber)}
            />

            <SupportHours />

            <HelpCenterCard />
          </aside>
        </section>
      </div>
    </main>
  );
}

function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm font-semibold"
    >
      <Link
        href="/"
        className="flex items-center gap-2 text-[#ff0f68] transition hover:text-[#d80057]"
      >
        <Home className="h-4 w-4 fill-current" />

        <span>Home</span>
      </Link>

      <ChevronRight className="h-4 w-4 text-[#b4b4ba]" />

      <span className="text-[#ff0f68]">Contact Us</span>
    </nav>
  );
}

function ContactHero() {
  return (
    <section className="relative mt-4 min-h-[220px] overflow-hidden rounded-2xl bg-black px-6 py-8 text-white shadow-sm sm:px-9 lg:px-11">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_40%,rgba(190,0,52,0.30),transparent_40%),linear-gradient(90deg,#020203_0%,#090005_48%,#160009_100%)]" />
      <div className="absolute inset-y-0 right-0 w-full opacity-95 sm:w-[63%]">
        <div
          className="absolute inset-0  bg-right-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/how-to-post-banner.png')",
            backgroundSize: "60% 100%",
            backgroundPositionX: "100%",
          }}
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-transparent" />

      <div className="relative z-10 flex min-h-[155px] items-center">
        <div className="flex max-w-[680px] items-start gap-5">
          <div className="hidden h-[78px] w-[78px] shrink-0 items-center justify-center rounded-full border-2 border-[#ff0f68] sm:flex">
            <Headphones
              className="h-10 w-10 text-[#ff0f68]"
              strokeWidth={1.8}
            />
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-[42px]">
              Contact Us
            </h1>

            <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
              We are here to help you with ads, support, and general inquiries.
            </p>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-flex items-center gap-3 text-sm font-semibold text-[#ff0f68] transition hover:text-[#ff4d94]"
            >
              <Mail className="h-5 w-5" />

              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactForm({ handleSubmit, isLoading }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_3px_20px_rgba(0,0,0,0.035)] sm:p-7 lg:p-9">
      <div className="mb-7">
        <h2 className="text-xl font-black text-[#17171c] sm:text-2xl">
          Send us a message
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#65656d]">
          We&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField
          label="Full Name"
          name="fullName"
          type="text"
          placeholder="Enter your full name"
          required
          disabled={isLoading}
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your email address"
          required
          disabled={isLoading}
        />

        <FormField
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="Enter your phone number"
          disabled={isLoading}
        />

        <FormField
          label="Subject"
          name="subject"
          type="text"
          placeholder="Enter subject"
          required
          disabled={isLoading}
        />

        <div>
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-bold text-[#24242a]"
          >
            Message <span className="text-[#ff0f68]">*</span>
          </label>

          <textarea
            id="message"
            name="message"
            required
            disabled={isLoading}
            rows={6}
            placeholder="Type your message here..."
            className="w-full resize-none rounded-lg border border-[#dfdfe4] bg-white px-4 py-3 text-sm text-[#222228] outline-none transition placeholder:text-[#a0a0a7] focus:border-[#ff0f68] focus:ring-2 focus:ring-[#ff0f68]/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="accepted"
            disabled={isLoading}
            className="mt-0.5 h-4 w-4 rounded border-[#d7d7dd] accent-[#ff0f68] disabled:cursor-not-allowed"
          />

          <span className="text-sm leading-5 text-[#55555d]">
            I agree to be contacted regarding my inquiry.
          </span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[#f80059] px-6 text-sm font-bold text-white transition hover:bg-[#d9004e] focus:outline-none focus:ring-2 focus:ring-[#ff0f68]/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send className={`h-5 w-5 ${isLoading ? "animate-pulse" : ""}`} />

          {isLoading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  placeholder,
  required = false,
  disabled = false,
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-bold text-[#24242a]"
      >
        {label}

        {required && <span className="text-[#ff0f68]"> *</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className="h-12 w-full rounded-lg border border-[#dfdfe4] bg-white px-4 text-sm text-[#222228] outline-none transition placeholder:text-[#a0a0a7] focus:border-[#ff0f68] focus:ring-2 focus:ring-[#ff0f68]/10 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:opacity-70"
      />
    </div>
  );
}

function ContactInformation() {
  return (
    <InfoCard title="Contact Information">
      <ContactInfoItem
        icon={<Mail className="h-5 w-5" />}
        title="Email"
        content={
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="transition hover:text-[#ff0f68]"
          >
            {SUPPORT_EMAIL}
          </a>
        }
      />

      <div className="my-4 border-t border-[#eeeeF1]" />

      <ContactInfoItem
        icon={<MapPin className="h-5 w-5" />}
        title="Location"
        content="Colombo, Sri Lanka"
      />
    </InfoCard>
  );
}

function WhatsAppCard({ whatsappLink, isConfigured }) {
  return (
    <InfoCard title="Chat with us on WhatsApp">
      <p className="mb-4 text-sm leading-6 text-[#5f5f67]">
        Get instant support for your queries.
      </p>

      <a
        href={whatsappLink}
        target={isConfigured ? "_blank" : undefined}
        rel={isConfigured ? "noreferrer" : undefined}
        onClick={(event) => {
          if (!isConfigured) {
            event.preventDefault();

            toast.error("WhatsApp is currently unavailable.");
          }
        }}
        className="flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#08bd53] px-5 text-sm font-bold text-white transition hover:bg-[#05a947]"
      >
        <MessageCircle className="h-5 w-5" />
        Chat on WhatsApp
      </a>
    </InfoCard>
  );
}

function SupportHours() {
  return (
    <InfoCard title="Support Hours">
      <div className="flex gap-3">
        <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#ff0f68]" />

        <div className="w-full">
          <p className="text-sm leading-6 text-[#5f5f67]">
            We are here to help you every day.
          </p>

          <div className="mt-4 rounded-lg border border-[#ffd3e1] bg-[#fff3f7] px-4 py-3 text-sm font-bold text-[#ff0f68]">
            Mon - Sun: 8:00 AM - 10:00 PM
          </div>
        </div>
      </div>
    </InfoCard>
  );
}

function HelpCenterCard() {
  return (
    <InfoCard title="Need quick help?">
      <div className="flex gap-3">
        <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#ff0f68]" />

        <div className="w-full">
          <p className="text-sm leading-6 text-[#5f5f67]">
            Find answers to common questions in our Help Center.
          </p>

          <Link
            href="/faq"
            className="mt-4 flex min-h-11 w-full items-center justify-center gap-3 rounded-lg border border-[#ff0f68] px-4 text-sm font-bold text-[#ff0f68] transition hover:bg-[#ff0f68] hover:text-white"
          >
            Visit Help Center
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </InfoCard>
  );
}

function InfoCard({ title, children }) {
  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_3px_20px_rgba(0,0,0,0.035)] sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="h-7 w-1 rounded-full bg-[#ff0f68]" />

        <h2 className="text-base font-black text-[#202026]">{title}</h2>
      </div>

      {children}
    </section>
  );
}

function ContactInfoItem({ icon, title, content }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#ffd7e3] bg-[#fff4f7] text-[#ff0f68]">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-black text-[#24242a]">{title}</h3>

        <div className="mt-1 text-sm leading-5 text-[#606068]">{content}</div>
      </div>
    </div>
  );
}

function ContactSkyline() {
  return (
    <div className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[58%] overflow-hidden md:block">
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#ff0f68]/30 to-transparent" />

      <div className="absolute bottom-0 right-0 flex h-[165px] w-[88%] items-end justify-end gap-[6px] opacity-60">
        {BUILDINGS.map((height, index) => (
          <div
            key={`${height}-${index}`}
            className="relative w-7 border-x border-t border-[#ff2a76]/60 bg-[#ff0f68]/20"
            style={{ height }}
          >
            <div
              className="absolute inset-1 opacity-50"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to bottom, #ff5b95 0 2px, transparent 2px 9px)",
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-[31%] h-[215px] w-16">
        <div className="absolute bottom-0 left-1/2 h-[152px] w-8 -translate-x-1/2 bg-gradient-to-t from-[#ff0f68]/70 to-[#ff0f68]/25" />

        <div className="absolute bottom-[144px] left-1/2 h-8 w-12 -translate-x-1/2 rounded-[50%] border border-[#ff477f]/80 bg-[#ff0f68]/40" />

        <div className="absolute bottom-[169px] left-1/2 h-8 w-4 -translate-x-1/2 bg-[#ff0f68]/50" />

        <div className="absolute bottom-[196px] left-1/2 h-7 w-[3px] -translate-x-1/2 bg-[#ff0f68]" />
      </div>

      <div className="absolute bottom-0 left-[4%] right-0 h-px bg-[#ff0f68]/60 shadow-[0_0_25px_8px_rgba(255,15,104,0.25)]" />
    </div>
  );
}
