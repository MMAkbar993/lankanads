import { getSiteContent } from "@/lib/seoContent";

// Renders one admin-managed SEO content block by key. Returns nothing when
// the block is missing, empty or switched off, so pages stay clean until
// the SEO team actually fills it in.
//
// The content field accepts plain text (line breaks preserved) or HTML, so
// the admin can paste a full section — headings, paragraphs, lists, links —
// and the typography below styles it consistently without them touching CSS.
export default async function SeoContentBlock({ contentKey, className = "" }) {
    const content = await getSiteContent([contentKey]);
    const block = content?.[contentKey];

    if (!block || (!block.title && !block.content)) return null;

    return (
        <section className={className}>
            {block.title && (
                <h2 className="mb-3 text-center text-[20px] font-bold text-slate-900 sm:text-[24px]">
                    {block.title}
                </h2>
            )}

            {block.content && (
                <div
                    className="
                        seo-content mx-auto max-w-4xl whitespace-pre-line
                        text-[14px] leading-7 text-slate-600
                        [&_a]:text-[var(--primary)] [&_a]:underline
                        [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-[18px] [&_h2]:font-bold [&_h2]:text-slate-900
                        [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-[16px] [&_h3]:font-bold [&_h3]:text-slate-900
                        [&_p]:mb-3
                        [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5
                        [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5
                        [&_li]:mb-1
                        [&_strong]:font-semibold [&_strong]:text-slate-800
                    "
                    dangerouslySetInnerHTML={{ __html: block.content }}
                />
            )}
        </section>
    );
}
