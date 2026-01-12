import fs from 'fs';
import path from 'path';

const baseUrl = 'https://newswindon.com';
const publicRoutes = [
  '/',
  '/empresas',
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${publicRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

const sitemapPath = path.resolve(process.cwd(), 'client', 'public', 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemapContent);
console.log(`Sitemap generated at ${sitemapPath}`);
