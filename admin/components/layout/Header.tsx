'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/hooks/redux';
import { logout } from '@/store/slices/authSlice';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.replace('/login');
  };

  return (
    <header
      className="flex items-center justify-between px-5 py-3.5 sticky top-0 z-10"
      style={{ background: 'var(--dark-light)', borderBottom: '1px solid #1f1f1f', height: '60px' }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="text-gray-400 hover:text-white lg:hidden">
          <Menu size={20} />
        </button>
      </div>

      {/* Right */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 transition-all hover:bg-white/5"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ background: 'var(--primary)' }}
          >
            A
          </div>
          <span className="text-sm text-gray-300 hidden sm:block">Hello, Admin</span>
        </button>

        {dropdownOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-44 rounded-xl py-1 shadow-xl z-50"
            style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
          >
            <button
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings size={15} />
              Profile
            </button>
            <div style={{ borderTop: '1px solid #2a2a2a', margin: '4px 0' }} />
            <button
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all"
              style={{ color: 'var(--primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1f0010')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              onClick={handleLogout}
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
