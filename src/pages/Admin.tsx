import { useEffect, useState, useCallback } from 'react';
import { JsonForm } from '../components/JsonForm';
import { useDocumentTitle } from '../lib/useDocumentTitle';

type Item = Record<string, unknown> & { id: string };

interface ContentTypeInfo {
  key: string;
  label: string;
  titleField: string;
}

function AdminLogin({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'שגיאה בהתחברות');
        return;
      }
      onLoggedIn();
    } catch {
      setError('לא הצלחנו להתחבר לשרת.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="wrap" style={{ maxWidth: 380, paddingTop: 80 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 18 }}>כניסת ניהול</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="סיסמה"
          autoFocus
          style={{ width: '100%', border: '2px solid var(--ink)', borderRadius: 10, padding: '10px 14px', fontSize: 15, marginBottom: 12 }}
        />
        {error && <p style={{ color: 'var(--flame-ink)', fontSize: 13.5, marginBottom: 12 }}>{error}</p>}
        <button type="submit" className="btn btn-flame" disabled={busy} style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'רגע...' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const [types, setTypes] = useState<ContentTypeInfo[]>([]);
  const [activeType, setActiveType] = useState<string>('');
  const [items, setItems] = useState<Item[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    fetch('/api/admin/types')
      .then((r) => r.json())
      .then((data: ContentTypeInfo[]) => {
        setTypes(data);
        if (data[0]) setActiveType(data[0].key);
      });
  }, []);

  const loadItems = useCallback((type: string) => {
    setLoadingItems(true);
    setSelectedId(null);
    setSaveMsg(null);
    fetch(`/api/admin/content/${type}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items))
      .finally(() => setLoadingItems(false));
  }, []);

  useEffect(() => {
    if (activeType) loadItems(activeType);
  }, [activeType, loadItems]);

  const typeInfo = types.find((t) => t.key === activeType);
  const selected = items?.find((it) => it.id === selectedId) ?? null;

  function updateSelected(next: Record<string, unknown>) {
    if (!items || !selectedId) return;
    setItems(items.map((it) => (it.id === selectedId ? (next as Item) : it)));
    setDirty(true);
  }

  function handleNew() {
    if (!items) return;
    const base = selected ?? items[0];
    if (!base) return;
    const clone: Item = JSON.parse(JSON.stringify(base));
    let newId = `${clone.id}-copy`;
    let n = 2;
    while (items.some((it) => it.id === newId)) {
      newId = `${clone.id}-copy-${n++}`;
    }
    clone.id = newId;
    if (typeof clone.title === 'string') clone.title = `${clone.title} (עותק)`;
    if (typeof clone.name === 'string') clone.name = `${clone.name} (עותק)`;
    setItems([clone, ...items]);
    setSelectedId(newId);
    setDirty(true);
  }

  function handleDelete(id: string) {
    if (!items) return;
    if (!window.confirm('למחוק את הפריט הזה? זה ימחק אותו גם באתר האמיתי אחרי שמירה.')) return;
    setItems(items.filter((it) => it.id !== id));
    if (selectedId === id) setSelectedId(null);
    setDirty(true);
  }

  async function handleSave() {
    if (!items) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(`/api/admin/content/${activeType}`, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSaveMsg({ text: data.message || 'השמירה נכשלה.', ok: false });
        return;
      }
      if (data.committed) {
        setSaveMsg({ text: 'נשמר ופורסם ל-GitHub — האתר האמיתי יתעדכן תוך כמה דקות.', ok: true });
        setDirty(false);
      } else if (data.warning) {
        setSaveMsg({ text: data.warning, ok: false });
      } else {
        setSaveMsg({ text: 'נשמר מקומית בלבד — עדיין לא הוגדר חיבור ל-GitHub בשרת (GITHUB_TOKEN), אז זה לא יעלה לאתר האמיתי.', ok: false });
      }
    } catch {
      setSaveMsg({ text: 'שגיאת רשת — נסו שוב.', ok: false });
    } finally {
      setSaving(false);
    }
  }

  const filtered = (items ?? []).filter((it) => {
    if (!search.trim()) return true;
    const title = String((typeInfo && it[typeInfo.titleField]) ?? it.id);
    return title.includes(search) || it.id.includes(search);
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <div style={{ width: 220, borderInlineEnd: '1px solid var(--line)', padding: '20px 14px', flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>ניהול תוכן</div>
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              if (dirty && !window.confirm('יש שינויים שלא נשמרו. לעבור בכל זאת?')) return;
              setActiveType(t.key);
              setDirty(false);
            }}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'right',
              padding: '9px 10px',
              borderRadius: 8,
              marginBottom: 4,
              fontSize: 13.5,
              fontWeight: t.key === activeType ? 700 : 500,
              background: t.key === activeType ? 'var(--flame-tint)' : 'transparent',
              color: t.key === activeType ? 'var(--flame-ink)' : 'var(--ink-soft)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ width: 300, borderInlineEnd: '1px solid var(--line)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: 14, borderBottom: '1px solid var(--line)' }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש..."
            style={{ width: '100%', border: '1px solid var(--line)', borderRadius: 8, padding: '7px 10px', fontSize: 13.5, marginBottom: 8 }}
          />
          <button type="button" className="btn btn-flame" style={{ width: '100%', justifyContent: 'center', fontSize: 13 }} onClick={handleNew} disabled={!items}>
            + פריט חדש
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loadingItems && <div style={{ padding: 16, fontSize: 13, color: 'var(--ink-faint)' }}>טוען...</div>}
          {!loadingItems &&
            filtered.map((it) => (
              <div
                key={it.id}
                onClick={() => setSelectedId(it.id)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid var(--line)',
                  background: it.id === selectedId ? 'var(--bg)' : 'transparent',
                  fontSize: 13,
                }}
              >
                <div style={{ fontWeight: 600 }}>{String((typeInfo && it[typeInfo.titleField]) ?? it.id)}</div>
                <div style={{ color: 'var(--ink-faint)', fontSize: 11 }}>{it.id}</div>
              </div>
            ))}
        </div>
      </div>

      <div style={{ flex: 1, padding: 24, overflowY: 'auto', maxHeight: '100vh' }}>
        {!selected && <p style={{ color: 'var(--ink-faint)' }}>בחרו פריט מהרשימה בצד, או לחצו "פריט חדש".</p>}
        {selected && (
          <div style={{ maxWidth: 720 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, position: 'sticky', top: 0, background: 'var(--paper)', paddingBottom: 12, zIndex: 1 }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 17 }}>{String((typeInfo && selected[typeInfo.titleField]) ?? selected.id)}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{selected.id}</div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-outline" style={{ fontSize: 12.5 }} onClick={() => handleDelete(selected.id)}>
                  מחיקה
                </button>
                <button type="button" className="btn btn-flame" style={{ fontSize: 12.5 }} onClick={handleSave} disabled={saving || !dirty}>
                  {saving ? 'שומר...' : 'שמירה ופרסום'}
                </button>
              </div>
            </div>
            {saveMsg && (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  marginBottom: 16,
                  fontSize: 13,
                  background: saveMsg.ok ? 'var(--lime-tint)' : 'var(--flame-tint)',
                  color: saveMsg.ok ? 'var(--lime-ink)' : 'var(--flame-ink)',
                }}
              >
                {saveMsg.text}
              </div>
            )}
            <JsonForm value={selected as Record<string, unknown>} onChange={updateSelected} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Admin() {
  useDocumentTitle('ניהול תוכן');
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => r.json())
      .then((data) => setLoggedIn(!!data.loggedIn));
  }, []);

  if (loggedIn === null) return null;
  if (!loggedIn) return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  return <AdminDashboard />;
}
