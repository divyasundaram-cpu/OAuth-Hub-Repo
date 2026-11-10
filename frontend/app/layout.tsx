import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'OAuth Agent Hub',
  description: 'AI-First Integration Guides & Live Generator',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
