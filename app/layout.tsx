import type { Metadata, Viewport } from 'next';
import { Press_Start_2P } from 'next/font/google';
import './globals.css';

const pixelFont = Press_Start_2P({
  variable: '--font-pixel',
  subsets: ['latin'],
  weight: '400',
});

export const metadata: Metadata = {
  title: '0719 Pixel Cafe ☕',
  description: '나미의 생일 카페에 오신 걸 환영해요!',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pixelFont.variable}>
      <body className="bg-stone-900 overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
