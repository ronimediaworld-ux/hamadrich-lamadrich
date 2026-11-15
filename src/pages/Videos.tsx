import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Reveal } from '../components/Reveal';
import { ShareButton } from '../components/ShareButton';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { CHANNEL_URL, embedUrl, thumbUrl, videoUrl, videos, type VideoItem } from '../data/videos';

const SERIES_COLORS = ['#2F7A4B', '#B34E14', '#2F5F95', '#6B4A9B', '#A63D6B', '#7A5B00'];

function VideoCard({ v, color }: { v: VideoItem; color: string }) {
  const [playing, setPlaying] = useState(v.platform === 'instagram');
  const thumb = thumbUrl(v);
  return (
    <article className="card vid-card" style={{ padding: 0, overflow: 'hidden', borderTop: `5px solid ${color}` }}>
      <div className="vid-frame">
        {playing ? (
          <iframe
            src={embedUrl(v, v.platform === 'youtube')}
            title={`${v.episode ? v.episode + ': ' : ''}${v.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button type="button" className="vid-poster" onClick={() => setPlaying(true)} aria-label={`הפעלת הסרטון: ${v.title}`}>
            {thumb && <img src={thumb} alt="" loading="lazy" />}
            <span className="vid-play" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <div style={{ padding: '16px 18px 18px' }}>
        {v.episode && <div style={{ fontSize: 12.5, fontWeight: 800, color, marginBottom: 4 }}>{v.episode}</div>}
        <h2 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 700, fontSize: 17, lineHeight: 1.3, marginBottom: 12 }}>{v.title}</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <a className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }} href={videoUrl(v)} target="_blank" rel="noopener noreferrer">
            {v.platform === 'youtube' ? 'לצפייה ביוטיוב ↗' : 'לצפייה באינסטגרם ↗'}
          </a>
          {v.related && <Link className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }} to={v.related.to}>{v.related.label}</Link>}
        </div>
      </div>
    </article>
  );
}

export function Videos() {
  useDocumentTitle('סרטונים');
  return (
    <div className="wrap" style={{ paddingTop: 30, paddingBottom: 70 }}>
      <Reveal>
        <h1 style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>סרטונים</h1>
        <p style={{ color: 'var(--ink-soft)', fontSize: 15.5, maxWidth: 640, marginBottom: 20 }}>
          סדרת הרשת של "המדריך למדריך": פרקים קצרים על ההדרכה בפועל. אפשר לצפות כאן, או להמשיך לערוץ ולעקוב אחרי פרקים חדשים.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
          <a className="btn btn-flame" href={CHANNEL_URL} target="_blank" rel="noopener noreferrer">לערוץ ביוטיוב ↗</a>
          <ShareButton title="סדרת הסרטונים של המדריך למדריך" />
        </div>
      </Reveal>
      <div className="vid-grid">
        {videos.map((v, i) => (
          <Reveal key={v.id} delay={(i % 4) * 50}>
            <VideoCard v={v} color={SERIES_COLORS[i % SERIES_COLORS.length]} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
