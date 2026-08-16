import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/components/providers/ReduxProvider';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'Lankan Ads — Admin',
  description: 'Admin Dashboard for Lankan Ads',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
        <ReduxProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: { borderRadius: '8px', background: '#111111', color: '#fff', fontSize: '14px' },
              success: { iconTheme: { primary: '#ff0f87', secondary: '#fff' } },
            }}
          />
        </ReduxProvider>
      </body>
    </html>
  );
}
