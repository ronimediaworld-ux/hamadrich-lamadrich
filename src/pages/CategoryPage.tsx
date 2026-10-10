import { useMemo, useState } from 'react';
import { ACTIVITY_KINDS, activityKind, fitsGrade, noEquipment, type ActivityKind } from '../lib/activityFilter';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { getCategory, getActivityDomain } from '../data/categories';
import { activitiesByCategory } from '../data/activities';
import { situations } from '../data/situations';
import { methods } from '../data/methods';
import { readings } from '../data/readings';
import { staffStudy } from '../data/staffStudy';
import { quickGames, type QuickGameKind } from '../data/quickGames';
import { ActivityCard } from '../components/ActivityCard';
import { Reveal } from '../components/Reveal';
import { CopyButton } from '../components/CopyButton';
import { iconForName } from '../components/Icons';
import { situationToText, methodToText, staffStudyToText, quickGameToText } from '../lib/contentText';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { PageSearch } from '../components/PageSearch';
import { matchesQuery } from '../lib/textFilter';
import { PARSHIOT_BY_BOOK } from '../lib/parsha';

const colorBg: Record<string, string> = {
  flame: 'var(--flame)',
  lime: 'var(--lime)',
  magenta: 'var(--magenta)',
  sky: 'var(--sky)',
  yellow: 'var(--yellow)',
};

const activityDomains = ['הכל', 'ערכים', 'אמונה', 'פרשת שבוע', 'כללי'];
const readingDomains = ['הכל', 'אמוני', 'ערכי', 'שניהם'];

