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
  metadataBase: new URL('https://cayo-perico.cuboouo.com'),
  title: 'Cayo Perico Heist Profit Calculator | GTA 5 Online Loot Optimizer',
  description: 'Maximize your GTA 5 Cayo Perico Heist profit. Optimal secondary loot calculator for Gold, Coke, Weed. Solo and Multiplayer rank #1 routes. 佩里克島搶劫最強計算機。',
  keywords: [
      /* English Domain */
      'GTA 5', 'GTA Online', 'Cayo Perico Heist', 'Loot Calculator', 'Profit Optimizer', 'Secondary Targets', 'Heist Planning', 'Best Cayo Perico Loot', 'Solo Payout', 'Max Profit', 'Cayo Perico Simulator',
      /* Traditional Chinese Domain */
      '佩里克島搶劫計算機', '佩里克島', '佩島', '單人', '古柯鹼 黃金 價值', '總收益', 'GTA 5 賺錢', '佩島搶劫', '次要目標',
      /* Simplified Chinese Domain */
      '佩里科岛抢劫计算器', '次要目标 价值', '单人最高收益'
  ],
  authors: [{ name: 'Antigravity' }],
  openGraph: {
    title: 'Cayo Perico Heist Profit Calculator',
    description: 'The ultimate tool to plan your Cayo Perico secondary loot strategy. 佩里克島搶劫最強計算機。',
    type: 'website',
    images: ['/og-image.jpg'],
    url: 'https://cayo-perico.cuboouo.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cayo Perico Heist Profit Calculator',
    description: 'Optimal loot planner for GTA Online Cayo Perico Heist.',
    images: ['/og-image.jpg'],
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
