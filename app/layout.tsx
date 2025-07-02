import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AppProvider } from '@/contexts/AppContext';
import { AuthWrapper } from '@/components/auth/AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HR Platform - Employee Onboarding & Management',
  description: 'Modern employee onboarding and role management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppProvider>
            <AuthWrapper>
            {children}
            </AuthWrapper>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}