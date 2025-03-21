import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from './contexts/authContext';
import { PublicEnvScript } from 'next-runtime-env';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Innovation Ecosystem',
  description: 'Bridging Innovation & Technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <html lang='en' suppressHydrationWarning>
        <head>
          <PublicEnvScript />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange>
            {children}
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </AuthProvider>
  );
}
