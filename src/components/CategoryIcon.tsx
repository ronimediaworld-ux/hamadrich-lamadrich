// איקונים מצוירים לקטגוריות, באותו סגנון קווי של האתר: קו כהה עבה ומילוי בצבע הקטגוריה.
export interface CatStyle { color: string; tint: string }

export const CAT_STYLE: Record<string, CatStyle> = {
  activities: { color: '#EE7B4D', tint: '#FFE8DC' },
  'social-nights': { color: '#DE6F92', tint: '#FCE5EC' },
  'staff-study': { color: '#4A93BD', tint: '#DFF0F8' },
  tools: { color: '#5E9A6E', tint: '#E4F2E8' },
  readings: { color: '#8E7BD6', tint: '#EEE9FB' },
  walls: { color: '#4FB3AE', tint: '#DDF3F2' },
  'special-events': { color: '#E8A93A', tint: '#FFF1CF' },
  games: { color: '#5E9A6E', tint: '#E2F4EA' },
  methods: { color: '#D9A21F', tint: '#FFF4D6' },
};

const INK = '#4B4666';

export function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const c = (CAT_STYLE[slug] ?? CAT_STYLE.activities).color;
  const common = { viewBox: '0 0 56 56', className, 'aria-hidden': true } as const;
  const st = { stroke: INK, strokeWidth: 2.1, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  switch (slug) {
    case 'social-nights':
      return (<svg {...common}><path d="M38 8a22 22 0 1 0 12 32 18 18 0 0 1-12-32Z" fill={c} {...st} /><circle cx="40" cy="14" r="2.6" fill="#F5CB63" stroke={INK} strokeWidth="1.6" /><circle cx="48" cy="26" r="2" fill="#F5CB63" stroke={INK} strokeWidth="1.4" /></svg>);
    case 'staff-study':
      return (<svg {...common}><path d="M8 12h18c3 0 4 2 4 4v32c0-2-1-4-4-4H8Z M48 12H30c-3 0-4 2-4 4v32c0-2 1-4 4-4h18Z" fill={c} {...st} /><path d="M13 20h10M13 27h10M35 20h8M35 27h8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" fill="none" /></svg>);
    case 'tools':
      return (<svg {...common}><path d="M8 10h40a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H26l-10 9v-9H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" fill={c} {...st} /><circle cx="18" cy="25" r="2.8" fill="#fff" /><circle cx="28" cy="25" r="2.8" fill="#fff" /><circle cx="38" cy="25" r="2.8" fill="#fff" /></svg>);
    case 'readings':
      return (<svg {...common}><path d="M10 8h28a6 6 0 0 1 6 6v34H16a6 6 0 0 1-6-6Z" fill={c} {...st} /><path d="M16 48a6 6 0 0 1-6-6" fill="none" stroke={INK} strokeWidth="2.6" /><path d="M18 18h18M18 25h18M18 32h10" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" /></svg>);
    case 'special-events':
      return (<svg {...common}><path d="M28 6l6.2 13.4 14.6 1.6-10.9 9.9 3.1 14.4L28 37.7 15 45.3l3.1-14.4L7.2 21l14.6-1.6z" fill={c} {...st} /><circle cx="47" cy="10" r="3" fill="#F5CB63" stroke={INK} strokeWidth="1.6" /><circle cx="9" cy="47" r="2.6" fill="#F5CB63" stroke={INK} strokeWidth="1.5" /><circle cx="48" cy="46" r="2" fill="#fff" stroke={INK} strokeWidth="1.4" /></svg>);
    case 'walls':
      return (<svg {...common}><rect x="6" y="8" width="44" height="20" rx="5" fill={c} {...st} /><path d="M50 18h4v12H28v8" fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" /><rect x="23" y="38" width="10" height="14" rx="3" fill="#F5CB63" {...st} /></svg>);
    case 'games':
      return (<svg {...common}><rect x="8" y="8" width="40" height="40" rx="9" fill={c} {...st} transform="rotate(-8 28 28)" /><g fill="#fff"><circle cx="19" cy="19" r="3.2" /><circle cx="37" cy="19" r="3.2" /><circle cx="28" cy="28" r="3.2" /><circle cx="19" cy="37" r="3.2" /><circle cx="37" cy="37" r="3.2" /></g></svg>);
    case 'chuparim':
      return (<svg {...common}><rect x="8" y="22" width="40" height="28" rx="5" fill="#D9A21F" {...st} /><rect x="5" y="15" width="46" height="10" rx="4" fill="#F5CB63" {...st} /><path d="M28 15v35" stroke={INK} strokeWidth="2.6" /><path d="M28 15c-8-12-18-4-10 0M28 15c8-12 18-4 10 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" /></svg>);
    case 'methods':
      return (<svg {...common}><circle cx="28" cy="28" r="15" fill={c} {...st} /><circle cx="28" cy="28" r="5.5" fill="#FFFFFF" stroke={INK} strokeWidth="2.4" /><path d="M28 6v9M28 41v9M6 28h9M41 28h9M12.5 12.5l6 6M37.5 37.5l6 6M43.5 12.5l-6 6M18.5 37.5l-6 6" stroke={INK} strokeWidth="3.2" strokeLinecap="round" /></svg>);
    default:
      return (<svg {...common}><rect x="10" y="9" width="36" height="42" rx="6" fill={c} {...st} /><rect x="19" y="4" width="18" height="10" rx="4" fill="#FFFFFF" {...st} /><path d="M18 26h20M18 33h20M18 40h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>);
  }
}
