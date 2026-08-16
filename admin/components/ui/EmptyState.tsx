import { SearchX } from 'lucide-react';

export default function EmptyState({ message = 'No data found' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <SearchX size={24} className="text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-400">{message}</p>
    </div>
  );
}
