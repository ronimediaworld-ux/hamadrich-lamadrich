"""חלוקת זמנים לשלבים לפעולות שחסרה להן: משך הפעולה מחולק לפי משקל של כל סוג שלב (הערכה, ולא זמן שנמדד).
 - פעולות עם flow בלי דקות: מוסיף "(N דק׳)" לכותרות.
 - פעולות בלי flow: בונה flow מהשדות הקיימים (פתיחה, משחק, מתודה, קטע קריאה, דיון, שאלות נוספות, סיכום), בלי לאבד תוכן.
 לא משנה את הטקסט של השלבים, ולא את משך הפעולה."""
import re, sys
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from content_tools import load, save

HAS_MIN = re.compile(r'\(\d+(?:\s*[–-]\s*\d+)?\s*דק')
NOTE = 'זמני השלבים הם הערכה לפי משך הפעולה, ואפשר להתאים אותם לקבוצה.'


def weight(label: str) -> float:
    l = label
    if re.search(r'צ[׳\']ופר', l): return 0.5
    if re.search(r'סיכום', l): return 1
    if re.search(r'דיון|שאלות', l): return 2
    if re.search(r'קטע|סיפור|מקור|קריאה', l): return 1.5
    if re.search(r'הסבר|חיבור', l): return 1
    if re.search(r'פתיחה', l): return 1
    if re.search(r'משחקים ומשימות', l): return 6
    return 3


def allocate(labels, total):
    ws = [weight(l) for l in labels]
    s = sum(ws)
    raw = [w / s * total for w in ws]
    out = [max(2, int(r)) for r in raw]
    # מחלקים את ההפרש לפי השארית הגדולה ביותר, בלי לרדת מ-2 דקות לשלב
    diff = total - sum(out)
    order = sorted(range(len(out)), key=lambda i: raw[i] - int(raw[i]), reverse=True)
    i = 0
    while diff != 0 and order:
        k = order[i % len(order)]
        if diff > 0: out[k] += 1; diff -= 1
        elif out[k] > 2: out[k] -= 1; diff += 1
        i += 1
        if i > 5000: break
    return out


def from_legacy(a):
    steps = []
    steps.append({'label': 'פתיחה', 'body': a['opening']})
    if a.get('game'): steps.append({'label': 'משחק', 'body': a['game']})
    steps.append({'label': 'מתודה', 'body': a['method']})
    if a.get('reading'):
        steps.append({'label': 'קטע קריאה', 'body': f"{a['reading']['label']}\n{a['reading']['text']}"})
    steps.append({'label': 'דיון', 'items': list(a['discussion'])})
    q = a.get('questions')
    summary = {'label': 'סיכום', 'body': a['summary']}
    return steps, q, summary


acts = load('activities')
fixed_flow = converted = 0
for a in acts:
    flow = a.get('flow')
    if flow and not any(HAS_MIN.search(f['label']) for f in flow):
        mins = allocate([f['label'] for f in flow], a['duration'])
        for f, m in zip(flow, mins):
            f['label'] = f"{f['label']} ({m} דק׳)"
        a['guideNotes'] = (a['guideNotes'].rstrip() + '\n\n' + NOTE).strip()
        fixed_flow += 1
    elif not flow:
        steps, q, summary = from_legacy(a)
        timed = steps + [summary]
        mins = allocate([s['label'] for s in timed], a['duration'])
        for s, m in zip(timed, mins):
            s['label'] = f"{s['label']} ({m} דק׳)"
        new = steps + ([{'label': 'שאלות נוספות (אם נשאר זמן)', 'items': list(q)}] if q else []) + [summary]
        a['flow'] = new
        a['guideNotes'] = (a['guideNotes'].rstrip() + '\n\n' + NOTE).strip()
        converted += 1
save('activities', acts)
print('timed existing flows:', fixed_flow, 'converted legacy:', converted)
