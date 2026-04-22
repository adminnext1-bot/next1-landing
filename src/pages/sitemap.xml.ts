import { getAllPosts } from '../lib/sanity';
import { getAllBrokers } from '../lib/sanity';

export async function GET() {
  const SITE = 'https://next1hub.com';

  const [posts, brokers] = await Promise.all([
    getAllPosts(),
    getAllBrokers(),
  ]);

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/blog/', priority: '0.9', changefreq: 'daily' },
    { url: '/brokers/', priority: '0.8', changefreq: 'weekly' },
  ];

  const postPages = posts.map(p => ({
    url: `/blog/${p.slug.current}/`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const brokerPages = brokers.map(b => ({
    url: `/brokers/${b.slug.current}/`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const allPages = [...staticPages, ...postPages, ...brokerPages];
  const today = new Date().toISOString().split('T')[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${SITE}${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
