// עורך גנרי לאובייקט JSON — בונה טופס אוטומטית לפי הצורה של הערך: מחרוזת, מספר, בוליאני,
// מערך מחרוזות, מערך אובייקטים, או אובייקט מקונן. משמש לעריכת כל סוגי התוכן באתר בדשבורד,
// בלי שצריך לכתוב טופס ייעודי לכל טיפוס.

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue | undefined };

function isLongText(key: string, value: string): boolean {
  return value.length > 50 || value.includes('\n') || /body|content|text|description|method|opening|guideNotes|summary|scenario|tip|takeaway/i.test(key);
}

const fieldStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid var(--line)',
  borderRadius: 8,
  padding: '8px 10px',
  fontSize: 13.5,
  fontFamily: 'Heebo, sans-serif',
  background: 'var(--paper)',
};

const labelStyle: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: 'var(--ink-faint)', marginBottom: 4, display: 'block' };

function IconBtn({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      style={{ border: '1px solid var(--line)', background: 'var(--bg)', borderRadius: 6, width: 26, height: 26, cursor: 'pointer', fontSize: 13, lineHeight: 1, flexShrink: 0 }}
    >
      {children}
    </button>
  );
}

function StringArrayField({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {value.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 6 }}>
            <textarea
              value={item}
              onChange={(e) => {
                const next = [...value];
                next[i] = e.target.value;
                onChange(next);
              }}
              rows={item.length > 60 ? 2 : 1}
              style={{ ...fieldStyle, flex: 1, resize: 'vertical' }}
            />
            <IconBtn title="הסרה" onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</IconBtn>
          </div>
        ))}
        <button type="button" className="btn btn-outline" style={{ fontSize: 12.5, padding: '6px 10px', alignSelf: 'flex-start' }} onClick={() => onChange([...value, ''])}>
          + הוספה
        </button>
      </div>
    </div>
  );
}

function ObjectArrayField({ label, value, onChange }: { label: string; value: Record<string, JsonValue>[]; onChange: (v: Record<string, JsonValue>[]) => void }) {
  const template = value[0] ? Object.fromEntries(Object.keys(value[0]).map((k) => [k, typeof value[0][k] === 'string' ? '' : value[0][k]])) : { label: '', body: '' };
  return (
    <div style={{ marginBottom: 14 }}>
      <span style={labelStyle}>{label}</span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {value.map((item, i) => (
          <div key={i} className="card" style={{ padding: 12, position: 'relative', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-faint)' }}>#{i + 1}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {i > 0 && (
                  <IconBtn title="הזזה למעלה" onClick={() => {
                    const next = [...value];
                    [next[i - 1], next[i]] = [next[i], next[i - 1]];
                    onChange(next);
                  }}>↑</IconBtn>
                )}
                {i < value.length - 1 && (
                  <IconBtn title="הזזה למטה" onClick={() => {
                    const next = [...value];
                    [next[i + 1], next[i]] = [next[i], next[i + 1]];
                    onChange(next);
                  }}>↓</IconBtn>
                )}
                <IconBtn title="הסרה" onClick={() => onChange(value.filter((_, j) => j !== i))}>✕</IconBtn>
              </div>
            </div>
            <JsonForm
              value={item}
              onChange={(next) => {
                const arr = [...value];
                arr[i] = next as Record<string, JsonValue>;
                onChange(arr);
              }}
            />
          </div>
        ))}
        <button type="button" className="btn btn-outline" style={{ fontSize: 12.5, padding: '6px 10px', alignSelf: 'flex-start' }} onClick={() => onChange([...value, template as Record<string, JsonValue>])}>
          + הוספת פריט
        </button>
      </div>
    </div>
  );
}

interface JsonFormProps {
  value: Record<string, unknown>;
  onChange: (v: Record<string, unknown>) => void;
  hiddenKeys?: string[];
}

export function JsonForm({ value, onChange, hiddenKeys = ['id'] }: JsonFormProps) {
  function setField(key: string, fieldValue: JsonValue) {
    onChange({ ...value, [key]: fieldValue });
  }

  return (
    <div>
      {Object.entries(value as Record<string, JsonValue>)
        .filter(([k]) => !hiddenKeys.includes(k))
        .map(([key, fieldValue]) => {
          if (fieldValue === undefined) return null;

          if (fieldValue === null) {
            return null;
          }

          if (typeof fieldValue === 'boolean') {
            return (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13.5 }}>
                <input type="checkbox" checked={fieldValue} onChange={(e) => setField(key, e.target.checked)} />
                {key}
              </label>
            );
          }

          if (typeof fieldValue === 'number') {
            return (
              <div key={key} style={{ marginBottom: 14 }}>
                <span style={labelStyle}>{key}</span>
                <input type="number" value={fieldValue} onChange={(e) => setField(key, Number(e.target.value))} style={fieldStyle} />
              </div>
            );
          }

          if (typeof fieldValue === 'string') {
            const long = isLongText(key, fieldValue);
            return (
              <div key={key} style={{ marginBottom: 14 }}>
                <span style={labelStyle}>{key}</span>
                {long ? (
                  <textarea value={fieldValue} onChange={(e) => setField(key, e.target.value)} rows={Math.min(10, Math.max(2, Math.ceil(fieldValue.length / 55)))} style={{ ...fieldStyle, resize: 'vertical' }} />
                ) : (
                  <input value={fieldValue} onChange={(e) => setField(key, e.target.value)} style={fieldStyle} />
                )}
              </div>
            );
          }

          if (Array.isArray(fieldValue)) {
            if (fieldValue.length === 0 || typeof fieldValue[0] === 'string') {
              return <StringArrayField key={key} label={key} value={fieldValue as string[]} onChange={(v) => setField(key, v)} />;
            }
            return <ObjectArrayField key={key} label={key} value={fieldValue as Record<string, JsonValue>[]} onChange={(v) => setField(key, v)} />;
          }

          if (typeof fieldValue === 'object') {
            return (
              <div key={key} className="card" style={{ padding: 12, marginBottom: 14, background: 'var(--bg)' }}>
                <span style={labelStyle}>{key}</span>
                <JsonForm value={fieldValue as Record<string, JsonValue>} onChange={(v) => setField(key, v as JsonValue)} hiddenKeys={[]} />
              </div>
            );
          }

          return null;
        })}
    </div>
  );
}
