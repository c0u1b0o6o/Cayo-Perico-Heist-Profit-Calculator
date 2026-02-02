import type { Metadata } from 'next';
import { Architects_Daughter, Roboto } from 'next/font/google';
import './globals.css';

const architectsDaughter = Architects_Daughter({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-architects-daughter',
  display: 'swap',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Cayo Perico Heist Calculator',
  description: 'Optimal loot planner for GTA Online Cayo Perico Heist',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${architectsDaughter.variable} ${roboto.variable} antialiased bg-[#1a1a1a] text-[#eeeeee] min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
