import { MetadataRoute } from 'next';

// 告訴 Next.js 在 build 的時候把這份檔案直接轉成靜態的 .txt
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://cayo-perico.cuboouo.com/sitemap.xml',
  };
}