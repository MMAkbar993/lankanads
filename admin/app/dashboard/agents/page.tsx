'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchAgents, deleteAgent, Agent } from '@/store/slices/agentSlice';
import toast from 'react-hot-toast';
import Badge from '@/components/ui/Badge';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/ConfirmModal';
import SearchBar from '@/components/ui/SearchBar';
import TableSkeleton from '@/components/ui/TableSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import EditAgentModal from '@/components/agents/EditAgentModal';
import { Pencil, Trash2, Users } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

export default function AgentsPage() {
  const dispatch = useAppDispatch();

  const { agents, total, pages, loading, deleteLoading } = useAppSelector(
    (s) => s.agents
  );

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = useCallback(() => {
    dispatch(fetchAgents({ page: currentPage, search }));
  }, [dispatch, currentPage, search]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const handleDelete = async () => {
    if (!deleteId) return;

    const result = await dispatch(deleteAgent(deleteId));

    if (deleteAgent.fulfilled.match(result)) {
      toast.success('Agent deleted successfully');
      setDeleteId(null);
      load();
    } else {
      toast.error('Failed to delete agent');
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: 'var(--dark)' }}>
          All Agents
        </h1>

        <p className="mt-0.5 text-sm text-gray-400">
          Manage and monitor all agents on the platform.
        </p>
      </div>

      <div
        className="overflow-hidden rounded-xl shadow-sm"
        style={{
          background: 'var(--white)',
          border: '1px solid var(--border)',
        }}
      >
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white"
              style={{ background: '#0891b2' }}
            >
              <Users size={14} />
            </div>

            <span
              className="text-sm font-semibold"
              style={{ color: 'var(--dark)' }}
            >
              {total} Agents
            </span>
          </div>

          <SearchBar
            value={search}
            onChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            placeholder="Search name or WhatsApp…"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr
                style={{
                  background: 'var(--gray)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                {['Photo', 'Name', 'WhatsApp', 'Status', 'Created', 'Actions'].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : agents.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState message="No agents found. Try a different search." />
                  </td>
                </tr>
              ) : (
                agents.map((agent) => {
                  const imageUrl = getImageUrl(agent.image?.url);

                  return (
                    <tr
                      key={agent._id}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: '1px solid var(--border)' }}
                    >
                      <td className="px-4 py-3">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={agent.name}
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                            style={{ background: 'var(--primary)' }}
                          >
                            {agent.name?.[0] || 'A'}
                          </div>
                        )}
                      </td>

                      <td
                        className="px-4 py-3 font-medium"
                        style={{ color: 'var(--dark)' }}
                      >
                        {agent.name}
                      </td>

                      <td className="px-4 py-3 text-gray-500">
                        {agent.whatsapp}
                      </td>

                      <td className="px-4 py-3">
                        <Badge status={agent.status} />
                      </td>

                      <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                        {formatDate(agent.createdAt)}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditAgent(agent)}
                            className="rounded-lg p-1.5 text-blue-500 transition-all hover:bg-blue-50"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            onClick={() => setDeleteId(agent._id)}
                            className="rounded-lg p-1.5 text-red-500 transition-all hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={currentPage}
          pages={pages}
          total={total}
          limit={20}
          onPageChange={(page) => {
            setCurrentPage(page);
            dispatch(fetchAgents({ page, search }));
          }}
        />
      </div>

      <EditAgentModal
        agent={editAgent}
        onClose={() => {
          setEditAgent(null);
          load();
        }}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Agent"
        message="This will permanently remove the agent. This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleteLoading}
      />
    </div>
  );
}