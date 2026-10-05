"""Imports 'חוברת ערבים למדריך' (the movement's evenings booklet, which explicitly allows copying and distributing) into the social-nights category."""
import re, json
from content_tools import load, save, age_label, check_activity

SRC = 'booklet_body.txt'

# body-heading -> (canonical title, slug)
HEADS = [
    ('ערב אבטיחים', 'ערב אבטיחים', 'watermelon'), ('ערב אגדות', 'ערב אגדות', 'fairy-tales'),
    ('ערב אותיות אחר', '__letters2', ''), ('ערב אותיות', 'ערב אותיות', 'letters'), ('ערב אטבים', 'ערב אטבים', 'clothespins'),
    ('ערב אינדיאנים', 'ערב אינדיאנים', 'indians'), ('ערב אכלת אותה', 'ערב אכלת אותה', 'you-got-it'),
    ('ערב אלף פרצופים', 'ערב אלף פרצופים', 'thousand-faces'), ('ערב אמונות טפלות', 'ערב אמונות טפלות', 'superstitions'),
    ('ערב אסירים', 'ערב אסירים', 'prisoners'), ('ערב ארץ ישראל', 'ערב ארץ ישראל', 'land-of-israel'),
    ('ערב ארצות וערים', 'ערב ארצות וערים', 'countries-capitals'), ('ערב אתגרים', 'ערב אתגרים', 'challenges'),
    ('ערב בחירות 1', '__elect1', ''), ('ערב בחירות 2', '__elect2', ''), ('ערב בידור', 'ערב בידור', 'entertainment'),
    ('ערב ביסלי', 'ערב ביסלי', 'bisli'), ('ערב ביצים', 'ערב ביצים', 'eggs'), ('ערב בלונים', 'ערב בלונים', 'balloons'),
    ('ערב בלשים', 'ערב בלשים', 'detectives'), ('ערב במבה', 'ערב במבה', 'bamba'), ('ערב גועל נפש', 'ערב גועל נפש', 'disgusting'),
    ('ערב גרביים', 'ערב גרביים', 'socks'), ('ערב גרפולוגיה', 'ערב גרפולוגיה', 'graphology'),
    ('ערב הדרקון הלא נכון', 'ערב הדרקון הלא נכון', 'wrong-dragon'), ('ערב התחלות', 'ערב התחלות', 'beginnings'),
    ('ערב זיכרון', 'ערב זיכרון', 'memory'), ('ערב חורים', 'ערב חורים', 'holes'), ('ערב חורף', 'ערב חורף', 'winter'),
    ('ערב חושים', 'ערב חושים', 'senses'), ('ערב חיות', 'ערב חיות', 'animals'), ('ערב טלויזיה', 'ערב טלוויזיה', 'tv'),
    ('ערב טלפונים', 'ערב טלפונים', 'phones'), ('ערב יומולדת', 'ערב יומולדת', 'birthday'),
    ('ערב ילדות', 'ערב ילדות', 'childhood'), ('ערב ירוק ואיכותי', 'ערב ירוק ואיכותי', 'green'),
    ('ערב ישראלי', 'ערב ישראלי', 'israeli'), ('ערב כדורגל', 'ערב כדורגל', 'football'), ('ערב כלבים', 'ערב כלבים', 'dogs'),
    ('ערב כסאות', 'ערב כסאות', 'chairs'), ('ערב לבוש', 'ערב לבוש', 'clothing'), ('ערב לחץ', 'ערב לחץ', 'pressure'),
    ('ערב לימודים', 'ערב לימודים', 'school'), ('ערב לכל איש יש שם', 'ערב לכל איש יש שם', 'everyone-has-a-name'),
    ('ערב מוסיקה', 'ערב מוסיקה', 'music'), ('ערב מחלות', 'ערב מחלות', 'illnesses'), ('ערב מים', 'ערב מים', 'water'),
    ('ערב מטבעות', 'ערב מטבעות', 'coins'), ('ערב מסביב לעולם', 'ערב מסביב לעולם', 'around-world'),
    ('ערב מסטיקים', 'ערב מסטיקים', 'bubble-gum'), ('ערב משוגעים', 'ערב משוגעים', 'crazies'),
    ('ערב נייר טואלט', 'ערב נייר טואלט', 'toilet-paper'), ('ערב נעליים', 'ערב נעליים', 'shoes'),
    ('ערב סוכריות', 'ערב סוכריות', 'candy'), ('ערב ספגטי', 'ערב ספגטי וקשים', 'spaghetti-straws'),
    ('ערב ספורט היתולי', 'ערב ספורט היתולי', 'funny-sports'), ('ערב עגול', 'ערב עגול', 'round'), ('ערב עדות', 'ערב עדות', 'ethnic-groups'),
    ('ערב עיתונים', 'ערב עיתונים', 'newspapers'), ('ערב עקרת בית', 'ערב עקרת בית', 'housewife'),
    ('ערב 10 המכות', 'ערב עשר המכות', 'ten-plagues'), ('ערב פופקורן', 'ערב פופקורן', 'popcorn'), ('ערב פורים', 'ערב פורים', 'purim'),
    ('ערב פיצה', 'ערב פיצה', 'pizza'), ('ערב פרה', 'ערב פרה', 'cow'), ('ערב צבא', 'ערב צבא', 'army'), ('ערב צבעים', 'ערב צבעים', 'colors'),
    ('ערב צפרדעים', 'ערב צפרדעים', 'frogs'), ('ערב קזינו', 'ערב קזינו', 'casino'), ('ערב קרמבו', 'ערב קרמבו', 'krembo'),
    ('ערב קשים', 'ערב קשים', 'straws'), ('ערב שוקולד', 'ערב שוקולד', 'chocolate'), ('ערב שחור לבן', 'ערב שחור לבן', 'black-white'),
    ('ערב שיאים', 'ערב שיאים', 'records'), ('ערב שק', 'ערב שק״שים', 'sacks'), ('ערב תה', 'ערב תה', 'tea'),
    ('ערב תפוזים', 'ערב תפוזים', 'oranges'), ('ערב תפוחי אדמה', 'ערב תפוחי אדמה', 'potatoes'),
]
EXISTING = {'ערב אבטיחים': 'watermelon-night', 'ערב בלשים': 'detectives-night', 'ערב קזינו': 'casino-night',
            'ערב מסביב לעולם': 'around-the-world-night', 'ערב שיאים': 'records-night', 'ערב חושים': 'senses-night',
            'ערב צבעים': 'colors-night', 'ערב טלוויזיה': 'tv-night'}


