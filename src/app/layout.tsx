import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'jfje - Your E-commerce Notes Hub',
  description: 'Organize your e-commerce notes, shopping lists, product ideas and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
