import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../../redux/Provider";
import AuthLoader from "@/components/AuthLoader";
import { Toaster } from "react-hot-toast";
import Header from "@/Header/Header";
import Footer from "@/Footer/Footer";
import SeoContentBlock from "@/components/SeoContentBlock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lankan Ads",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
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

          {/* SEO copy sits above the footer on every page — one block edited
              once in the admin panel, shown site-wide. */}
          <SeoContentBlock
            contentKey="footer_seo"
            className="mt-10 border-t border-slate-200 bg-slate-50 px-5 py-10"
          />

          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}