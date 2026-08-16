interface StatCardProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

export default function StatCard({ label, value, icon, color, loading }: StatCardProps) {
  return (
    <div className="rounded-xl p-5 flex items-center gap-4 shadow-sm" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: color }}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        {loading ? (
          <div className="h-7 w-16 rounded mt-1 animate-pulse" style={{ background: '#e5e7eb' }} />
        ) : (
          <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--dark)' }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        )}
      </div>
    </div>
  );
}
