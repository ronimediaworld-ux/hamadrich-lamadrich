import fs from 'node:fs';
import path from 'node:path';

// SEO: כל כתובת מוגשת עם כותרת, תיאור, canonical ו-Open Graph משלה (גם בלי JavaScript), תוכן בסיסי לזחלנים,
// נתוני JSON-LD, וקובצי sitemap.xml ו-robots.txt דינמיים. כך גוגל מבין כל עמוד ולא רק את דף הבית.

const SITE_NAME = 'המדריך למדריך';

function readJson(rootDir, name) {
  try {
    return JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'data', `${name}.json`), 'utf8'));
  } catch {
    return [];
  }
}

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const trim = (s, n) => {
  const t = String(s ?? '').replace(/\s+/g, ' ').trim();
  return t.length > n ? t.slice(0, n - 1).trimEnd() + '…' : t;
};

const CATEGORIES = {
  activities: ['פעולות ומערכים', 'מאגר פעולות איכותי למדריכים: ערכים, אמונה, פרשת שבוע ותכנים כלליים — מוכנות להעברה.'],
  games: ['רשימת משחקים', 'משחקי קרחונים, אמון, חידונים וגיבוש קליל — מוכנים לשילוב בכל פעולה.'],
  methods: ['מתודות', 'מאגר מתודות שאפשר לשלב בכל פעולה בתנועת נוער.'],
  readings: ['קטעי קריאה', 'סיפורים, משלים ושירה לפעולות בתנועת נוער, לכל טווח גילאים.'],
  'staff-study': ['לימוד צוות', 'מפגשי לימוד קצרים להתפתחות צוות ההדרכה.'],
  tools: ['סיטואציות בהדרכה', 'מצבים אמיתיים בהדרכה בתנועת נוער ואיך להתמודד איתם.'],
  'social-nights': ['ערבי גיבוש וכיף', 'ערבי נושא, משימות ולילות מיוחדים לקבוצה.'],
  'special-events': ['אירועים מיוחדים', 'מדריכים לאירועי שיא בסניף ובחודש ארגון, כמו לילה לבן: שיחות אישיות, גיבוש בין הקבוצות, הכרת תודה ורשימת בדיקה.'],
  walls: ['קירות וגלופות', 'חודש ארגון בתנועות נוער: שמות השכבות בבני עקיבא, אריאל ועזרא.'],
};

