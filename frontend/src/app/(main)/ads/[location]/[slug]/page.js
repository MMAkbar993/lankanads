import { notFound } from "next/navigation";
import AdDetailView from "@/components/ads/AdDetailView";
import { getPublicAd } from "@/lib/serverAds";
import { buildAdUrl, extractAdId } from "@/lib/adUrl";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lankanadslk.com";

// Server-rendered metadata: search engines get a real title, description and
// canonical URL in the initial HTML. The canonical always points at the ad's
// current correct URL, so if the title or location has since been edited,
// the older URL still resolves but no longer competes as a duplicate.
export async function generateMetadata({ params }) {
    const { slug } = await params;
    const ad = await getPublicAd(extractAdId(slug));

    if (!ad) return { title: "Ad not found | LankanAdsLK" };

    const title = `${ad.title} | ${ad.location} | LankanAdsLK`;
    const description = (ad.description || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 160);

    const canonical = `${SITE_URL}${buildAdUrl(ad)}`;

    return {
        title,
        description,
        alternates: { canonical },
        openGraph: {
            title,
            description,
            url: canonical,
            type: "article",
            images: ad.image?.url ? [ad.image.url] : undefined,
        },
    };
}

export default async function AdSeoPage({ params }) {
    const { slug } = await params;
    const ad = await getPublicAd(extractAdId(slug));

    if (!ad) notFound();

    return <AdDetailView initialAd={ad} />;
}
