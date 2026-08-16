'use client';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchDashboardStats } from '@/store/slices/dashboardSlice';
import StatCard from '@/components/ui/StatCard';
import { Users, Megaphone, UserCheck, TrendingUp } from 'lucide-react';

export default function OverviewPage() {
  const dispatch = useAppDispatch();
  const { stats, loading } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers ?? 0, icon: <Users size={22} />, color: 'var(--primary)' },
    { label: 'Total Ads', value: stats?.totalAds ?? 0, icon: <Megaphone size={22} />, color: '#7c3aed' },
    { label: 'Total Agents', value: stats?.totalAgents ?? 0, icon: <UserCheck size={22} />, color: '#0891b2' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-7">
        <h1 className="text-xl font-bold" style={{ color: 'var(--dark)' }}>Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">Welcome back — here's what's happening on Lankan Ads.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <StatCard key={c.label} {...c} loading={loading} />
        ))}
      </div>

      {/* Quick nav cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href="/dashboard/agents" className="rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: '#0891b2' }}>
            <UserCheck size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--dark)' }}>Manage Agents</p>
            <p className="text-xs text-gray-400 mt-0.5">View, edit and delete agents</p>
          </div>
        </a>
        <a href="/dashboard/ads" className="rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all" style={{ background: 'var(--white)', border: '1px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: '#7c3aed' }}>
            <Megaphone size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: 'var(--dark)' }}>Review Ads</p>
            <p className="text-xs text-gray-400 mt-0.5">Approve, reject or monitor listings</p>
          </div>
        </a>
      </div>
    </div>
  );
}
