import { SearchIcon, CloseIcon } from './Icons';

// שורת חיפוש בתוך עמוד — מסננת רק את התוכן שבעמוד הזה. החיפוש הראשי (למעלה ובדף הבית) מחפש בכל האתר.
export function PageSearch({ value, onChange, placeholder = 'חיפוש בעמוד הזה...' }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="no-print page-search" style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--paper)', border: '2px solid var(--ink)', borderRadius: 999, padding: '7px 14px', maxWidth: 440, marginBottom: 20 }}>
      <SearchIcon size={16} color="var(--ink-soft)" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        style={{ flex: 1, minWidth: 0, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'Heebo, sans-serif', fontSize: 14.5 }}
      />
      {value && (
        <button type="button" onClick={() => onChange('')} aria-label="ניקוי החיפוש" style={{ border: 'none', background: 'transparent', display: 'flex', padding: 2 }}>
          <CloseIcon size={16} color="var(--ink-faint)" />
        </button>
      )}
    </div>
  );
}