export function CategoryPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const category = getCategory(slug ?? '');
  useDocumentTitle(category?.label);
  const [ageFilter, setAgeFilter] = useState<string | null>(null);
  const [shabbatOnly, setShabbatOnly] = useState(false);
  const initialDomain = searchParams.get('domain');
  const [domainFilter, setDomainFilter] = useState(initialDomain && activityDomains.includes(initialDomain) ? initialDomain : 'הכל');
  const [readingDomainFilter, setReadingDomainFilter] = useState('הכל');
  const [openMethod, setOpenMethod] = useState<string | null>(null);
  const [quickKind, setQuickKind] = useState<QuickGameKind | 'הכל'>('הכל');
  const [pq, setPq] = useState(searchParams.get('q') ?? '');
  const [parshaFilter, setParshaFilter] = useState<string | null>(null);
  const [gradeFilter, setGradeFilter] = useState(0); // 0 = כל הכיתות
  const [maxMinutes, setMaxMinutes] = useState(0); // 0 = כל משך
  const [placeFilter, setPlaceFilter] = useState<'הכל' | 'פנים' | 'חוץ'>('הכל');
  const [kindFilter, setKindFilter] = useState<ActivityKind | 'הכל'>('הכל');
  const [noEquipOnly, setNoEquipOnly] = useState(false);

  const items = useMemo(() => activitiesByCategory(slug ?? ''), [slug]);

  const filtered = items
    .filter((a) => {
      if (shabbatOnly && a.shabbat === 'חול') return false;
      if (ageFilter === 'young' && a.ageMin > 6) return false;
      if (ageFilter === 'mid' && (a.ageMax < 7 || a.ageMin > 9)) return false;
      if (ageFilter === 'old' && a.ageMax < 9) return false;
      if (slug === 'activities' && domainFilter !== 'הכל' && getActivityDomain(a.tags) !== domainFilter) return false;
      if (slug === 'activities' && domainFilter === 'פרשת שבוע' && parshaFilter && !a.tags.includes(parshaFilter)) return false;
      if (gradeFilter && !fitsGrade(a, gradeFilter)) return false;
      if (maxMinutes && a.duration > maxMinutes) return false;
      if (placeFilter !== 'הכל' && a.place !== placeFilter && a.place !== 'שניהם') return false;
      if (kindFilter !== 'הכל' && activityKind(a) !== kindFilter) return false;
      if (noEquipOnly && !noEquipment(a)) return false;
      if (!matchesQuery([a.title, a.description, a.tags, a.subtopics, a.values], pq)) return false;
      return true;
    })
    .sort((a, b) => (a.series?.title ?? '').localeCompare(b.series?.title ?? '') || (a.series?.part ?? 0) - (b.series?.part ?? 0));

  const filteredReadings = readings.filter((r) => {
    if (readingDomainFilter !== 'הכל' && r.domain !== readingDomainFilter) return false;
    if (!matchesQuery([r.title, r.description, r.tags, r.source], pq)) return false;
    if (ageFilter === 'young' && r.ageMin > 6) return false;
    if (ageFilter === 'mid' && (r.ageMax < 7 || r.ageMin > 9)) return false;
    if (ageFilter === 'old' && r.ageMax < 9) return false;
    return true;
  });

  const filteredMethods = methods.filter((m) => matchesQuery([m.title, m.suitableFor, m.description, m.tags], pq));
  const filteredSituations = situations.filter((x) => matchesQuery([x.title, x.scenario, x.approach], pq));
  const filteredStaff = staffStudy.filter((x) => matchesQuery([x.title, x.topic, x.description], pq));
  const filteredQuick = quickGames.filter((g) => matchesQuery([g.name, g.kind, g.description], pq));

  if (!category) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>הקטגוריה לא נמצאה</h1>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>חזרה לדף הבית</Link>
      </div>
    );
  }

  const Icon = iconForName(category.icon);
  const countLabel =
    slug === 'tools' ? `${situations.length} מדריכי תגובה מהירה`
    : slug === 'methods' ? `${methods.length} מתודות`
    : slug === 'readings' ? `${readings.length} קטעי קריאה`
    : slug === 'staff-study' ? `${staffStudy.length} מפגשי לימוד צוות`
    : `${items.length} פעולות במאגר`;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 70 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
        <Link to="/">בית</Link><span>›</span><span>קטגוריות</span><span>›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{category.label}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 24, borderBottom: '1px solid var(--line)', marginBottom: 24 }}>
        <div style={{ flex: 'none', width: 60, height: 60, borderRadius: 16, background: colorBg[category.color], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={30} color="#FFF6EC" />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>{category.label}</h1>
          <p style={{ fontSize: 14, color: 'var(--ink-faint)' }}>{countLabel} · {category.description}</p>
        </div>
      </div>

      <PageSearch value={pq} onChange={setPq} placeholder={`חיפוש ב${category.label}...`} />

      {slug === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filteredSituations.map((s) => (
            <Reveal key={s.id}>
              <div className="card" style={{ padding: 26 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                  <h3 style={{ fontSize: 19, fontWeight: 800 }}>{s.title}</h3>
                  <CopyButton variant="mini" text={situationToText(s)} />
                </div>
                <p style={{ fontSize: 14.5, color: 'var(--ink-soft)', marginBottom: 14 }}>{s.scenario}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--lime-ink)', marginBottom: 6 }}>מה כדאי לעשות</div>
                    <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13.5, color: 'var(--ink-soft)' }}>
                      {s.approach.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--magenta-ink)', marginBottom: 6 }}>מה כדאי להימנע ממנו</div>
                    <ul style={{ margin: 0, paddingInlineStart: 18, fontSize: 13.5, color: 'var(--ink-soft)' }}>
                      {s.avoid.map((a, i) => <li key={i} style={{ marginBottom: 4 }}>{a}</li>)}
                    </ul>
                  </div>
                </div>
                <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 10, background: 'var(--flame-tint)', fontSize: 13.5, color: 'var(--flame-ink)' }}>
                  <b>טיפ: </b>{s.tip}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {slug === 'methods' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {filteredMethods.map((m) => {
            const open = openMethod === m.id;
            return (
              <Reveal key={m.id}>
                <div className="card" style={{ padding: 22, cursor: 'pointer' }} onClick={() => setOpenMethod(open ? null : m.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800 }}>{m.title}</h3>
                    <CopyButton variant="mini" text={methodToText(m)} />
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: open ? 12 : 0 }}>{m.suitableFor}</p>
                  {open && (
                    <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.7 }}>
                      <p style={{ margin: '0 0 10px' }}>{m.description}</p>
                      <div style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--yellow-tint)', fontSize: 13.5 }}>
                        <b>איך משתמשים: </b>{m.howToUse}
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
            );
          })}
        </div>
      )}

      {slug === 'readings' && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
            {readingDomains.map((d) => (
              <button key={d} className={`chip${readingDomainFilter === d ? ' is-active' : ''}`} onClick={() => setReadingDomainFilter(d)}>{d}</button>
            ))}
            <span style={{ width: 1, background: 'var(--line)', margin: '0 4px' }} />
            <button className={`chip${ageFilter === null ? ' is-active' : ''}`} onClick={() => setAgeFilter(null)}>כל הגילאים</button>
            <button className={`chip${ageFilter === 'young' ? ' is-active' : ''}`} onClick={() => setAgeFilter('young')}>גיל צעיר (א'-ו')</button>
            <button className={`chip${ageFilter === 'mid' ? ' is-active' : ''}`} onClick={() => setAgeFilter('mid')}>גיל חטיבה (ז'-ט')</button>
            <button className={`chip${ageFilter === 'old' ? ' is-active' : ''}`} onClick={() => setAgeFilter('old')}>גיל תיכון (י'-י"ב)</button>
          </div>

          {filteredReadings.length === 0 ? (
            <p style={{ color: 'var(--ink-faint)' }}>אין כרגע קטעים שמתאימים לסינון הזה — נסו להסיר פילטר אחד.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
              {filteredReadings.map((r) => (
                <Reveal key={r.id}>
                  <Link to={`/reading/${r.id}`} className="card" style={{ display: 'block', padding: 20 }}>
                    <span style={{ display: 'inline-block', padding: '4px 11px', borderRadius: 999, background: r.domain === 'אמוני' ? 'var(--sky-tint)' : r.domain === 'ערכי' ? 'var(--lime-tint)' : 'var(--magenta-tint)', color: r.domain === 'אמוני' ? 'var(--sky-ink)' : r.domain === 'ערכי' ? 'var(--lime-ink)' : 'var(--magenta-ink)', fontSize: 11.5, fontWeight: 700, marginBottom: 10 }}>
                      {r.domain === 'שניהם' ? 'אמוני וערכי' : r.domain}
                    </span>
                    <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 8 }}>{r.title}</h3>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 10 }}>{r.description}</p>
                    <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{r.ageLabel}</div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}

      {slug === 'staff-study' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18 }}>
          {[...filteredStaff]
            .sort((a, b) => (a.series?.title ?? '').localeCompare(b.series?.title ?? '') || (a.series?.part ?? 0) - (b.series?.part ?? 0))
            .map((s) => (
            <Reveal key={s.id}>
              <div className="card" style={{ padding: 22, display: 'block' }}>
              <Link to={`/staff-study/${s.id}`} style={{ display: 'block' }}>
                <span style={{ display: 'inline-block', padding: '4px 11px', borderRadius: 999, background: 'var(--magenta-tint)', color: 'var(--magenta-ink)', fontSize: 11.5, fontWeight: 700, marginBottom: 10 }}>
                  {s.topic}
                </span>
                {s.series && (
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--magenta-ink)', marginBottom: 6 }}>
                    מערך: {s.series.title} · מפגש {s.series.part}{s.series.total ? `/${s.series.total}` : ''}
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800 }}>{s.title}</h3>
                  <CopyButton variant="mini" text={staffStudyToText(s)} />
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 12 }}>{s.description}</p>
                <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 4 }}>{s.duration} דק׳ · {s.forWhom}</div>
              </Link>
                {s.sourceLink && (
                  <a
                    href={s.sourceLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: 8, fontSize: 12, color: 'var(--flame-ink)', fontWeight: 700 }}
                  >
                    מקור: {s.sourceLink.title} ↗
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {slug === 'games' && (
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>משחקים מהירים</h2>
            <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{quickGames.length} משחקי חצר ומעגל לשליפה מהירה</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {(['הכל', 'ריצה', 'תופסת', 'מעגל', 'כוח', 'כדור', 'שטח', 'חשיבה', 'הצגה', 'קבוצתי', 'רגיעה', 'יצירה', 'ראווה'] as const).map((k) => (
              <button key={k} className={`chip${quickKind === k ? ' is-active' : ''}`} onClick={() => setQuickKind(k)}>{k}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filteredQuick
              .filter((g) => quickKind === 'הכל' || g.kind === quickKind)
              .map((g) => (
                <Reveal key={g.id}>
                  <div className="card" style={{ padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 800 }}>{g.name}</h3>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: 'var(--flame-ink)' }}>{g.kind}</span>
                      <CopyButton variant="mini" text={quickGameToText(g)} style={{ marginInlineStart: 'auto' }} />
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginBottom: 8 }}>{g.players} · {g.needs}</div>
                    <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0 }}>{g.description}</p>
                  </div>
                </Reveal>
              ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '32px 0 4px' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>משחקים מובנים</h2>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
        </div>
      )}

      {(slug === 'activities' || slug === 'games' || slug === 'social-nights') && (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 26 }}>
            {slug === 'activities' && activityDomains.map((d) => (
              <button key={d} className={`chip${domainFilter === d ? ' is-active' : ''}`} onClick={() => { setDomainFilter(d); setParshaFilter(null); }}>{d}</button>
            ))}
            <span style={{ width: 1, background: 'var(--line)', margin: '0 4px' }} />
            <button className={`chip${ageFilter === null ? ' is-active' : ''}`} onClick={() => setAgeFilter(null)}>כל הגילאים</button>
            <button className={`chip${ageFilter === 'young' ? ' is-active' : ''}`} onClick={() => setAgeFilter('young')}>גיל צעיר (א'-ו')</button>
            <button className={`chip${ageFilter === 'mid' ? ' is-active' : ''}`} onClick={() => setAgeFilter('mid')}>גיל חטיבה (ז'-ט')</button>
            <button className={`chip${ageFilter === 'old' ? ' is-active' : ''}`} onClick={() => setAgeFilter('old')}>גיל תיכון (י'-י"ב)</button>
            <button className={`chip${shabbatOnly ? ' is-active' : ''}`} onClick={() => setShabbatOnly((v) => !v)}>מתאים לשבת</button>
          </div>

          <details style={{ marginBottom: 22 }} open={!!(gradeFilter || maxMinutes || placeFilter !== 'הכל' || kindFilter !== 'הכל' || noEquipOnly)}>
            <summary style={{ cursor: 'pointer', fontWeight: 800, fontSize: 14, marginBottom: 10 }}>סינון מתקדם: כיתה, משך, סוג, מקום וציוד</summary>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, alignItems: 'end', padding: '12px 0' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700 }}>כיתה
                <select value={gradeFilter} onChange={(e) => setGradeFilter(Number(e.target.value))} style={{ padding: '8px 10px', borderRadius: 10, border: '2px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif' }}>
                  <option value={0}>כל הכיתות</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>{['', 'א׳', 'ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ז׳', 'ח׳', 'ט׳', 'י׳', 'י״א', 'י״ב'][g]}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700 }}>משך
                <select value={maxMinutes} onChange={(e) => setMaxMinutes(Number(e.target.value))} style={{ padding: '8px 10px', borderRadius: 10, border: '2px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif' }}>
                  <option value={0}>כל משך</option>
                  <option value={20}>עד 20 דקות</option>
                  <option value={30}>עד 30 דקות</option>
                  <option value={45}>עד 45 דקות</option>
                  <option value={60}>עד 60 דקות</option>
                  <option value={90}>עד 90 דקות</option>
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700 }}>סוג פעילות
                <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as ActivityKind | 'הכל')} style={{ padding: '8px 10px', borderRadius: 10, border: '2px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif' }}>
                  <option value="הכל">הכל</option>
                  {ACTIVITY_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </label>
              <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, fontWeight: 700 }}>פנים או חוץ
                <select value={placeFilter} onChange={(e) => setPlaceFilter(e.target.value as 'הכל' | 'פנים' | 'חוץ')} style={{ padding: '8px 10px', borderRadius: 10, border: '2px solid var(--ink)', background: 'var(--paper)', fontFamily: 'Heebo, sans-serif' }}>
                  <option value="הכל">לא משנה</option>
                  <option value="פנים">בפנים</option>
                  <option value="חוץ">בחוץ</option>
                </select>
              </label>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13.5, fontWeight: 700 }}>
                <input type="checkbox" checked={noEquipOnly} onChange={(e) => setNoEquipOnly(e.target.checked)} style={{ width: 18, height: 18 }} />
                בלי ציוד
              </label>
              <button type="button" className="chip" onClick={() => { setGradeFilter(0); setMaxMinutes(0); setKindFilter('הכל'); setPlaceFilter('הכל'); setNoEquipOnly(false); }}>ניקוי הסינון</button>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', margin: 0 }}>
              "בלי ציוד" לפי המידע שרשום בפעולה: פעולה שלא צוין לה ציוד, או שצוין לה רק דף ועט, נחשבת בלי ציוד. אפשר גם <Link to="/now" style={{ textDecoration: 'underline' }}>לקבל הצעות לפי כיתה וזמן</Link>.
            </p>
          </details>

          <p style={{ fontSize: 13.5, color: 'var(--ink-faint)', margin: '0 0 14px' }} aria-live="polite">{filtered.length} פעולות מתאימות לסינון</p>

          {slug === 'activities' && domainFilter === 'פרשת שבוע' && (
            <div className="card" style={{ padding: '18px 20px', marginBottom: 24, background: 'var(--magenta-tint)', border: '1px solid var(--magenta)' }}>
              <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12 }}>פעולות לכל פרשה — בחרו פרשה:</div>
              {PARSHIOT_BY_BOOK.map((b) => (
                <div key={b.book} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--magenta-ink)', width: 56 }}>{b.book}</span>
                  {b.names.map((n) => {
                    const count = items.filter((a) => a.tags.includes(n)).length;
                    return (
                      <button key={n} type="button" className={`chip${parshaFilter === n ? ' is-active' : ''}`} style={{ padding: '5px 11px', fontSize: 12.5, opacity: count ? 1 : 0.45 }} onClick={() => setParshaFilter(parshaFilter === n ? null : n)}>
                        {n}{count > 0 && <span style={{ fontWeight: 600, opacity: 0.7 }}>{count}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
              {parshaFilter && <button type="button" className="chip" style={{ marginTop: 6 }} onClick={() => setParshaFilter(null)}>הצגת כל הפרשיות</button>}
            </div>
          )}

          {filtered.length === 0 ? (
            <p style={{ color: 'var(--ink-faint)' }}>אין כרגע פעולות שמתאימות לסינון הזה — נסו להסיר פילטר אחד.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
              {filtered.map((a) => (
                <ActivityCard key={a.id} activity={a} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
