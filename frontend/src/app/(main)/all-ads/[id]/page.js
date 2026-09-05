import { permanentRedirect } from "next/navigation";
import AdDetailView from "@/components/ads/AdDetailView";
import { getPublicAd } from "@/lib/serverAds";
import { buildAdUrl } from "@/lib/adUrl";

/**
 * Legacy ad URL (/all-ads/<mongo id>).
 *
 * Existing links, bookmarks and anything already indexed still land here, so
 * this stays permanently — it just 308-redirects to the SEO-friendly URL so
 * search engines consolidate on the new structure instead of treating the
 * two as duplicates.
 *
 * If the ad can't be resolved server-side (e.g. the API is unreachable), it
 * falls back to rendering the client view, which fetches it itself, rather
 * than showing an error.
 */
export default async function LegacyAdPage({ params }) {
    const { id } = await params;
    const ad = await getPublicAd(id);

    if (ad?.adId) {
        permanentRedirect(buildAdUrl(ad));
    }

    return <AdDetailView identifier={id} />;
}
