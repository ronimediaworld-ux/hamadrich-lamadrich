# -*- coding: utf-8 -*-
"""מחשב מחדש את דקות השלבים התלויים באורך הטקסט (פתיחה, קטע קריאה, הסבר, דיון, סיכום) לפי המודל ב-realistic_times.py,
מוסיף דקה למעבר בכל שלב אחרי הראשון, ומעדכן את משך הפעולה. משחקים ומתודות נשארים כפי שנכתבו (אורכם אינו תלוי בטקסט).
שימוש: python3 -I scripts/apply_realistic_times.py [--apply]"""
import re, sys, json, statistics as st
sys.path.insert(0, __file__.rsplit('/', 1)[0])
import realistic_times as rt
from content_tools import load, save

APPLY = '--apply' in sys.argv
LABEL_RE = re.compile(r'\((\d+)(?:\s*[–-]\s*(\d+))?\s*דק׳\)')
acts = load('activities')
changed = 0
before, after, moves, skipped = [], [], [], []
for a in acts:
    fl = a.get('flow') or []
    mins = [rt.label_minutes(s['label']) for s in fl]
    if sum(m is not None for m in mins) < 3 or sum(m is not None for m in mins) < len(fl) - 2:
        continue
    old_total = sum(m or 0 for m in mins)
    if a['duration'] > 70:
        continue   # ערבי שיא ופעילויות ארוכות הן אירוע, לא פעולה טקסטואלית: זמניהן נשארים
    young = a['ageMax'] <= 3
    old_labels = [s['label'] for s in fl]
    log_start = len(moves)
    for i, s in enumerate(fl):
        if mins[i] is None:
            continue
        k = rt.kind_of(s['label'])
        if k not in rt.TEXT_KINDS:
            continue
        new = rt.model_minutes(s, young) + (0 if i == 0 else rt.TRANSITION)
        if mins[i] > 15 and k != 'discussion':
            continue   # שלב ארוך במיוחד נבחר בכוונה (למשל פתיחה של ערב מיוחד), לא נוגעים בו
        if new != mins[i]:
            s['label'] = LABEL_RE.sub(f'({new} דק׳)', s['label'], count=1)
            moves.append((k, mins[i], new))
    new_total = sum(rt.label_minutes(s['label']) or 0 for s in fl)
    if new_total < old_total * 0.8:
        # המודל מקצר יותר מדי: זו תוכנית ארוכה שזמניה נבחרו בכוונה (ערב, תחרות). משאירים כפי שהיה.
        for s_, lab in zip(fl, old_labels):
            s_['label'] = lab
        del moves[log_start:]
        skipped.append(a['id'])
        continue
    before.append(old_total); after.append(new_total)
    if new_total != a['duration']:
        a['duration'] = new_total
    changed += 1
print('activities recalculated:', changed, '| left as authored (model cuts >20%):', len(skipped))
print('median duration before/after:', st.median(before), st.median(after))
for k in rt.TEXT_KINDS:
    d = [n - o for kk, o, n in moves if kk == k]
    if d:
        print(f'{k}: {len(d)} steps changed, median change {st.median(d):+}, mean {st.mean(d):+.1f}')
if APPLY:
    save('activities', acts)
    print('saved')
