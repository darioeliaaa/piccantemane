import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

/**
 * Genera sitemap.xml e robots.txt leggendo il canonical di ogni pagina
 * appena prerenderizzata — stesso principio usato in Sìdero: il dominio e
 * l'elenco delle pagine vengono dalla build reale, non da una lista scritta
 * a mano che può disallinearsi dal sito.
 */
const ROOT = new URL('..', import.meta.url).pathname;
const BROWSER_DIR = join(ROOT, 'dist', 'piccantomane', 'browser');

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name === 'index.html') yield path;
  }
}

const urls = [];

for await (const file of htmlFiles(BROWSER_DIR)) {
  const html = await readFile(file, 'utf8');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical) urls.push({ canonical, file: relative(BROWSER_DIR, file) });
}

urls.sort((a, b) => a.canonical.localeCompare(b.canonical));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.canonical}</loc></url>`).join('\n')}
</urlset>
`;

await writeFile(join(BROWSER_DIR, 'sitemap.xml'), xml, 'utf8');

const origin = new URL(urls[0].canonical).origin;
await writeFile(
  join(BROWSER_DIR, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
  'utf8',
);

console.log(`sitemap.xml — ${urls.length} URL · robots.txt — ${origin}`);
