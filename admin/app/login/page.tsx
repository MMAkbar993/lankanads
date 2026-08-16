'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { loginAdmin, clearError } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Eye, EyeOff, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((s) => s.auth);
  const router = useRouter();

  useEffect(() => {
    if (token) router.replace('/dashboard');
  }, [token, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginAdmin({ email, password }));
    if (loginAdmin.fulfilled.match(result)) {
      toast.success('Welcome back, Admin!');
      router.replace('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #050505 0%, #1a0010 100%)' }}>
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-10">
          <span className="text-3xl font-bold tracking-tight" style={{ color: 'var(--primary)' }}>Lankan</span>
          <span className="text-3xl font-bold text-white tracking-tight">Ads</span>
          <p className="text-gray-400 mt-2 text-sm">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ background: 'var(--dark-light)', border: '1px solid #1f1f1f' }}>
          <h2 className="text-xl font-semibold text-white mb-6">Sign in to continue</h2>
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="off"
                placeholder="admin@lankanadslk.com"
                className="w-full rounded-lg px-4 py-2.5 text-white text-sm outline-none transition focus:ring-1"
                style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg px-4 py-2.5 text-white text-sm outline-none pr-11"
                  style={{ background: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={(e) => e.target.style.borderColor = '#2a2a2a'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: loading ? '#cc0c6d' : 'var(--primary)' }}
              onMouseEnter={(e) => !loading && ((e.target as HTMLElement).style.background = 'var(--primary-hover)')}
              onMouseLeave={(e) => !loading && ((e.target as HTMLElement).style.background = 'var(--primary)')}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
