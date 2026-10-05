import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Activity } from '../data/types';
import { TeenAvatar } from './TeenAvatar';
import { ClockIcon, UsersIcon, StarIcon, EyeIcon } from './Icons';
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

  return (
    <Link
      to={`/activity/${activity.id}`}
      className="card"
      style={{
        display: 'block',
        flex: '0 0 270px',
        padding: 20,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 'none', width: 44, height: 44, borderRadius: '50%', background: colors.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <TeenAvatar character={activity.character} size={32} />
        </div>
        <span style={{ padding: '4px 11px', borderRadius: 999, background: colors.bg, color: colors.fg, fontSize: 11.5, fontWeight: 700 }}>
          {badgeLabel}
        </span>
      </div>
      {activity.series && (
        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--magenta-ink)', marginBottom: 4 }}>
          מערך: {activity.series.title} · מפגש {activity.series.part}{activity.series.total ? `/${activity.series.total}` : ''}
        </div>
      )}
      <h3 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 17.5, marginBottom: 10, lineHeight: 1.35 }}>{activity.title}</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 14px', fontSize: 13, color: 'var(--ink-soft)', marginBottom: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><UsersIcon size={14} />{activity.ageLabel}</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><ClockIcon size={14} />{activity.duration} דק׳</span>
        {views !== null && views > 0 && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }} title="כמה פעמים נצפתה הפעולה"><EyeIcon size={14} />{views.toLocaleString('he-IL')}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13.5, fontWeight: 700 }}>
          <StarIcon size={13} />{activity.rating.toFixed(1)}
        </span>
        <span style={{ fontSize: 12, padding: '3px 10px', borderRadius: 999, background: 'var(--bg)', border: '1px solid var(--line)' }}>
          {activity.shabbat === 'שניהם' ? 'שבת וחול' : `מתאים ל${activity.shabbat}`}
        </span>
      </div>
    </Link>
  );
}
