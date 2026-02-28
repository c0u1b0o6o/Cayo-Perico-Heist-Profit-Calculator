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
  title: 'Cayo Perico Heist Profit Calculator | GTA 5 Online Loot Optimizer',
  description: 'Maximize your Cayo Perico Heist profit with our optimal secondary loot calculator. Track Gold, Coke, Weed, and more across all zones. Support for 1-4 players and Hard Mode.',
  keywords: ['GTA 5', 'GTA Online', 'Cayo Perico Heist', 'Loot Calculator', 'Profit Optimizer', 'Secondary Targets', 'Heist Planning'],
  authors: [{ name: 'Antigravity' }],
  openGraph: {
    title: 'Cayo Perico Heist Profit Calculator',
    description: 'The ultimate tool to plan your Cayo Perico secondary loot strategy.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cayo Perico Heist Profit Calculator',
    description: 'Optimal loot planner for GTA Online Cayo Perico Heist.',
  },
  robots: {
    index: true,
    follow: true,
  },
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
