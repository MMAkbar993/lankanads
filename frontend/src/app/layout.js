import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../../redux/Provider";
import AuthLoader from "@/components/AuthLoader";
import { Toaster } from "react-hot-toast";
import Header from "@/Header/Header";
import Footer from "@/Footer/Footer";
import {
  SITE_URL,
  SITE_NAME,
  GOOGLE_SITE_VERIFICATION,
  organizationSchema,
  websiteSchema,
} from "@/lib/siteMeta";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Site-wide defaults. Individual pages override title/description/canonical
// with their own `metadata` export; anything they don't set falls back here.
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: "Sri Lanka ads | Online advertising in Sri Lanka | Post Ads",
  description:
    "Find the top Sri Lanka ads today! Lankan Ads is a highly reliable ads platform near me to buy, sell, and easily post online advertising in Sri Lanka.",

  applicationName: SITE_NAME,

  verification: {
    google: GOOGLE_SITE_VERIFICATION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    siteName: SITE_NAME,
    locale: "en_LK",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* Organization + WebSite schema, site-wide. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>

      <body>
        <ReduxProvider>
          <AuthLoader />
          <Header />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 5000,
            }}
          />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
