import { Link, useParams } from 'react-router-dom';
import { activities } from '../data/activities';
import { readings } from '../data/readings';
import { ActivityCard } from '../components/ActivityCard';
import { Reveal } from '../components/Reveal';
import { useDocumentTitle } from '../lib/useDocumentTitle';
import { topicTitle } from '../lib/topics';

// עמוד נושא: כל הפעולות והקטעים של נושא אחד (פרשה, חג או ערך). נועד גם למי שמחפש בגוגל "פעולה ל...".
export function TopicPage() {
  const { name = '' } = useParams();
  const topic = decodeURIComponent(name);
  const acts = activities.filter((a) => a.subtopics?.includes(topic));
  const reads = readings.filter((r) => r.tags?.includes(topic)).slice(0, 12);
  useDocumentTitle(topicTitle(topic));

  if (acts.length === 0 && reads.length === 0) {
    return (
      <div className="wrap" style={{ paddingTop: 60, textAlign: 'center' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>לא מצאנו תכנים בנושא הזה</h1>
        <Link to="/category/activities" className="btn btn-outline" style={{ marginTop: 16 }}>לכל הפעולות</Link>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <nav aria-label="פירורי לחם" className="no-print" style={{ display: 'flex', gap: 8, fontSize: 13.5, color: 'var(--ink-faint)', marginBottom: 18 }}>
        <Link to="/">בית</Link><span>›</span>
        <Link to="/category/activities">פעולות</Link><span>›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{topic}</span>
      </nav>
      <Reveal>
        <h1 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 900, fontSize: 'clamp(26px, 4vw, 38px)', margin: '0 0 8px' }}>{topicTitle(topic)}</h1>
        <p style={{ margin: '0 0 26px', fontSize: 17, lineHeight: 1.7, color: 'var(--ink-soft)', maxWidth: 720 }}>
          {acts.length} פעולות מוכנות להעברה בנושא ״{topic}״, לכל הגילאים, עם שלבים מסודרים, שאלות לדיון וקטעי קריאה. בוחרים פעולה, מדפיסים ומעבירים.
        </p>
      </Reveal>
      <div className="cards-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 18 }}>
        {acts.map((a) => <ActivityCard key={a.id} activity={a} />)}
      </div>
      {reads.length > 0 && (
        <section style={{ marginTop: 40 }}>
          <h2 style={{ fontFamily: 'Rubik, sans-serif', fontWeight: 800, fontSize: 22, margin: '0 0 12px' }}>קטעי קריאה בנושא</h2>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {reads.map((r) => <li key={r.id}><Link to={`/reading/${r.id}`} style={{ textDecoration: 'underline' }}>{r.title}</Link></li>)}
          </ul>
        </section>
      )}
    </div>
  );
}
