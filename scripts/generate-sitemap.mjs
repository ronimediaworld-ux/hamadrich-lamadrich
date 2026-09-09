import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const SITE_URL = (process.env.SITE_URL || 'https://hamadrich-lamadrich.onrender.com').replace(/\/$/, '');

function extractIds(file) {
  const text = readFileSync(path.join(root, file), 'utf8');
  const ids = [];
  const re = /\bid:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(text))) ids.push(m[1]);
  return ids;
}

const activityIds = extractIds('src/data/activities.ts');
const readingIds = extractIds('src/data/readings.ts');
const categorySlugs = ['activities', 'games', 'methods', 'readings', 'staff-study', 'tools', 'social-nights'];

const staticUrls = ['/', '/chuparim', '/ai'];
const categoryUrls = categorySlugs.map((s) => `/category/${s}`);
const activityUrls = activityIds.map((id) => `/activity/${id}`);
const readingUrls = readingIds.map((id) => `/reading/${id}`);

const allUrls = [...staticUrls, ...categoryUrls, ...activityUrls, ...readingUrls];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>
`;

writeFileSync(path.join(root, 'public/sitemap.xml'), xml);
console.log(`sitemap.xml written with ${allUrls.length} URLs (base: ${SITE_URL})`);
