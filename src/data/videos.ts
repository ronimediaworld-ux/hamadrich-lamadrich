// סרטוני הסדרה של "המדריך למדריך". כדי להוסיף סרטון: מוסיפים שורה כאן עם הקוד של הסרטון.
// ביוטיוב: הקוד הוא החלק שאחרי /shorts/ או v= בקישור. באינסטגרם: הקוד שאחרי /reel/ או /p/.
export interface VideoItem {
  id: string;
  platform: 'youtube' | 'instagram';
  code: string;
  title: string;
  episode?: string; // למשל "פרק 1"
  related?: { label: string; to: string }; // קישור למדריך הכתוב באתר
}

export const CHANNEL_URL = 'https://www.youtube.com/@%D7%94%D7%9E%D7%93%D7%A8%D7%99%D7%9A%D7%9C%D7%9E%D7%93%D7%A8%D7%99%D7%9A-%D7%94%D7%93%D7%95%D7%A8%D7%94%D7%91%D7%90%D7%A9%D7%9C%D7%94%D7%94%D7%93%D7%A8%D7%9B%D7%94';

export const videos: VideoItem[] = [
  { id: 'we-started', platform: 'youtube', code: 'RhCrDqJ5gl4', title: 'המדריך למדריך: התחלנו' },
  { id: 'talk-ep1', platform: 'youtube', code: 'VFsnNgDNvu8', episode: 'פרק 1', title: 'איך בונים פעולה?', related: { label: 'המדריך הכתוב: איך בונים פעולה', to: '/how-to-build?guide=peula' } },
  { id: 'talk-ep2', platform: 'youtube', code: 'Vv3T7en2KKs', episode: 'פרק 2', title: 'איך בונים מערך?', related: { label: 'המדריך הכתוב: איך בונים מערך', to: '/how-to-build?guide=maarach' } },
  { id: 'talk-ep3', platform: 'youtube', code: 'PpeQl25CvyY', episode: 'פרק 3', title: 'מה באמת מביא חניכים?', related: { label: 'המדריך הכתוב: איך מגייסים חניכים', to: '/how-to-build?guide=giyus' } },
];

export function videoUrl(v: VideoItem): string {
  return v.platform === 'youtube' ? `https://www.youtube.com/shorts/${v.code}` : `https://www.instagram.com/reel/${v.code}/`;
}

export function embedUrl(v: VideoItem, autoplay = false): string {
  return v.platform === 'youtube'
    ? `https://www.youtube-nocookie.com/embed/${v.code}?rel=0&playsinline=1${autoplay ? '&autoplay=1' : ''}`
    : `https://www.instagram.com/reel/${v.code}/embed`;
}

export function thumbUrl(v: VideoItem): string | null {
  return v.platform === 'youtube' ? `https://i.ytimg.com/vi/${v.code}/hqdefault.jpg` : null;
}
