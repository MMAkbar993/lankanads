import { getSiteContent } from "@/lib/seoContent";

// Renders one admin-managed SEO content block by key. Returns nothing when
// the block is missing, empty or switched off, so pages stay clean until
// the SEO team actually fills it in.
export default async function SeoContentBlock({ contentKey, className = "" }) {
    const content = await getSiteContent([contentKey]);
    const block = content?.[contentKey];

    if (!block || (!block.title && !block.content)) return null;

    return (
        <section className={className}>
            {block.title && (
                <h2 className="mb-2 text-[16px] font-bold">{block.title}</h2>
            )}

            {block.content && (
                <div
                    className="whitespace-pre-line text-[13px] leading-6 [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
            )}
        </section>
    );
}
