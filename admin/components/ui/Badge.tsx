const configs: Record<string, { bg: string; color: string; label: string }> = {
  active:   { bg: '#d1fae5', color: '#065f46', label: 'Active' },
  inactive: { bg: '#fee2e2', color: '#991b1b', label: 'Inactive' },
  pending:  { bg: '#fef3c7', color: '#92400e', label: 'Pending' },
  approved: { bg: '#d1fae5', color: '#065f46', label: 'Approved' },
  rejected: { bg: '#fee2e2', color: '#991b1b', label: 'Rejected' },
};

export default function Badge({ status }: { status: string }) {
  const c = configs[status] || { bg: '#f3f4f6', color: '#374151', label: status };
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
}
