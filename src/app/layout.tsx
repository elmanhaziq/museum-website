import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'A Collection of Works — Artist Portfolio',
  description: 'Step inside a quiet, virtual art exhibition.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
