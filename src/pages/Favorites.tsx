import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ActivityCard } from '../components/ActivityCard';
import { CopyButton } from '../components/CopyButton';
import { Reveal } from '../components/Reveal';
import { HeartIcon } from '../components/Icons';
import { getFavoriteIds, parseFavKey, toggleFavorite, type FavKind } from '../lib/favorites';
import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { chuparim } from '../data/chuparim';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { buildCombinedPrintHtml } from '../lib/activityPrint';
import { entriesForKeys } from '../lib/binderPrint';
import { offerHtml } from '../lib/printFile';
import { listCopies, type PersonalCopy } from '../lib/personalCopies';

interface Tab { id: string; label: string; color: string; tint: string }

// כל לשונית היא "מחיצה" בקלסר.
const TABS: Tab[] = [
  { id: 'activities', label: 'פעולות ומערכים', color: '#D96A2B', tint: '#FBE4D2' },
  { id: 'games', label: 'משחקים', color: '#7A9A3E', tint: '#E7EFD6' },
  { id: 'social-nights', label: 'ערבי גיבוש', color: '#E8B93C', tint: '#FBF0CE' },
  { id: 'readings', label: 'קטעי קריאה', color: '#C24270', tint: '#F6DDE7' },
  { id: 'staff-study', label: 'לימוד צוות', color: '#6B5AA6', tint: '#E6E1F4' },
  { id: 'chuparim', label: 'צ׳ופרים', color: '#3E7EA6', tint: '#DCEAF2' },
];

interface Item { tab: string; key: string; kind: FavKind; id: string; title: string; sub: string; url: string }

