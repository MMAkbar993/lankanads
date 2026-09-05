
import AdsCards from "@/components/ads/AdsCards";
import SeoContentBlock from "@/components/SeoContentBlock";
import HomeBlogSection from "@/components/blog/HomeBlogSection";

export default function Home() {
  return (
    <div>
      <AdsCards showPagination={true} />

      <HomeBlogSection limit={3} />

      <SeoContentBlock
        contentKey="home_seo"
        className="mt-8 rounded-xl border border-slate-200 bg-white p-5 text-slate-600"
      />
    </div>
  );
}
