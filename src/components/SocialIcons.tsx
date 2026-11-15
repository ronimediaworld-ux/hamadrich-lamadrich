import { SOCIAL } from '../data/social';

// אייקוני רשתות חברתיות: יוטיוב, אינסטגרם וקבוצת וואטסאפ. קישור ריק ב-SOCIAL לא מוצג.
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" {...stroke} />
      <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <rect x="3" y="3" width="18" height="18" rx="5.2" {...stroke} />
      <circle cx="12" cy="12" r="4.1" {...stroke} />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z" {...stroke} />
      <path d="M9 8.3c-.3.8-.2 1.9.9 3.4 1.2 1.6 2.6 2.5 3.9 2.8.8.2 1.6-.4 1.9-1l-1.7-1.1-.9.7c-.9-.4-1.7-1.2-2.1-2l.7-.9-1-1.8c-.4-.3-1.3-.3-1.7-.1z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function SocialIcons({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const items = [
    { key: 'youtube', url: SOCIAL.youtube, label: 'ערוץ היוטיוב', icon: <YouTubeIcon />, cls: 'yt' },
    { key: 'instagram', url: SOCIAL.instagram, label: 'אינסטגרם', icon: <InstagramIcon />, cls: 'ig' },
    { key: 'whatsapp', url: SOCIAL.whatsapp, label: 'קבוצת הוואטסאפ', icon: <WhatsAppIcon />, cls: 'wa' },
  ].filter((i) => i.url);
  return (
    <div className={`social-icons ${size}`}>
      {items.map((i) => (
        <a key={i.key} className={`social-ic ${i.cls}`} href={i.url} target="_blank" rel="noopener noreferrer" aria-label={i.label} title={i.label}>
          {i.icon}
        </a>
      ))}
    </div>
  );
}
