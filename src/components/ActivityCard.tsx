import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../data/types';
import { TeenAvatar } from './TeenAvatar';
import { ClockIcon, StarIcon, EyeIcon } from './Icons';
import { getAllViews } from '../lib/api';
import { getCategory, getActivityDomain } from '../data/categories';

const colorMap: Record<string, { bg: string; fg: string }> = {
  flame: { bg: 'var(--flame-tint)', fg: 'var(--flame-ink)' },
  lime: { bg: 'var(--lime-tint)', fg: 'var(--lime-ink)' },
  magenta: { bg: 'var(--magenta-tint)', fg: 'var(--magenta-ink)' },
  sky: { bg: 'var(--sky-tint)', fg: 'var(--sky-ink)' },
  yellow: { bg: 'var(--yellow-tint)', fg: '#6B4F0E' },
};

const domainColor: Record<string, { bg: string; fg: string }> = {
  'ערכים': colorMap.lime,
  'אמונה': colorMap.sky,
  'פרשת שבוע': colorMap.magenta,
  'כללי': colorMap.flame,
};

export function ActivityCard({ activity, rotate = 0 }: { activity: Activity; rotate?: number }) {
  const [views, setViews] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    getAllViews().then((v) => { if (alive) setViews(v[`activity:${activity.id}`] ?? 0); });
    return () => { alive = false; };
  }, [activity.id]);
  const cat = getCategory(activity.categorySlug);
  const isGeneralActivities = activity.categorySlug === 'activities';
  const domain = isGeneralActivities ? getActivityDomain(activity.tags) : null;
  const badgeLabel = domain ?? cat?.label ?? '';
  const colors = (domain ? domainColor[domain] : colorMap[cat?.color ?? 'flame']) ?? colorMap.flame;

  const solid: Record<string, string> = { 'ערכים': 'var(--lime)', 'אמונה': 'var(--sky)', 'פרשת שבוע': 'var(--magenta)', 'כללי': 'var(--flame)' };
  const tagColor = (domain ? solid[domain] : undefined) ?? `var(--${cat?.color ?? 'flame'})`;

  return (
    <Link
      to={`/activity/${activity.id}`}
      className="card act-card"
      style={{
        flex: '0 0 270px',
        transform: `rotate(${rotate}deg)`,
        ['--t' as string]: colors.bg,
        ['--c' as string]: tagColor,
      }}
    >
      <div className="act-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 'none', width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '2px solid var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            <TeenAvatar character={activity.character} size={30} />
          </div>
          <span className="act-tag">{badgeLabel}</span>
        </div>
        <span className="act-age">{activity.ageLabel}</span>
      </div>
      <div className="act-body">
        {activity.series && (
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--magenta-ink)', marginBottom: 4 }}>
            מערך: {activity.series.title} · מפגש {activity.series.part}{activity.series.total ? `/${activity.series.total}` : ''}
          </div>
        )}
        <h3 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 18.5, marginBottom: 10, lineHeight: 1.3 }}>{activity.title}</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><ClockIcon size={14} />{activity.duration} דק׳</span>
          {views !== null && views > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }} title="כמה פעמים נצפתה הפעולה"><EyeIcon size={14} />{views.toLocaleString('he-IL')}</span>
          )}
        </div>
      </div>
      <div className="act-foot">
        <span style={{ fontSize: 12.5, fontWeight: 700, padding: '1px 11px', borderRadius: 999, background: 'var(--lime-tint)', border: '1.5px solid var(--ink)' }}>
          {activity.shabbat === 'שניהם' ? 'שבת וחול' : `מתאים ל${activity.shabbat}`}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 800 }}>
          <StarIcon size={14} />{activity.rating.toFixed(1)}
        </span>
      </div>
    </Link>
  );
}
