import AdsSectionTitle from "@/components/ads/AdsSectionTitle";
import AdsCards        from "@/components/ads/AdsCards";
import { pageMeta } from "@/lib/siteMeta";

export const metadata = pageMeta({
  title: "Browse All Sri Lanka Ads | Latest Online Listings | Lankan Ads",
  description:
    "Browse all the latest Sri Lanka ads on Lankan Ads. Find vehicles, property, jobs, services and more, or post your own ad online in minutes.",
  path: "/all-ads",
});

export default function AllAdsPage() {
  return (
    <section className="mx-auto max-w-7xl bg-[var(--gray)]">
      <AdsSectionTitle title="All Ads" />
      <AdsCards showPagination={true} />
    </section>
  );
}