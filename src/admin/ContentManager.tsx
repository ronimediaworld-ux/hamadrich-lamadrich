import { useCallback, useEffect, useState } from 'react';
import { JsonForm } from '../components/JsonForm';
import { CATEGORY_LABELS } from './labels';

type Item = Record<string, unknown> & { id: string };
interface TypeInfo { key: string; label: string; titleField: string }

const ROUTES: Record<string, string> = { activities: 'activity', chuparim: 'chupar', readings: 'reading', staffStudy: 'staff-study' };
const GRADES = ['', "א'", "ב'", "ג'", "ד'", "ה'", "ו'", "ז'", "ח'", "ט'", "י'", 'י"א', 'י"ב'];

// פריט חדש: אותה צורה של פריט קיים, בשדות ריקים
function emptyLike(v: unknown): unknown {
  if (typeof v === 'string') return '';
  if (typeof v === 'number') return 0;
  if (typeof v === 'boolean') return false;
  if (Array.isArray(v)) return v.length && typeof v[0] === 'object' ? [emptyLike(v[0])] : [];
  if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, emptyLike(x)]));
  return v;
}

function subtitle(it: Item): string {
  const bits: string[] = [];
  if (typeof it.ageLabel === 'string' && it.ageLabel) bits.push(it.ageLabel);
  if (typeof it.categorySlug === 'string') bits.push(CATEGORY_LABELS[it.categorySlug] ?? it.categorySlug);
  if (typeof it.topic === 'string') bits.push(it.topic);
  if (typeof it.kind === 'string') bits.push(it.kind);
  if (typeof it.duration === 'number' && it.duration) bits.push(`${it.duration} דק׳`);
  return bits.join(' · ');
}

// טווח הגילאים נבנה אוטומטית מהמספרים, כדי שלא יהיו אי־התאמות
function normalize(type: string, items: Item[]): Item[] {
  if (type !== 'activities' && type !== 'readings') return items;
  return items.map((it) => {
    const lo = Number(it.ageMin), hi = Number(it.ageMax);
    if (!lo || !hi || lo > hi || hi > 12) return it;
    const label = lo === hi ? `כיתה ${GRADES[lo]}` : `כיתה ${GRADES[lo]}-${GRADES[hi]}`;
    return typeof it.ageLabel === 'string' && it.ageLabel.startsWith('כיתה') || !it.ageLabel ? { ...it, ageLabel: label } : it;
  });
}

