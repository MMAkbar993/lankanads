import AdsSectionTitle from "@/components/ads/AdsSectionTitle";
import AdsCards        from "@/components/ads/AdsCards";

export default function AllAdsPage() {
  return (
    <section className="mx-auto max-w-7xl bg-[var(--gray)]">
      <AdsSectionTitle title="All Ads" />
      <AdsCards showPagination={true} />
    </section>
  );
}