const STATIC = {
  '/': { title: `${SITE_NAME} — מאגר פעולות איכותי למדריכים בתנועות נוער`, desc: 'מאגר פעולות איכותי, בנוי שלב־שלב ומוכן להעברה: פעולות, משחקים, ערבי גיבוש, קטעי קריאה, צ׳ופרים, לימוד צוות ועוזר AI למדריכים.' },
  '/about': { title: `אודות — ${SITE_NAME}`, desc: 'רוני גרוס, מנהלת האתר: שמיניסטית שהדריכה שנתיים שכבת גדולות ובנתה את המקום שהיה חסר לה.' },
  '/videos': { title: `סרטונים: סדרת הרשת של ${SITE_NAME}`, desc: 'סדרת סרטונים קצרים למדריכים בתנועות נוער: איך בונים פעולה, איך בונים מערך ומה באמת מביא חניכים. עם קישור למדריך הכתוב.' },
  '/chuparim': { title: `רעיונות לצ׳ופרים להדפסה — ${SITE_NAME}`, desc: 'רעיונות לצ׳ופרים מעוצבים למדריכים, מוכנים להדפסה, עם אפשרות להוסיף את השם שלכם.' },
  '/how-to-build': { title: `נדבר ת׳כלס: איך בונים פעולה, שיחות אישיות ועיצוב בקנבה — ${SITE_NAME}`, desc: 'מדריכים פרקטיים למדריכים: איך בונים פעולה ומערך, איך עושים שיחה אישית עם חניך, ואיך מעצבים בקנבה.' },
  '/ai': { title: `ניצוץ — עוזר AI למדריכים — ${SITE_NAME}`, desc: 'ניצוץ, עוזר ה-AI של האתר: מחפש קודם במאגר ועוזר לבנות פעולה, לפתור סיטואציה או לחשוב על צ׳ופר.' },
  '/builder': { title: `בונה פעולה — ${SITE_NAME}`, desc: 'בוחרים גיל, זמן ונושא, והאתר מרכיב פעולה שלמה מהמאגר.' },
  '/shabbat-pack': { title: `חבילת שבת להדפסה — ${SITE_NAME}`, desc: 'פעולות וקטעי קריאה מתאימים לשבת, להדפסה מראש כקובץ אחד.' },
  '/now': { title: `אני צריכה פעולה עכשיו — ${SITE_NAME}`, desc: 'בוחרים כיתה, זמן וסוג פעילות ומקבלים הצעות לפעולות מתוך המאגר: גיבוש, משחקים, פעולות חינוכיות, בלי ציוד ולשבת.' },
  '/whats-new': { title: `מה חדש באתר — ${SITE_NAME}`, desc: 'התכנים האחרונים שנוספו למאגר המדריך למדריך.' },
  '/submit': { title: `שליחת פעולה — ${SITE_NAME}`, desc: 'יש לכם פעולה טובה? שתפו אותה במאגר.' },
  '/privacy': { title: `מדיניות פרטיות — ${SITE_NAME}`, desc: 'איזה מידע האתר אוסף, למה, איפה הוא נשמר ומה הזכויות שלכם.' },
  '/terms': { title: `תנאי שימוש — ${SITE_NAME}`, desc: 'תנאי השימוש באתר המדריך למדריך: שימוש מותר, זכויות יוצרים ואחריות.' },
  '/accessibility': { title: `הצהרת נגישות — ${SITE_NAME}`, desc: 'הצהרת הנגישות של האתר, ההתאמות שבוצעו והדרך לפנות אלינו.' },
  '/reviews': { title: `דירוג והמלצות — ${SITE_NAME}`, desc: 'מה אומרים המדריכים על האתר.' },
};
const NOINDEX = ['/search', '/favorites', '/admin', '/present', '/my'];