export function ContentManager() {
  const [types, setTypes] = useState<TypeInfo[]>([]);
  const [type, setType] = useState('');
  const [items, setItems] = useState<Item[] | null>(null);
  const [orig, setOrig] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('all');
  const [dirty, setDirty] = useState(false);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/admin/types').then((r) => r.json()).then((d: TypeInfo[]) => { setTypes(d); if (d[0]) setType(d[0].key); });
  }, []);

  const load = useCallback((t: string) => {
    setItems(null); setSelectedId(null); setMsg(null); setNewIds(new Set()); setSearch(''); setCat('all');
    fetch(`/api/admin/content/${t}`).then((r) => r.json()).then((d: { items: Item[] }) => { setItems(d.items); setOrig(Object.fromEntries(d.items.map((it) => [it.id, JSON.stringify(it)]))); });
  }, []);
  useEffect(() => { if (type) load(type); }, [type, load]);

  const info = types.find((t) => t.key === type);
  const titleOf = (it: Item) => String((info && it[info.titleField]) ?? it.id);
  const selected = items?.find((it) => it.id === selectedId) ?? null;

  function pickType(t: string) {
    if (dirty && !window.confirm('יש שינויים שלא נשמרו. לעבור בכל זאת?')) return;
    setDirty(false); setType(t);
  }
  function update(next: Record<string, unknown>) {
    if (!items || !selectedId) return;
    setItems(items.map((it) => (it.id === selectedId ? ({ ...(next as Item), id: it.id }) : it)));
    setDirty(true);
  }
  function addNew() {
    if (!items || !items[0]) return;
    const blank = emptyLike(items[0]) as Item;
    const id = `new-${Date.now().toString(36)}`;
    blank.id = id;
    if (type === 'activities') Object.assign(blank, { categorySlug: 'activities', rating: 4.5, character: 'A', shabbat: 'שניהם', place: 'פנים', energy: 'בינונית', depth: 'בינוני' });
    setItems([blank, ...items]); setSelectedId(id); setNewIds(new Set(newIds).add(id)); setDirty(true); setMsg(null);
  }
  function rename(oldId: string, raw: string) {
    const id = raw.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+/, '');
    if (!items || !id) return;
    if (items.some((it) => it.id === id && it.id !== oldId)) { setMsg({ text: 'כבר יש פריט עם הכתובת הזו.', ok: false }); return; }
    setItems(items.map((it) => (it.id === oldId ? { ...it, id } : it)));
    const next = new Set(newIds); next.delete(oldId); next.add(id); setNewIds(next); setSelectedId(id); setMsg(null);
  }
  function remove(id: string) {
    if (!items || !window.confirm('למחוק את הפריט? הוא יימחק גם מהאתר אחרי שמירה.')) return;
    setItems(items.filter((it) => it.id !== id)); setSelectedId(null); setDirty(true);
  }
  async function save() {
    if (!items) return;
    const bad = items.find((it) => newIds.has(it.id) && /^new-/.test(it.id));
    if (bad) { setMsg({ text: 'לפני שמירה צריך לתת לפריט החדש כתובת באנגלית (למעלה, ליד "כתובת בעמוד").', ok: false }); return; }
    setSaving(true); setMsg(null);
    try {
      // שולחים רק מה ששונה; השרת ממזג אל הגרסה העדכנית, כך שעריכה לא דורסת תוכן שנוסף בינתיים
      const current = normalize(type, items);
      const upserts = current.filter((it) => orig[it.id] !== JSON.stringify(it));
      const present = new Set(current.map((it) => it.id));
      const deletes = Object.keys(orig).filter((id) => !present.has(id));
      const res = await fetch(`/api/admin/content/${type}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ upserts, deletes }) });
      const d = await res.json();
      if (!res.ok) { setMsg({ text: d.message || 'השמירה נכשלה.', ok: false }); return; }
      const fresh = await fetch(`/api/admin/content/${type}`).then((r) => r.json()).catch(() => null) as { items: Item[] } | null;
      if (fresh) { setItems(fresh.items); setOrig(Object.fromEntries(fresh.items.map((it) => [it.id, JSON.stringify(it)]))); }
      setDirty(false); setNewIds(new Set());
      if (d.committed) {
        setMsg({ text: d.deployScheduled ? 'נשמר ופורסם. האתר יתעדכן לבד בעוד כשתי דקות.' : 'נשמר ופורסם ל-GitHub. כדי שהאתר יתעדכן צריך פריסה ב-Render (או להגדיר חיבור אוטומטי בהגדרות).', ok: true });
      } else {
        setMsg({ text: d.warning || 'נשמר רק מקומית. כדי שיעלה לאתר צריך לחבר את GitHub (ראי "הגדרות וחיבורים").', ok: false });
      }
    } catch {
      setMsg({ text: 'שגיאת רשת. נסי שוב.', ok: false });
    } finally { setSaving(false); }
  }

  const cats = type === 'activities' ? [...new Set((items ?? []).map((it) => String(it.categorySlug ?? '')).filter(Boolean))] : [];
  const shown = (items ?? []).filter((it) => {
    if (cat !== 'all' && it.categorySlug !== cat) return false;
    const q = search.trim();
    return !q || titleOf(it).includes(q) || it.id.includes(q);
  });
  const canView = ROUTES[type] && selected && !newIds.has(selected.id);

  return (
    <div className="adm-stack">
      <div className="adm-head"><h1>עריכת תוכן</h1></div>
      <div className="adm-chips">
        {types.map((t) => <button key={t.key} type="button" className={`chip${t.key === type ? ' is-active' : ''}`} onClick={() => pickType(t.key)}>{t.label}</button>)}
      </div>
      <div className="adm-editor">
        <aside className="adm-list">
          <div className="adm-list-top">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש לפי שם..." />
            {cats.length > 1 && (
              <select value={cat} onChange={(e) => setCat(e.target.value)}>
                <option value="all">כל הקטגוריות</option>
                {cats.map((c) => <option key={c} value={c}>{CATEGORY_LABELS[c] ?? c}</option>)}
              </select>
            )}
            <button type="button" className="btn btn-flame" onClick={addNew} disabled={!items}>+ חדש</button>
          </div>
          <div className="adm-list-body">
            {!items && <p className="adm-muted" style={{ padding: 14 }}>טוען...</p>}
            {items && <p className="adm-muted" style={{ padding: '8px 14px 0', fontSize: 12 }}>{shown.length} מתוך {items.length}</p>}
            {shown.map((it) => (
              <button type="button" key={it.id} className={`adm-row${it.id === selectedId ? ' is-active' : ''}`} onClick={() => setSelectedId(it.id)}>
                <b>{titleOf(it) || 'ללא שם'}{newIds.has(it.id) && <span className="adm-tag"> חדש</span>}</b>
                <small>{subtitle(it)}</small>
              </button>
            ))}
          </div>
        </aside>
        <section className="adm-form">
          {!selected && <p className="adm-muted">בחרי פריט מהרשימה כדי לערוך, או לחצי "חדש".</p>}
          {selected && (
            <>
              <div className="adm-form-bar">
                <div>
                  <b>{titleOf(selected) || 'פריט חדש'}</b>
                  {canView && <a href={`/${ROUTES[type]}/${selected.id}`} target="_blank" rel="noopener noreferrer">צפייה בעמוד באתר ←</a>}
                </div>
                <div className="adm-form-actions">
                  <button type="button" className="btn btn-outline" onClick={() => remove(selected.id)}>מחיקה</button>
                  <button type="button" className="btn btn-flame" onClick={save} disabled={saving || !dirty}>{saving ? 'שומר...' : 'שמירה ופרסום'}</button>
                </div>
              </div>
              {dirty && <p className="adm-note">יש שינויים שלא נשמרו.</p>}
              {msg && <p className={`adm-msg${msg.ok ? ' is-ok' : ''}`}>{msg.text}</p>}
              {newIds.has(selected.id) && (
                <label className="adm-idfield">כתובת בעמוד (באנגלית, בלי רווחים)
                  <input dir="ltr" defaultValue={/^new-/.test(selected.id) ? '' : selected.id} placeholder="my-new-activity" onBlur={(e) => e.target.value && rename(selected.id, e.target.value)} />
                </label>
              )}
              <JsonForm value={selected as Record<string, unknown>} onChange={update} />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
