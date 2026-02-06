import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vortex Portal',
  description: 'An artistic journey through space - museum exhibition',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