export function Favorites() {
  useDocumentTitle('הקלסר שלי');
  const [keys, setKeys] = useState<string[]>([]);
  const [active, setActive] = useState<string>('all');

  const [copies, setCopies] = useState<PersonalCopy[]>([]);
  useEffect(() => {
    setCopies(listCopies());
    const onCopies = () => setCopies(listCopies());
    window.addEventListener('personal-copies-changed', onCopies);
    return () => window.removeEventListener('personal-copies-changed', onCopies);
  }, []);

  useEffect(() => {
    setKeys(getFavoriteIds());
    const on = () => setKeys(getFavoriteIds());
    window.addEventListener('favorites-changed', on);
    return () => window.removeEventListener('favorites-changed', on);
  }, []);

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    for (const key of keys) {
      const { kind, id } = parseFavKey(key);
      if (kind === 'activity') {
        const a = activities.find((x) => x.id === id);
        if (a) out.push({ tab: a.categorySlug, key, kind, id, title: a.title, sub: `${a.ageLabel} · ${a.duration} דק׳`, url: `/activity/${a.id}` });
      } else if (kind === 'reading') {
        const r = readings.find((x) => x.id === id);
        if (r) out.push({ tab: 'readings', key, kind, id, title: r.title, sub: r.ageLabel, url: `/reading/${r.id}` });
      } else if (kind === 'staff-study') {
        const s = staffStudy.find((x) => x.id === id);
        if (s) out.push({ tab: 'staff-study', key, kind, id, title: s.title, sub: `${s.topic} · ${s.duration} דק׳`, url: `/staff-study/${s.id}` });
      } else if (kind === 'chupar') {
        const c = chuparim.find((x) => x.id === id);
        if (c) out.push({ tab: 'chuparim', key, kind, id, title: c.title, sub: `${c.kind} · ${c.prepTime}`, url: `/chupar/${c.id}` });
      }
    }
    return out;
  }, [keys]);

  const countBy = (tab: string) => items.filter((i) => i.tab === tab).length;
  const visibleTabs = TABS.filter((t) => countBy(t.id) > 0);
  const shown = active === 'all' ? visibleTabs : visibleTabs.filter((t) => t.id === active);

  const listText = TABS.map((t) => {
    const its = items.filter((i) => i.tab === t.id);
    return its.length ? `${t.label}:\n${its.map((i) => `• ${i.title}`).join('\n')}` : '';
  }).filter(Boolean).join('\n\n');

  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>הקלסר שלי</h1>
            <p style={{ color: 'var(--ink-faint)', fontSize: 14, margin: 0 }}>
              {items.length > 0 ? `${items.length} תכנים שמורים, מסודרים לפי קטגוריות — נשמר רק בדפדפן הזה` : 'כמו קלסר הדרכה: כל מה ששומרים מסודר כאן לפי קטגוריות'}
            </p>
          </div>
          {items.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-flame" onClick={() => void offerHtml('my-binder.html', buildCombinedPrintHtml('הקלסר שלי', 'כל מה ששמרתי, מסודר לפי קטגוריות — לשימוש בהדרכה', entriesForKeys(keys)))}>הדפסת כל הקלסר כקובץ אחד</button>
              <CopyButton text={listText} label="העתקת רשימת הקלסר" copiedLabel="✓ הועתק" />
            </div>
          )}
        </div>
      </Reveal>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <HeartIcon size={40} color="var(--line-strong)" />
          <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', margin: '18px 0' }}>
            לחצו על "שמירה בקלסר שלי" בתוך כל פעולה, קטע קריאה, צ׳ופר או לימוד צוות — והם יאספו כאן.
          </p>
          <Link to="/category/activities" className="btn btn-flame">למאגר הפעולות</Link>
        </div>
      ) : (
        <div>
          <div>
            <div className="binder-tabs" role="tablist" aria-label="מחיצות הקלסר">
              <button role="tab" aria-selected={active === 'all'} className={`binder-tab${active === 'all' ? ' is-active' : ''}`} style={{ ['--tab' as string]: '#241C11' }} onClick={() => setActive('all')}>
                הכל <span>{items.length}</span>
              </button>
              {visibleTabs.map((t) => (
                <button key={t.id} role="tab" aria-selected={active === t.id} className={`binder-tab${active === t.id ? ' is-active' : ''}`} style={{ ['--tab' as string]: t.color }} onClick={() => setActive(t.id)}>
                  {t.label} <span>{countBy(t.id)}</span>
                </button>
              ))}
            </div>

            <div>
              {shown.map((t) => {
                const its = items.filter((i) => i.tab === t.id);
                return (
                  <section key={t.id} style={{ marginBottom: 30 }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 19, fontWeight: 800, marginBottom: 14 }}>
                      <span style={{ width: 12, height: 26, borderRadius: 4, background: t.color }} />
                      {t.label}
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-faint)' }}>({its.length})</span>
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                      {its.map((it) => {
                        if (it.kind === 'activity') {
                          const a = activities.find((x) => x.id === it.id)!;
                          return <ActivityCard key={it.key} activity={a} />;
                        }
                        return (
                          <div key={it.key} className="card" style={{ padding: '16px 18px', background: t.tint, border: `1.5px solid ${t.color}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
                            <Link to={it.url} style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 16, lineHeight: 1.3 }}>{it.title}</Link>
                            <div style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{it.sub}</div>
                            <button type="button" onClick={() => toggleFavorite(it.key)} style={{ alignSelf: 'flex-start', marginTop: 4, border: 'none', background: 'transparent', color: 'var(--ink-faint)', fontSize: 12.5, textDecoration: 'underline', padding: 0 }}>הסרה מהקלסר</button>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <section aria-labelledby="my-copies" style={{ marginTop: 44 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginBottom: 12 }}>
          <h2 id="my-copies" style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>העותקים והתבניות האישיים שלי</h2>
          <Link to="/my/new" className="btn btn-outline">תבנית חדשה לפי שבעת החלקים</Link>
        </div>
        {copies.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--ink-faint)', margin: 0 }}>
            אפשר ליצור עותק אישי של כל פעולה (בלחיצה על "עותק אישי לעריכה והערות" בתוך הפעולה), לערוך אותו ולהדפיס. העותקים נשמרים רק בדפדפן הזה.
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
            {copies.map((c) => (
              <li key={c.id} className="card" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <Link to={`/my/${c.id}`} style={{ fontWeight: 800 }}>{c.title}</Link>
                <span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{c.kind === 'copy' ? 'עותק של פעולה' : 'תבנית אישית'} · עודכן {new Date(c.updatedAt).toLocaleDateString('he-IL')}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