def clean_line(l):
    s = l.strip().replace(' ', ' ')
    s = re.sub(r'^(•\s*)+', '', s).strip()
    return s


def find_head(s):
    for pref, canon, slug in HEADS:
        if s.startswith(pref):
            rest = s[len(pref):]
            # a heading line is short, or has an inline description (booklet quirks)
            if len(s) <= 62 or canon in ('__elect1', '__elect2', 'ערב חושים', 'ערב ספגטי וקשים', 'ערב שק״שים', 'ערב שוקולד') or True:
                if pref == 'ערב אותיות' and rest.strip().startswith('אחר'):
                    continue
                return canon, slug, rest
    return None


def parse():
    raw = open(SRC, encoding='utf8').read().split('\n')
    sections = []  # (canon, slug, lines)
    cur = None
    for r in raw:
        isb = r.strip().startswith('•')
        s = clean_line(r)
        if not s or s == 'לרשימה':
            continue
        if not isb:
            h = find_head(s)
            if h and (len(s) <= 62 or h[0] in ('__elect1', '__elect2', 'ערב חושים', 'ערב ספגטי וקשים', 'ערב שק״שים', 'ערב שוקולד')):
                canon, slug, rest = h
                cur = {'canon': canon, 'slug': slug, 'lines': []}
                sections.append(cur)
                rest = rest.strip(' :')
                rest = re.sub(r'^[\\/]?\s*(קשים|תינוקות|טיסה נעימה|\(הימורים\)|\(חב"[אב]\)|\.)?', '', rest).strip(' :.')
                if rest and not re.fullmatch(r'משחקים\\משימות:?', rest):
                    rest = re.sub(r'^משחקים\\משימות:?\s*', '', rest)
                    rest = re.sub(r'^\(לחבריא.*?\)\s*', '', rest) if False else rest
                    if rest:
                        cur['lines'].append(('note', rest))
                continue
        if cur is None:
            continue
        if re.fullmatch(r'משחקים\\משימות:?|משחקים:?', s):
            continue
        if re.fullmatch(r'[א-ת]', s):  # flattened word-search grid (Purim) - dropped
            continue
        cur['lines'].append(('item' if isb else 'note', s))
    return sections


GRP = {'__letters2': 'ערב אותיות', '__elect1': 'ערב בחירות', '__elect2': 'ערב בחירות'}


