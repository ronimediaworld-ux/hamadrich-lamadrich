import { useEffect, useState } from 'react';
import { trackView, type ViewKind } from '../lib/api';
import { EyeIcon } from './Icons';

// סופר צפייה אחת בכניסה לעמוד, ומציג כמה אנשים ראו את התוכן (אם יש שרת).
export function ViewCount({ kind, id }: { kind: ViewKind; id: string }) {
  const [count, setCount] = useState<number | null>(null);
  useEffect(() => {
    let alive = true;
    setCount(null);
    trackView(kind, id).then((c) => { if (alive) setCount(c); });
    return () => { alive = false; };
  }, [kind, id]);
  if (count === null || count < 1) return null;
  return (
    <span className="no-print" style={{ fontSize: 13, color: 'var(--ink-faint)', display: 'inline-flex', alignItems: 'center', gap: 5 }} title="כמה פעמים נצפה התוכן הזה">
      <EyeIcon size={15} />{count === 1 ? 'נצפה פעם אחת' : `נצפה ${count.toLocaleString('he-IL')} פעמים`}
    </span>
  );
}
