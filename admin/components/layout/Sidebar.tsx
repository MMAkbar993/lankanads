'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, UserPlus, Users, Megaphone, X, UsersRound, Coins } from 'lucide-react';

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Create Agent', href: '/dashboard/create-agent', icon: UserPlus },
  { label: 'All Agents', href: '/dashboard/agents', icon: Users },
  { label: 'All Ads', href: '/dashboard/ads', icon: Megaphone },
  { label: 'All Users', href: '/dashboard/users', icon: UsersRound },
  { label: 'Agent Credits', href: '/dashboard/agent-users', icon: Coins },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 flex flex-col transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '240px', background: 'var(--dark-light)', borderRight: '1px solid #1f1f1f' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid #1f1f1f' }}>
          <span className="text-xl font-bold">
            <span style={{ color: 'var(--primary)' }}>Lankan</span>
            <span className="text-white"> Ads</span>
          </span>
          <button onClick={onClose} className="text-gray-400 hover:text-white lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider px-3 mb-3">Menu</p>
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
                style={{
                  color: active ? 'var(--white)' : '#9ca3af',
                  background: active ? 'var(--primary)' : 'transparent',
                }}
                onMouseEnter={(e) => !active && ((e.currentTarget as HTMLElement).style.background = '#1a1a1a')}
                onMouseLeave={(e) => !active && ((e.currentTarget as HTMLElement).style.background = 'transparent')}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom branding */}
        <div className="px-6 py-4" style={{ borderTop: '1px solid #1f1f1f' }}>
          <p className="text-xs text-gray-600">Lankan Ads Admin v1.0</p>
        </div>
      </aside>
    </>
  );
}