def build(sections):
    nights = {}
    order = []
    for sec in sections:
        canon = sec['canon']
        label = None
        if canon in GRP:
            label = {'__letters2': 'גרסה נוספת — "אותיות אחר"', '__elect1': 'גרסה א׳ — לקבוצות צעירות', '__elect2': 'גרסה ב׳ — לקבוצות גדולות'}[canon]
            canon = GRP[canon]
        if canon not in nights:
            nights[canon] = {'canon': canon, 'slug': sec['slug'], 'groups': []}
            order.append(canon)
        if canon == 'ערב בחירות':
            nights[canon]['slug'] = 'elections'
        if canon == 'ערב אותיות':
            nights[canon]['slug'] = 'letters'
        nights[canon]['groups'].append((label, sec['lines']))
    return [nights[c] for c in order]


PLACE = {'ערב אתגרים': 'חוץ', 'ערב מים': 'שניהם', 'ערב אינדיאנים': 'שניהם', 'ערב צבא': 'שניהם', 'ערב כדורגל': 'שניהם', 'ערב פרה': 'פנים'}
DURATION = {'ערב אתגרים': 120, 'ערב פורים': 60, 'ערב צבא': 90}
HIGH = {'ערב אתגרים', 'ערב מים', 'ערב אינדיאנים', 'ערב צבא', 'ערב כדורגל', 'ערב ספורט היתולי', 'ערב כסאות', 'ערב אותיות', 'ערב צפרדעים', 'ערב נעליים'}
LOW = {'ערב גרפולוגיה', 'ערב אגדות', 'ערב זיכרון', 'ערב בחירות', 'ערב לחץ', 'ערב לימודים', 'ערב התחלות'}
SOURCE = 'מקור: חוברת ערבים למדריך (צוות הדרכה, האתר של חבריא ב׳), שבה מצוין שמותר להעתיק, להפיץ ולהדפיס אותה למען מדריכים.'
SAFETY = 'זו רשימת רעיונות, לא תוכנית מלאה: בוחרים מהמשחקים לפי הזמן והקבוצה, ומוסיפים רעיונות משלכם. לפני הערב נסו כל משחק, ובדקו בטיחות — בלי חפצים חדים, בלי אש ליד חניכים עם עיניים קשורות, ושימו לב לאלרגיות ולרגישויות (אוכל, קמח, מים). אין להכריח אף חניך לאכול או להשתתף.'
DEFAULT_SUMMARY = 'מכריזים על הקבוצה המנצחת (או על כל הקבוצות כמנצחות) ומסיימים בשיחה קצרה: מה היה הכי כיף בערב?'
SUMMARY = {'ערב בחירות': 'מסכמים בשיחה קצרה: מה למדנו מהערב על הבטחות, על בחירות ועל מה שאנחנו באמת רוצים לעשות?', 'ערב זיכרון': 'מסיימים בשיחה שקטה: מה אני לוקח/ת איתי מהערב?'}
CHUPAR_RE = re.compile(r"^(זה |רעיון ל)?צ[׳'’]?ופר")
EQUIP_RE = re.compile(r'^(מה צריך להביא|מה להביא|מה כדאי להביא)\??:?\s*')


