
import AdsCards from "@/components/ads/AdsCards";
import SeoContentBlock from "@/components/SeoContentBlock";
import HomeBlogSection from "@/components/blog/HomeBlogSection";
import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta({
  title: "Sri Lanka ads | Online advertising in Sri Lanka | Post Ads",
  description:
    "Find the top Sri Lanka ads today! Lankan Ads is a highly reliable ads platform near me to buy, sell, and easily post online advertising in Sri Lanka.",
  path: "/",
});

export default function Home() {
  return (
    <div>
      {/* Pagination is client-side state inside AdsCards, so pages 1, 2, 3…
          all stay on this route and keep the SEO blocks below. */}
      <AdsCards showPagination={true} />

      <HomeBlogSection limit={3} />

      <SeoContentBlock
        contentKey="home_seo"
        className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-slate-600"
      />

      {/* Homepage only — deliberately not in the root layout, so pricing,
          how-to-post and individual ad pages stay free of it. */}
      <SeoContentBlock
        contentKey="footer_seo"
        className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-600"
      />
    </div>
  );
}