export function registerSeoRoutes(app, rootDir, distPath, siteUrlFromEnv) {
  const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
  const data = {
    activity: readJson(rootDir, 'activities'),
    reading: readJson(rootDir, 'readings'),
    'staff-study': readJson(rootDir, 'staffStudy'),
    chupar: readJson(rootDir, 'chuparim'),
  };
  const byId = (kind, id) => data[kind].find((x) => x.id === id);
  // עמודי נושא: כל תת־נושא שיש בו לפחות שתי פעולות
  const topics = new Map();
  for (const a of data.activity) for (const t of a.subtopics || []) topics.set(t, [...(topics.get(t) || []), a]);
  for (const [t, list] of [...topics]) if (list.length < 2) topics.delete(t);
  const dataMtime = (name) => { try { return fs.statSync(path.join(rootDir, 'src', 'data', `${name}.json`)).mtime.toISOString().slice(0, 10); } catch { return undefined; } };

  const baseUrl = (req) => (siteUrlFromEnv || `${req.protocol}://${req.get('host')}`).replace(/\/$/, '');

  function describe(req) {
    const p = decodeURIComponent(req.path).replace(/\/$/, '') || '/';
    const noindex = NOINDEX.some((n) => p === n || p.startsWith(n + '/'));
    if (STATIC[p]) return { ...STATIC[p], path: p, noindex, type: 'website' };
    if (noindex) return { title: SITE_NAME, desc: STATIC['/'].desc, path: p, noindex: true, type: 'website', known: true };
    let m = p.match(/^\/category\/([\w-]+)$/);
    if (m && CATEGORIES[m[1]]) return { title: `${CATEGORIES[m[1]][0]} — ${SITE_NAME}`, desc: CATEGORIES[m[1]][1], path: p, noindex, type: 'website', category: m[1] };
    m = p.match(/^\/topic\/([^/]+)$/);
    if (m && topics.has(m[1])) {
      const t = m[1];
      const n = topics.get(t).length;
      return { title: `${t.startsWith('פרשת ') ? `פעולות ל${t}` : `פעולות בנושא ${t}`} — ${n} רעיונות להדרכה | ${SITE_NAME}`, desc: trim(`${n} פעולות מוכנות להעברה בנושא ${t} בתנועות נוער: שלבים מסודרים, שאלות לדיון וקטעי קריאה, לכל הגילאים.`, 300), path: p, noindex, type: 'website', topic: t };
    }
    m = p.match(/^\/activity\/([^/]+)$/);
    if (m) {
      const a = byId('activity', m[1]);
      if (a) return { title: `${a.title} — פעולה ל${a.ageLabel} | ${SITE_NAME}`, desc: trim(`${a.description} (${a.ageLabel}, ${a.duration} דקות)`, 300), path: p, noindex, type: 'article', item: { kind: 'activity', a } };
    }
    m = p.match(/^\/reading\/([^/]+)$/);
    if (m) {
      const r = byId('reading', m[1]);
      if (r) return { title: `${r.title} — קטע קריאה | ${SITE_NAME}`, desc: trim(r.description, 300), path: p, noindex, type: 'article', item: { kind: 'reading', a: r } };
    }
    m = p.match(/^\/staff-study\/([^/]+)$/);
    if (m) {
      const s = byId('staff-study', m[1]);
      if (s) return { title: `${s.title} — לימוד צוות | ${SITE_NAME}`, desc: trim(s.description, 300), path: p, noindex, type: 'article', item: { kind: 'staff', a: s } };
    }
    m = p.match(/^\/chupar\/([^/]+)$/);
    if (m) {
      const c = byId('chupar', m[1]);
      if (c) return { title: `${c.title} — רעיון לצ׳ופר | ${SITE_NAME}`, desc: trim(c.description, 300), path: p, noindex, type: 'article', item: { kind: 'chupar', a: c } };
    }
    return { title: SITE_NAME, desc: STATIC['/'].desc, path: p, noindex: true, type: 'website' };
  }

  const videoList = (() => {
    try {
      const src = fs.readFileSync(path.join(rootDir, 'src', 'data', 'videos.ts'), 'utf8');
      return [...src.matchAll(/platform: 'youtube', code: '([\w-]+)'[^}]*?title: '([^']+)'/g)].map((m) => ({ code: m[1], title: m[2] }));
    } catch { return []; }
  })();

  function breadcrumb(d, base) {
    const trail = [['בית', '/']];
    if (d.item) {
      const k = d.item.kind;
      if (k === 'reading') trail.push(['קטעי קריאה', '/category/readings']);
      else if (k === 'staff') trail.push(['לימוד צוות', '/category/staff-study']);
      else if (k === 'chupar') trail.push(['רעיונות לצ׳ופרים', '/chuparim']);
      else trail.push(['פעולות', `/category/${d.item.a.categorySlug || 'activities'}`]);
    } else if (d.topic) trail.push(['פעולות', '/category/activities']);
    else if (d.category || STATIC[d.path]) trail.push([d.title.split(' — ')[0], d.path]);
    else return null;
    if (d.item || d.topic) trail.push([d.topic || d.item.a.title, d.path]);
    if (trail.length < 2) return null;
    return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: trail.map(([name, p], i) => ({ '@type': 'ListItem', position: i + 1, name, item: base + (p === '/' ? '/' : encodeURI(p)) })) };
  }

  function jsonLd(d, base) {
    const url = base + encodeURI(d.path);
    const out = [];
    if (d.path === '/') {
      out.push({ '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: base + '/', inLanguage: 'he', potentialAction: { '@type': 'SearchAction', target: `${base}/search?q={search_term_string}`, 'query-input': 'required name=search_term_string' } });
      out.push({ '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: base + '/', logo: `${base}/icon-512.png`, founder: { '@type': 'Person', name: 'רוני גרוס' }, sameAs: ['https://www.instagram.com/hamadrich_lamadrich/', 'https://www.youtube.com/@%D7%94%D7%9E%D7%93%D7%A8%D7%99%D7%9A%D7%9C%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%94%D7%93%D7%95%D7%A8%D7%94%D7%91%D7%90%D7%A9%D7%9C%D7%94%D7%94%D7%93%D7%A8%D7%9B%D7%94'] });
    }
    if (d.path === '/videos') {
      for (const v of videoList) out.push({ '@context': 'https://schema.org', '@type': 'VideoObject', name: v.title, description: `${v.title}: סרטון מסדרת "${SITE_NAME}" למדריכים בתנועות נוער.`, thumbnailUrl: `https://i.ytimg.com/vi/${v.code}/hqdefault.jpg`, embedUrl: `https://www.youtube-nocookie.com/embed/${v.code}`, contentUrl: `https://www.youtube.com/watch?v=${v.code}`, inLanguage: 'he', uploadDate: '2026-01-01' });
    }
    if (d.topic) {
      const list = topics.get(d.topic) || [];
      out.push({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: d.title, url, inLanguage: 'he', mainEntity: { '@type': 'ItemList', itemListElement: list.slice(0, 50).map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${base}/activity/${a.id}`, name: a.title })) } });
    }
    if (d.item) {
      const a = d.item.a;
      out.push({ '@context': 'https://schema.org', '@type': 'LearningResource', name: a.title, description: trim(a.description, 300), url, inLanguage: 'he', educationalLevel: a.ageLabel, author: { '@type': 'Person', name: 'רוני גרוס' }, publisher: { '@type': 'Organization', name: SITE_NAME }, isAccessibleForFree: true, learningResourceType: d.item.kind === 'reading' ? 'קטע קריאה' : 'פעולה', ...(a.duration ? { timeRequired: `PT${a.duration}M` } : {}) });
    }
    const bc = breadcrumb(d, base);
    if (bc) out.push(bc);
    return out;
  }

  // תוכן בסיסי שזחלנים רואים גם בלי JavaScript (React מחליף אותו בטעינה)
  function fallbackBody(d, base) {
    const link = (href, text) => `<li><a href="${esc(base + href)}">${esc(text)}</a></li>`;
    let extra = '';
    if (d.path === '/') {
      extra = `<ul>${Object.entries(CATEGORIES).map(([slug, [label]]) => link(`/category/${slug}`, label)).join('')}${link('/chuparim', 'רעיונות לצ׳ופרים')}${link('/how-to-build', 'נדבר ת׳כלס')}${link('/about', 'אודות')}</ul>`;
    } else if (d.topic) {
      extra = `<ul>${(topics.get(d.topic) || []).map((a) => link(`/activity/${a.id}`, a.title)).join('')}</ul>`;
    } else if (d.category) {
      const list = d.category === 'activities' ? data.activity.filter((a) => a.categorySlug === 'activities') : d.category === 'games' ? data.activity.filter((a) => a.categorySlug === 'games') : d.category === 'social-nights' ? data.activity.filter((a) => a.categorySlug === 'social-nights') : d.category === 'readings' ? data.reading : d.category === 'staff-study' ? data['staff-study'] : [];
      const route = d.category === 'readings' ? 'reading' : d.category === 'staff-study' ? 'staff-study' : 'activity';
      extra = `<ul>${list.slice(0, 400).map((x) => link(`/${route}/${x.id}`, x.title)).join('')}</ul>`;
    } else if (d.item) {
      const a = d.item.a;
      const goals = Array.isArray(a.goals) ? `<h2>מטרות</h2><ul>${a.goals.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>` : '';
      const steps = Array.isArray(a.flow) ? `<h2>שלבי הפעולה</h2><ol>${a.flow.map((f) => `<li>${esc(f.label)}</li>`).join('')}</ol>` : '';
      const meta = [a.ageLabel && `גיל: ${a.ageLabel}`, a.duration && `משך: ${a.duration} דקות`, a.groupSize && `גודל קבוצה: ${a.groupSize}`].filter(Boolean).join(' · ');
      const tops = Array.isArray(a.subtopics) && a.subtopics.length ? `<p>${a.subtopics.slice(0, 4).map((t) => `<a href="${esc(base)}/topic/${encodeURIComponent(t)}">${esc(t)}</a>`).join(' · ')}</p>` : '';
      extra = (meta ? `<p>${esc(meta)}</p>` : '') + goals + steps + tops;
    }
    return `<main><h1>${esc(d.title.split(' — ')[0].split(' | ')[0])}</h1><p>${esc(d.desc)}</p>${extra}</main>`;
  }

  function render(req) {
    const d = describe(req);
    const base = baseUrl(req);
    const url = base + (d.path === '/' ? '/' : encodeURI(d.path));
    const tags = [
      `<meta name="description" content="${esc(d.desc)}" />`,
      `<link rel="canonical" href="${esc(url)}" />`,
      `<meta name="robots" content="${d.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}" />`,
      `<meta property="og:title" content="${esc(d.title)}" />`,
      `<meta property="og:description" content="${esc(d.desc)}" />`,
      `<meta property="og:type" content="${d.type}" />`,
      `<meta property="og:url" content="${esc(url)}" />`,
      `<meta property="og:site_name" content="${SITE_NAME}" />`,
      `<meta property="og:locale" content="he_IL" />`,
      `<meta property="og:image" content="${esc(base)}/og-image.png" />`,
      `<meta property="og:image:width" content="1200" />`,
      `<meta property="og:image:height" content="630" />`,
      `<meta name="twitter:title" content="${esc(d.title)}" />`,
      `<meta name="twitter:description" content="${esc(d.desc)}" />`,
      `<meta name="twitter:image" content="${esc(base)}/og-image.png" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
    ];
    // אימות בעלות ב-Google Search Console (אופציונלי): GOOGLE_SITE_VERIFICATION=הערך מתג ה-HTML
    const gsv = process.env.GOOGLE_SITE_VERIFICATION || 'CXp_ojvpvpGWv6xIXMYAE8n9i9vU-4AyBmGXtcmhpHM';
    tags.push(`<meta name="google-site-verification" content="${esc(gsv)}" />`);
    for (const ld of jsonLd(d, base)) tags.push(`<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`);
    let html = indexHtml
      .replace(/<title>.*?<\/title>/s, `<title>${esc(d.title)}</title>`)
      .replace(/<meta name="description"[^>]*>\s*/s, '')
      .replace(/<meta property="og:title"[^>]*>\s*/s, '')
      .replace(/<meta property="og:description"[^>]*>\s*/s, '')
      .replace(/<meta property="og:type"[^>]*>\s*/s, '')
      .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${fallbackBody(d, base)}</div>`);
    return { html, status: d.title === SITE_NAME && d.path !== '/' && !d.known ? 404 : 200 };
  }

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api/\nDisallow: /present/\nDisallow: /search\nDisallow: /favorites\nDisallow: /my/\n\nSitemap: ${baseUrl(req)}/sitemap.xml\n`);
  });

  app.get('/sitemap.xml', (req, res) => {
    const base = baseUrl(req);
    const urls = [...Object.keys(STATIC), ...Object.keys(CATEGORIES).map((s) => `/category/${s}`),
      ...data.activity.map((a) => `/activity/${a.id}`), ...data.reading.map((r) => `/reading/${r.id}`),
      ...data['staff-study'].map((s) => `/staff-study/${s.id}`), ...data.chupar.map((c) => `/chupar/${c.id}`),
      ...[...topics.keys()].map((t) => `/topic/${encodeURIComponent(t)}`)];
    const lastmod = (u) => (u.startsWith('/activity/') || u.startsWith('/topic/') || u.startsWith('/category/') || u === '/' ? dataMtime('activities') : u.startsWith('/reading/') ? dataMtime('readings') : u.startsWith('/chupar') ? dataMtime('chuparim') : undefined);
    res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${esc(base + (u === '/' ? '/' : u.startsWith('/topic/') ? u : encodeURI(u)))}</loc>${lastmod(u) ? `<lastmod>${lastmod(u)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`);
  });

  // כל כתובת שאינה קובץ סטטי ואינה API — מוגשת עם ה-SEO שלה
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
    const { html, status } = render(req);
    res.status(status).type('html').send(html);
  });
}
