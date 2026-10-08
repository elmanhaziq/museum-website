import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kasih Arissa — Selected Works',
  description: 'Step inside a quiet, virtual art exhibition of selected works by artist and illustrator Kasih Arissa.',
};

// viewport-fit=cover lets the env(safe-area-inset-*) padding take effect on notched phones.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#fff8ee',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
