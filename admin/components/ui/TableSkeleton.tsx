export default function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 rounded animate-pulse" style={{ background: '#f3f4f6', width: j === 0 ? '40px' : '80%' }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
