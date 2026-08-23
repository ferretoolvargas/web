import { readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const productsPath = resolve(root, 'public/mock-data/products.json');
const sitemapPath = resolve(root, 'public/sitemap.xml');
const siteUrl = 'https://ferretoolvargas.github.io/web';
const staticRoutes = ['', 'catalogo', 'ofertas', 'contacto'];

const products = JSON.parse(await readFile(productsPath, 'utf8'));
const productRoutes = products
  .filter((product) => product.active && product.publicVisible)
  .map((product) => `productos/${product.slug}`)
  .sort((left, right) => left.localeCompare(right, 'es'));
const routes = [...staticRoutes, ...productRoutes];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${siteUrl}/${route}</loc></url>`).join('\n')}
</urlset>
`;

if (process.argv.includes('--write')) {
  await writeFile(sitemapPath, sitemap);
  console.log(`Sitemap generado con ${routes.length} rutas.`);
} else {
  const current = await readFile(sitemapPath, 'utf8');
  if (current !== sitemap) {
    console.error('El sitemap no coincide con las rutas públicas. Ejecuta npm run seo:generate.');
    process.exitCode = 1;
  } else {
    console.log(`Sitemap verificado: ${routes.length} rutas.`);
  }
}
