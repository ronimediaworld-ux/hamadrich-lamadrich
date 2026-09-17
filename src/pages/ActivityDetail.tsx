import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getActivity } from '../data/activities';
import { getCategory, getActivityDomain } from '../data/categories';
import { TeenAvatar } from '../components/TeenAvatar';
import { ClockIcon, UsersIcon, StarIcon, MapPinIcon, HeartIcon } from '../components/Icons';
import { Reveal } from '../components/Reveal';
import { isFavorite, toggleFavorite } from '../lib/favorites';
import { activityToText } from '../lib/contentText';
import { CopyButton } from '../components/CopyButton';
import { PrintButton } from '../components/PrintButton';
import { useDocumentTitle } from '../lib/useDocumentTitle';

function Section({ label, step, children }: { label: string; step?: number; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        {step ? (
          <span style={{
            flex: 'none', width: 22, height: 22, borderRadius: '50%', background: 'var(--flame)', color: '#FFF6EC',
            fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {step}
          </span>
        ) : (
          <span style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--flame)' }} />
        )}
        <h3 style={{ fontSize: 15.5, fontWeight: 800 }}>{label}</h3>
      </div>
      <div style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink-soft)', paddingInlineStart: 16 }}>{children}</div>
    </div>
  );
}

export function ActivityDetail() {
  const { id } = useParams();
  const activity = getActivity(id ?? '');
  const [saved, setSaved] = useState(false);
  useDocumentTitle(activity?.title);

  useEffect(() => {
    if (id) setSaved(isFavorite(id));
  }, [id]);

  function handleSave() {
    if (!id) return;
    setSaved(toggleFavorite(id));
  }

  if (!activity) {
    return (
      <div className="wrap" style={{ padding: '60px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>הפעולה לא נמצאה</h1>
        <Link to="/" className="btn btn-outline" style={{ marginTop: 16 }}>חזרה לדף הבית</Link>
      </div>
    );
  }

  const category = getCategory(activity.categorySlug);
  const badgeLabel = activity.categorySlug === 'activities' ? getActivityDomain(activity.tags) : category?.label;

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <div className="no-print" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
        <Link to="/">בית</Link><span>›</span>
        <Link to={`/category/${activity.categorySlug}`}>{category?.label}</Link><span>›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{activity.title}</span>
      </div>

      <Reveal>
        <div className="detail-hero" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 40, marginBottom: 30 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--line)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TeenAvatar character={activity.character} size={38} />
              </div>
              <span style={{ padding: '5px 13px', borderRadius: 999, background: 'var(--flame-tint)', color: 'var(--flame-ink)', fontSize: 12.5, fontWeight: 700 }}>
                {badgeLabel}
              </span>
            </div>
            {activity.series && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, fontSize: 13.5, fontWeight: 700, color: 'var(--magenta-ink)' }}>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: 'var(--magenta-tint)' }}>מערך: {activity.series.title}</span>
                <span style={{ color: 'var(--ink-faint)', fontWeight: 600 }}>
                  מפגש {activity.series.part}{activity.series.total ? ` מתוך ${activity.series.total}` : ''}
                </span>
              </div>
            )}
            <h1 style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>{activity.title}</h1>
            <p style={{ fontSize: 15.5, color: 'var(--ink-soft)', maxWidth: '58ch' }}>{activity.description}</p>
          </div>

          <div className="card" style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12, height: 'fit-content' }}>
            <Row icon={<UsersIcon size={16} />} label={activity.ageLabel} />
            <Row icon={<ClockIcon size={16} />} label={`${activity.duration} דקות`} />
            <Row icon={<MapPinIcon size={16} />} label={activity.place === 'שניהם' ? 'פנים וחוץ' : activity.place} />
            <Row icon={<StarIcon size={16} />} label={`${activity.rating.toFixed(1)} דירוג מדריכים`} />
            <div style={{ height: 1, background: 'var(--line)' }} />
            <div style={{ fontSize: 13.5 }}>
              <b>שבת/חול: </b>{activity.shabbat === 'שניהם' ? 'מתאים לשניהם' : `מתאים ל${activity.shabbat} בלבד`}
            </div>
            <div style={{ fontSize: 13.5 }}>
              <b>ציוד: </b>{activity.equipment.length ? activity.equipment.join(', ') : 'ללא ציוד מיוחד'}
            </div>
            <div className="no-print" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <PrintButton filename={`${activity.id}.html`} title={activity.title} text={activityToText(activity)} style={{ flex: 1 }} />
              <button
                className="btn btn-outline"
                onClick={handleSave}
                style={{ flex: 1, justifyContent: 'center', background: saved ? 'var(--flame-tint)' : undefined, borderColor: saved ? 'var(--flame)' : undefined }}
              >
                <HeartIcon size={15} color={saved ? 'var(--flame)' : 'currentColor'} />
                {saved ? 'נשמר במועדפים' : 'שמירה למועדפים'}
              </button>
            </div>
            <CopyButton
              text={activityToText(activity)}
              label="העתקת הפעולה כטקסט"
              copiedLabel="✓ הועתק — אפשר להדביק ולערוך"
            />
          </div>
        </div>
      </Reveal>

      {activity.shabbatNote && (
        <Reveal>
          <div style={{ background: 'var(--sky-tint)', border: '1px solid var(--sky)', borderRadius: 12, padding: '14px 18px', fontSize: 14, color: 'var(--sky-ink)', marginBottom: 28 }}>
            <b>התאמה לשבת: </b>{activity.shabbatNote}
          </div>
        </Reveal>
      )}

      <Reveal>
        <div style={{ maxWidth: 760 }}>
          <Section label="מטרות">
            <ul style={{ margin: 0, paddingInlineStart: 18 }}>
              {activity.goals.map((g, i) => <li key={i} style={{ marginBottom: 6 }}>{g}</li>)}
            </ul>
          </Section>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '30px 0 18px' }}>
            <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.4, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>מהלך הפעולה</h2>
            <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>

          {activity.flow && activity.flow.length > 0 ? (
            <>
              {activity.flow.map((s, i) => (
                <Section key={i} label={s.label} step={i + 1}>
                  {s.body && <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{s.body}</p>}
                  {s.items && s.items.length > 0 && (
                    <ul style={{ margin: s.body ? '8px 0 0' : 0, paddingInlineStart: 18 }}>
                      {s.items.map((q, j) => <li key={j} style={{ marginBottom: 6 }}>{q}</li>)}
                    </ul>
                  )}
                  {s.link && (
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 18px', marginTop: s.body || s.items ? 10 : 0 }}>
                      <a href={s.link.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--flame-ink)', textDecoration: 'underline' }}>
                        {s.link.title} ↗
                      </a>
                    </div>
                  )}
                  {s.note && <p style={{ margin: '8px 0 0', fontSize: 13.5, color: 'var(--ink-faint)' }}>{s.note}</p>}
                </Section>
              ))}
              {activity.sourceLink && (
                <Section label="מקור חיצוני — צפייה/קריאה" step={activity.flow.length + 1}>
                  <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 18px' }}>
                    <a href={activity.sourceLink.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 700, color: 'var(--flame-ink)', textDecoration: 'underline' }}>
                      {activity.sourceLink.title} ↗
                    </a>
                  </div>
                </Section>
              )}
            </>
          ) : (() => {
            let step = 0;
            return (
              <>
                <Section label="פתיחה" step={++step}>
                  <p style={{ margin: 0 }}>{activity.opening}</p>
                </Section>

                {activity.game && (
                  <Section label="משחק" step={++step}>
                    <p style={{ margin: 0 }}>{activity.game}</p>
                  </Section>
                )}

                <Section label="מתודה" step={++step}>
                  <p style={{ margin: 0 }}>{activity.method}</p>
                </Section>

                {activity.reading && (
                  <Section label="קטע קריאה" step={++step}>
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 18px' }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--ink-faint)', marginBottom: 6 }}>{activity.reading.label}</div>
                      <div style={{ fontStyle: 'italic' }}>{activity.reading.text}</div>
                    </div>
                  </Section>
                )}

                {activity.sourceLink && (
                  <Section label="מקור חיצוני — צפייה/קריאה" step={++step}>
                    <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 10, padding: '14px 18px' }}>
                      <p style={{ margin: '0 0 8px', fontSize: 14 }}>
                        התוכן לא מובא כאן מטעמי זכויות יוצרים. יש לפתוח/להדפיס אותו מהמקור:
                      </p>
                      <a
                        href={activity.sourceLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontWeight: 700, color: 'var(--flame-ink)', textDecoration: 'underline' }}
                      >
                        {activity.sourceLink.title} ↗
                      </a>
                    </div>
                  </Section>
                )}

                <Section label="דיון" step={++step}>
                  <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                    {activity.discussion.map((q, i) => <li key={i} style={{ marginBottom: 6 }}>{q}</li>)}
                  </ul>
                </Section>

                {activity.questions && (
                  <Section label="שאלות נוספות" step={++step}>
                    <ul style={{ margin: 0, paddingInlineStart: 18 }}>
                      {activity.questions.map((q, i) => <li key={i} style={{ marginBottom: 6 }}>{q}</li>)}
                    </ul>
                  </Section>
                )}

                <Section label="סיכום" step={++step}>
                  <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{activity.summary}</p>
                </Section>
              </>
            );
          })()}

          <Section label="הסבר למדריך">
            <p style={{ margin: 0 }}>{activity.guideNotes}</p>
          </Section>

          {activity.appendices && activity.appendices.length > 0 && (
            <div style={{ marginTop: 34, marginBottom: 26 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.4, color: 'var(--ink-faint)', textTransform: 'uppercase' }}>נספחים — חומרים לחלוקה/הקראה</h2>
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {activity.appendices.map((a, i) => (
                  <div key={i} className="card" style={{ padding: '16px 20px' }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--flame-ink)', marginBottom: 8 }}>
                      נספח {i + 1}: {a.label}
                    </div>
                    <div style={{ fontSize: 14.5, lineHeight: 1.75, whiteSpace: 'pre-line' }}>{a.content}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'var(--yellow-tint)', border: '1px solid var(--yellow)', borderRadius: 12, padding: '16px 20px', fontSize: 14.5, marginTop: 8 }}>
            <b>טיפ למדריך: </b>{activity.tip}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14 }}>
      <span style={{ color: 'var(--flame)' }}>{icon}</span>{label}
    </div>
  );
}
