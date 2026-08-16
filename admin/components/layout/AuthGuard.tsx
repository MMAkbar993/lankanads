'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/hooks/redux';
import Cookies from 'js-cookie';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { token } = useAppSelector((s) => s.auth);
  const cookieToken = Cookies.get('admin_token');

  useEffect(() => {
    if (!token && !cookieToken) {
      router.replace('/login');
    }
  }, [token, cookieToken, router]);

  if (!token && !cookieToken) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--dark)' }}>
        <span className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
