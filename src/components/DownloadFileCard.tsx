import { downloadFiles } from '../data/files';
import { FavoriteButton } from './FavoriteButton';

// כרטיס קובץ PDF להורדה, עם שמירה בקלסר.
export function DownloadFileCard({ id }: { id: string }) {
  const f = downloadFiles.find((x) => x.id === id);
  if (!f) return null;
  return (
    <div className="card" style={{ padding: '18px 20px', marginBottom: 26, display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', background: 'var(--flame-tint)', border: '1.5px solid var(--flame)' }}>
      <div style={{ flex: '1 1 320px' }}>
        <div style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 19, marginBottom: 4 }}>{f.title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--ink-soft)', lineHeight: 1.6 }}>{f.description}</div>
        <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4 }}>{f.sub}</div>
      </div>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <a className="btn btn-flame" href={f.url} download>הורדת ה־PDF</a>
        <FavoriteButton kind="file" id={f.id} label="שמירה בקלסר שלי" />
      </div>
    </div>
  );
}
