// Single source of truth for building wa.me links, reusing the existing
// NEXT_PUBLIC_WHATSAPP_NUMBER env var instead of hardcoding it per-component.
export function buildWhatsAppLink(message = "") {
    const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "").replace(
        /\D/g,
        ""
    );

    const text = message ? `?text=${encodeURIComponent(message)}` : "";

    return `https://wa.me/${digits}${text}`;
}
