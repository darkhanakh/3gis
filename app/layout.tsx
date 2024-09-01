import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Providers } from '@/app/providers';

const font = Roboto({ subsets: ['latin'], weight: '400' });

export const metadata: Metadata = {
  title: '3GIS',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body className={cn(font.className, 'dark')}>{children}</body>
      </Providers>
    </html>
  );
}
