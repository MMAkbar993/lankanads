export default function AdsSectionTitle({ title = "All Ads", subtitle = "" }) {
    return (
        <div className="mb-4 border-b border-[var(--border)] pb-3">
            <h2 className="text-[20px] font-bold tracking-tight text-[var(--dark)]">
                {title}
            </h2>

            {subtitle && (
                <p className="mt-1 text-[14px] text-gray-500">
                    {subtitle}
                </p>
            )}

            <div className="mt-2 h-1 w-14 rounded-full bg-[var(--primary)]" />
        </div>
    );
}