def to_record(n, idx):
    canon = n['canon']
    topic = canon.replace('ערב ', '', 1)
    items_all, prep, equip_txt, chupar, notes = [], [], [], [], []
    steps = []
    nitems = 0
    grp_steps = []
    for label, lines in n['groups']:
        items = []
        expect_chupar = False
        for kind, s in lines:
            if s == 'ערב פורים.':
                continue
            s = re.sub(r'^\(לחבריא[^)]*\)\s*', '', s)
            if 'שיפוד' in s:
                s = s.replace('שיפוד', 'מקל רך או עיתון מגולגל (לא חפץ חד!)')
            if s.startswith('נ- נרות') or ('נרות דולקים' in s):
                s += ' (שימו לב לבטיחות: אש רק בהשגחה מלאה ובלי עיניים קשורות — אפשר להחליף בנרות לד.)'
            if expect_chupar:
                chupar.append(s); expect_chupar = False; continue
            if CHUPAR_RE.match(s):
                if s.rstrip().endswith(':') and len(s) < 40:
                    expect_chupar = True
                    continue
                chupar.append(re.sub(r"^(זה |רעיון ל)?צ[׳'’]?ופר( והמסר לצידו)?:?\s*", '', s)); continue
            if s.startswith('תפאורה'):
                prep.append(re.sub(r'^תפאורה:?\s*', 'תפאורה: ', s)); continue
            if EQUIP_RE.match(s):
                equip_txt.append(EQUIP_RE.sub('', s)); continue
            if 'דרוש:' in s and kind == 'note':
                notes.append(s); continue
            items.append(s)
        nitems += len(items)
        grp_steps.append((label, items))
    flow = []
    if prep or equip_txt:
        body = '\n'.join(prep + (['מה צריך להביא: ' + '; '.join(equip_txt)] if equip_txt else []))
        flow.append({'label': 'הכנות ותפאורה', 'body': body})
    for label, items in grp_steps:
        if not items:
            continue
        lab = 'משחקים ומשימות' + (f' — {label}' if label else '')
        # long prose items (no bullets in the source) stay as paragraphs inside the same list
        flow.append({'label': lab, 'items': items})
    if chupar:
        flow.append({'label': 'צ׳ופר', 'body': '\n'.join(chupar)})
    if notes:
        flow.append({'label': 'הערות', 'body': '\n'.join(notes)})
    flow.append({'label': 'סיכום', 'body': SUMMARY.get(canon, DEFAULT_SUMMARY)})
    equipment = []
    for t in equip_txt:
        equipment += [e.strip(' .') for e in re.split(r'[,،]', t) if e.strip(' .')]
    return {
        'id': f"booklet-{n['slug']}", 'title': canon, 'categorySlug': 'social-nights',
        'subtopics': ['ערבי גיבוש', topic], 'ageLabel': age_label(4, 9), 'ageMin': 4, 'ageMax': 9,
        'duration': DURATION.get(canon, 75), 'groupSize': '15-40 חניכים', 'equipment': equipment,
        'shabbat': 'חול', 'place': PLACE.get(canon, 'פנים'), 'energy': 'גבוהה' if canon in HIGH else ('נמוכה' if canon in LOW else 'בינונית'),
        'depth': 'קליל', 'values': ['גיבוש', 'כיף', 'עבודת צוות'], 'tags': ['ערבי גיבוש', 'משחקים', 'חוברת ערבים', topic],
        'rating': 4.5, 'character': 'ABCDEF'[idx % 6],
        'description': f'ערב בנושא "{topic}" מתוך חוברת הערבים: {nitems} רעיונות למשחקים ולמשימות, בעיקר תחרויות בין קבוצות — בוחרים לפי הקבוצה והזמן שיש.',
        'goals': [f'ערב כיף וגיבוש סביב הנושא "{topic}"', 'כל חניך משתתף במשחקים ובמשימות, בקבוצות מעורבות'],
        'opening': 'מכריזים על נושא הערב ומחלקים את הקבוצה לשתי קבוצות או יותר. בוחרים מהרשימה את המשחקים והמשימות המתאימים לקבוצה ולזמן.',
        'method': 'מריצים את המשחקים והמשימות לפי הרשימה, עם ניקוד קבוצתי בין המשחקים.',
        'discussion': [], 'flow': flow,
        'guideNotes': SAFETY + '\n' + SOURCE,
        'summary': SUMMARY.get(canon, DEFAULT_SUMMARY),
        'tip': 'שימו ניקוד קבוצתי לכל משחק, ובחרו מראש 2–3 משחקים "גדולים" ועוד כמה קצרים למילוי זמן.',
    }


if __name__ == '__main__':
    secs = parse()
    nights = build(secs)
    acts = load('activities')
    ids = {a['id'] for a in acts}
    new, appended = [], []
    for i, n in enumerate(nights):
        if n['canon'] in EXISTING:
            eid = EXISTING[n['canon']]
            ex = next(a for a in acts if a['id'] == eid)
            r = to_record(n, i)
            lines = []
            for st in r['flow']:
                if st['label'] in ('סיכום',):
                    continue
                lines.append(f"{st['label']}:")
                lines += [f'• {x}' for x in st.get('items', [])]
                if st.get('body'):
                    lines.append(st['body'])
            ap = {'label': f'עוד רעיונות מחוברת הערבים — {n["canon"]}', 'content': '\n'.join(lines)}
            ex.setdefault('appendices', [])
            if not any(a['label'] == ap['label'] for a in ex['appendices']):
                ex['appendices'].append(ap)
                appended.append(eid)
            continue
        r = to_record(n, i)
        if r['id'] in ids:
            continue
        check_activity(r, ids)
        ids.add(r['id'])
        new.append(r)
    acts += new
    save('activities', acts)
    print('new', len(new), 'appended to existing', len(appended), appended)
    print([r['title'] for r in new])
