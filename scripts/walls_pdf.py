# -*- coding: utf-8 -*-
"""מפיק את "ספר הגלופות והקירות" כקובץ HTML מעוצב (להמרה ל-PDF בכרום).
מקורות הנתונים: movementNames.json (המשפטים של רוני), wallIdeas.json ו-gluphotGuide.json (נוצרים ב-walls_pack.py).
ההצעות החדשות למשפטים (CANDIDATES) מסומנות בספר כ"הצעה לבחירה", ולא מפורסמות באתר בלי אישור."""
import json, os, html, datetime

ROOT = os.path.join(os.path.dirname(__file__), '..')
D = lambda n: json.load(open(os.path.join(ROOT, 'src', 'data', n), encoding='utf-8'))
MOV, IDEAS, GUIDE = D('movementNames.json'), D('wallIdeas.json'), D('gluphotGuide.json')
e = html.escape

# הצעות חדשות לבחירה, לפי תנועה ושם שכבה (נכתבו לפי הרגיסטר של רוני: הכלאות, אותיות בסוגריים, משחקי משמעות, הצהרות)
CANDIDATES = {
    'ezra': {
        'נטעים': ['נטעים בכיף – אל תנסו לעקור אותנו', 'נ(ט)עים – נעים להכיר, טעים להישאר', 'לא נטעה: נטעים'],
        'עיינות': ['עיינות: עין על המטרה, עין על הכיבוד', 'עיינות – אצלנו כל שבוע נובע משהו חדש', 'ע(י)ינות – עין בעין עם הכיף'],
        'נירים': ['אבן, נייר ומספריים – נירים תמיד ניצחו', 'נירים: אצלנו לא צריך מחק', 'נ(י)רים – חלק מהסניף, חלק מהנייר'],
        'נתיבות': ['נתיבות – בלי וייז מגיעים אלינו (בערך)', 'כל הדרכים מובילות אלינו, ואנחנו מובילים אתכם', 'נתיבות: הגענו, התבלבלנו, נשארנו'],
        'נחלים': ['נחלים – מי שלא נחל הצלחה לא היה אצלנו', 'נחלים: לא נעצרים, לא מתייבשים', 'נחלים בלי גשם: אנחנו זורמים בכל מצב'],
        'נחליאל': ['נחליאל – חצי נחל, חצי מלאך', 'נחליאל: כל הכבוד לאל, וקצת גם לנו', 'נחליא(ל) – ל(א) נעים להתעסק איתנו'],
        'אורות': ['אורות – דלקנו על עצמנו', 'אורות: כשהסניף חשוך, אנחנו הלד', 'אורות – זורקים אור, לא זורקים אשפה'],
    },
    'bnei-akiva': {
        'זרעים': ['זרעים – אל תדרכו, אנחנו עוד נצמח', 'זרעים: קטנים בגודל, ענקיים בפוטנציאל', 'זרע(ים): ים של אנרגיה'],
        'נבטים': ['נבטים נוטים לכיוון האור, אנחנו נוטים לכיוון הפיצה', 'נבטים – כל גדול התחיל קטן וירוק', 'נבטים בסלט? אנחנו המנה העיקרית'],
        'ניצנים': ['ניצנים – פורחים גם בלי להשקות', 'ניצנים: נציץ, ונפרח', 'ניצ(ח)נים – הכל מתחיל בניצן'],
        'מעלות': ['מעלות – עולים בלי מעלית', 'מעלות: מי שלא בעלייה, בירידה', 'מעלות בכל המעלות'],
        'מעפילים': ['מעפילים – אין מי שיעצור אותנו (חוץ מארוחת צהריים)', 'מעפילים: עולים על ספינה, יורדים על ההר', 'מעפילים את כולם, מעפילים את עצמנו'],
        'הרא״ה': ['הרא״ה: ה׳לכנו, ר׳צינו, א׳הבנו, ה׳צלחנו', 'הרא״ה – ראה והתפעל', 'הרא״ה – הראנו, ראינו, ניצחנו'],
    },
    'ariel': {
        'גלעד': ['גלעד – גל אחרי גל עד שהגענו', 'גל-עד: הגל הכי גדול בים'],
        'דביר': ['דביר – דבר אחד בטוח: כיף', 'דביר: דבר ברור, כיף ברור'],
        'הראל': ['הראל – הר-אל: מגיעים גבוה', 'הראל – ה(ר)אל שבשכונה'],
        'נווה': ['נווה – נווה מדבר בלב הסניף', 'נווה: אצלנו תמיד נעים ותמיד רענן'],
        'מעוז': ['מעוז – המעוז האחרון של הכיף', 'מעוז: אי אפשר לכבוש אותנו, רק להזמין'],
        'נחלה': ['נחלה – כיף שעובר בירושה', 'נחלה: השטח שלנו, החוקים שלנו'],
    },
}

# צבעי העיצוב (כמו באתר)
INK, FLAME, CREAM = '#241C11', '#D96A2B', '#FFF8E8'
PART_COL = ['#D96A2B', '#7A9A3E', '#C24270', '#6B5AA6', '#3E7EA6']


def chips(*items):
    return ''.join(f'<span class="chip">{e(i)}</span>' for i in items if i)


def mascot(size=120):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2C85B"/><stop offset="1" stop-color="#D96A2B"/></linearGradient></defs>'
            f'<path d="M40 6c10 14 26 24 26 42a26 26 0 0 1-52 0c0-8 3-14 7-19 2 7 7 10 11 7-5-13 1-22 8-30z" fill="url(#g)" stroke="{INK}" stroke-width="2.4" stroke-linejoin="round"/>'
            f'<circle cx="32" cy="52" r="4" fill="{INK}"/><circle cx="50" cy="52" r="4" fill="{INK}"/><path d="M32 62c3 3 13 3 16 0" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>')


def part_head(n, title, sub, col):
    return f'<header class="parthead" style="--c:{col}"><span class="partnum">{n}</span><div><h1>{e(title)}</h1><p>{e(sub)}</p></div></header>'


def build():
    today = datetime.date.today().strftime('%d.%m.%Y')
    out = []

    # ---- שער ----
    out.append(f'''<section class="cover">
<div class="blob b1"></div><div class="blob b2"></div><div class="sq s1"></div><div class="sq s2"></div><div class="sq s3"></div>
<div class="cover-body">{mascot(150)}
<div class="cover-kicker">המדריך למדריך</div>
<h1>ספר הגלופות והקירות</h1>
<p>רעיונות לשמות שכבות, לחולצות ולקירות הסניף</p>
<div class="cover-hand">גלופות שאפשר להדפיס בגאווה</div>
</div><div class="cover-foot">{today}</div></section>''')

    # ---- איך משתמשים ----
    n_lines = sum(len(g['slogans']) for m in MOV for g in m['groups'])
    n_new = sum(len(v) for m in CANDIDATES.values() for v in m.values())
    out.append(f'''<section class="page"><div class="pagehead">איך משתמשים בספר</div>
<div class="intro-grid">
<div class="card"><b>{n_lines}</b><span>משפטים של רוני, כבר באתר</span></div>
<div class="card"><b>{n_new}</b><span>הצעות חדשות לבחירה</span></div>
<div class="card"><b>{len(IDEAS['ideas'])}</b><span>רעיונות לקירות</span></div>
<div class="card"><b>7</b><span>שיטות לכתיבת גלופה</span></div></div>
<p class="lead">הספר מחולק לחמישה חלקים. הוא נכתב כדי להשתמש בו: לפתוח, לבחור, לדפדף עם הצוות ולהחליט.</p>
<ol class="toc">
<li><b>איך כותבים גלופה</b><span>שבע שיטות, חמישה צעדים ורשימת בדיקה</span></li>
<li><b>שמות ומשפטים לפי תנועה</b><span>עזרא, בני עקיבא ואריאל. המשפטים של רוני והצעות חדשות</span></li>
<li><b>משפטים לכל השכבות</b><span>ותבניות ריקות שאפשר להתאים</span></li>
<li><b>רעיונות לקירות בסניף</b><span>{len(IDEAS['ideas'])} רעיונות עם צעדים, חומרים וטיפים</span></li>
<li><b>איך עושים קיר, ודפי עבודה</b><span>שלבים, בטיחות ודף תכנון להדפסה</span></li></ol>
<div class="legend"><span class="tag tag-hers">של רוני</span> משפט שכבר מפורסם באתר. <span class="tag tag-new">הצעה</span> משפט חדש לבחירה. לא מפרסמים אותו בלי אישור, ולא מדפיסים בלי בדיקה מול הרכז.</div>
<p class="small">חשוב: שמות השכבות משתנים משנה לשנה ומסניף לסניף. לפני שמדפיסים שם, גלופה או שלט, בודקים מול הרכז או הסניף.</p>
</section>''')

    # ---- חלק 1: איך כותבים גלופה ----
    out.append(f'<section class="page part">{part_head("1", "איך כותבים גלופה", "שבע שיטות, חמישה צעדים ורשימת בדיקה", PART_COL[0])}')
    out.append('<div class="grid2">')
    for i, t in enumerate(GUIDE['types']):
        ex = ''.join(f'<li>{e(x)}</li>' for x in t['examples'])
        out.append(f'<div class="card typecard" style="--c:{PART_COL[i % 5]}"><h3>{e(t["name"])}</h3><p>{e(t["how"])}</p><ul class="ex">{ex}</ul><small>{e(t["tip"])}</small></div>')
    out.append('</div>')
    out.append('<div class="grid2"><div class="card"><h3>חמישה צעדים</h3><ol class="steps">' + ''.join(f'<li><b>{e(t)}</b> {e(d)}</li>' for t, d in GUIDE['steps']) + '</ol></div>')
    out.append('<div class="card"><h3>לפני שמדפיסים, בודקים</h3><ul class="check">' + ''.join(f'<li>{e(c)}</li>' for c in GUIDE['checklist']) + '</ul></div></div>')
    out.append('<div class="card"><h3>טיפים להדפסה על חולצה</h3><ul class="check cols2">' + ''.join(f'<li>{e(c)}</li>' for c in GUIDE['print']) + '</ul></div></section>')

    # ---- חלק 2: לפי תנועה ----
    out.append(f'<section class="page part">{part_head("2", "שמות ומשפטים לפי תנועה", "המשפטים של רוני, ולצידם הצעות חדשות לבחירה", PART_COL[1])}')
    for m in MOV:
        if m['id'] == 'general':
            continue
        out.append(f'<div class="movement"><h2>{e(m["movement"])}</h2><p class="small">{e(m["intro"])}</p>')
        for g in m['groups']:
            hers = g['slogans']
            new = CANDIDATES.get(m['id'], {}).get(g['name'], [])
            lines = ''.join(f'<li><span class="tag tag-hers">של רוני</span>{e(s)}</li>' for s in hers) + ''.join(f'<li><span class="tag tag-new">הצעה</span>{e(s)}</li>' for s in new)
            out.append(f'<div class="layer"><div class="layername"><b>{e(g["name"])}</b><small>כיתה {e(g["grade"])}</small></div><ul class="lines">{lines or "<li class=empty>עוד אין משפטים</li>"}</ul></div>')
        if m.get('fixed'):
            out.append(f'<div class="fixed"><b>{e(m["fixedTitle"])}:</b> {chips(*m["fixed"])}</div>')
        for n in m['notes']:
            out.append(f'<p class="note">• {e(n)}</p>')
        out.append('</div>')
    out.append('</section>')

    # ---- חלק 3: כללי ----
    gen = [g for m in MOV if m['id'] == 'general' for g in m['groups']][0]['slogans']
    templates = [s for s in gen if '____' in s]
    plain = [s for s in gen if '____' not in s]
    out.append(f'<section class="page part">{part_head("3", "משפטים לכל השכבות", "משפטים שמתאימים לכולם, ותבניות ריקות שמתאימים לשם שלכם", PART_COL[2])}')
    out.append('<div class="grid2">' + ''.join(f'<div class="card quote">{e(s)}<span class="tag tag-hers">של רוני</span></div>' for s in plain) + '</div>')
    out.append('<h2 class="sub">תבניות למילוי</h2><div class="grid2">' + ''.join(f'<div class="card quote tmpl">{e(s)}<span class="tag tag-hers">של רוני</span></div>' for s in templates) + '</div>')
    out.append('<h2 class="sub">רעיונות לתבניות חדשות</h2><div class="grid2">' + ''.join(f'<div class="card quote tmpl">{e(s)}<span class="tag tag-new">הצעה</span></div>' for s in [
        'כל הדרכים מובילות אל ____', 'אם חשבתם שהכיף נגמר, לא פגשתם את ____', 'מה כל כך מיוחד ב____? הכל.', '____: מקום קטן, לב ענק', 'שנה חדשה, ____ חדשים, אותו כיף', 'לא תמצאו את זה בספרי ההדרכה – רק ב____']) + '</div></section>')

    # ---- חלק 4: קירות ----
    head4 = part_head("4", "רעיונות לקירות בסניף", str(len(IDEAS['ideas'])) + " רעיונות לפי סוג, עם צעדים, חומרים וטיפ", PART_COL[3])
    out.append('<section class="page part">' + head4)
    kinds = []
    for i in IDEAS['ideas']:
        if i['kind'] not in kinds:
            kinds.append(i['kind'])
    for k in kinds:
        out.append(f'<h2 class="sub">{e(k)}</h2><div class="grid2">')
        for i in [x for x in IDEAS['ideas'] if x['kind'] == k]:
            out.append(f'''<div class="card idea"><div class="idea-top"><h3>{e(i["title"])}</h3><div>{chips(i["difficulty"], i["budget"])}</div></div>
<p>{e(i["summary"])}</p><ol class="steps">{"".join(f"<li>{e(s)}</li>" for s in i["steps"])}</ol>
<div class="meta"><b>חומרים:</b> {e(" · ".join(i["materials"]))}<br><b>זמן:</b> {e(i["time"])}</div><div class="tip"><b>טיפ:</b> {e(i["tip"])}</div></div>''')
        out.append('</div>')
    out.append('</section>')

    # ---- חלק 5: תהליך ודפי עבודה ----
    out.append(f'<section class="page part">{part_head("5", "איך עושים קיר", "שמונה שלבים, ואחריהם דף תכנון להדפסה", PART_COL[4])}')
    out.append('<div class="grid2">' + ''.join(f'<div class="card"><h3>{e(t)}</h3><p>{e(d)}</p></div>' for t, d in IDEAS['process']) + '</div>')
    out.append('''<div class="card plan"><h3>דף תכנון קיר</h3>
<div class="plan-grid"><label>שם הקיר</label><i></i><label>שכבה או אחראים</label><i></i><label>נושא</label><i></i><label>מיקום</label><i></i><label>חומרים</label><i></i><label>תקציב</label><i></i><label>אישור ממי?</label><i></i><label>תאריך סיום</label><i></i></div>
<label class="big">סקיצה</label><div class="sketch"></div>
<label class="big">מי עושה מה</label><div class="lines3"><i></i><i></i><i></i></div></div>''')
    out.append('''<div class="card note-end"><h3>מקורות והערת זכויות</h3><p>כל הרעיונות והמשפטים החדשים בספר נכתבו במילים שלנו, ואין בהם העתקה של טקסט מאתר אחר. כמה כיווני עבודה כלליים (ציור על דפים גדולים במקום על הקיר, בקשת אישור לקיר ציבורי, ושיתוף החניכים בהחלטות) נמצאו בחיפוש ברשת, ושולבו כרעיונות כלליים בלבד. המשפטים של רוני שייכים לרוני. אם משתמשים ברמזים לדמויות, לסרטים או לשירים, מעדיפים רמז ולא העתקה של לוגו או מילים מוגנות.</p></div></section>''')

    return '\n'.join(out)


CSS = '''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Heebo', sans-serif; color: %(INK)s; background: %(CREAM)s; font-size: 10.6pt; line-height: 1.55; direction: rtl; }
h1, h2, h3 { font-family: 'Rubik', sans-serif; margin: 0; line-height: 1.2; }
.cover { position: relative; width: 210mm; height: 297mm; overflow: hidden; break-after: page; background: %(CREAM)s; display: flex; align-items: center; justify-content: center; text-align: center; }
.blob { position: absolute; border-radius: 52%% 48%% 60%% 40%% / 50%% 42%% 58%% 50%%; }
.b1 { width: 130mm; height: 130mm; background: #F2C85B; top: -30mm; left: -35mm; }
.b2 { width: 120mm; height: 120mm; background: #6B5AA6; bottom: -35mm; right: -30mm; opacity: .92; }
.sq { position: absolute; border: 2.2mm solid %(INK)s; border-radius: 6mm; }
.s1 { width: 46mm; height: 46mm; background: #7A9A3E; transform: rotate(14deg); bottom: 30mm; left: 14mm; }
.s2 { width: 30mm; height: 30mm; background: #C24270; transform: rotate(-9deg); bottom: 14mm; left: 46mm; }
.s3 { width: 34mm; height: 34mm; background: #3E7EA6; transform: rotate(-12deg); top: 38mm; right: 14mm; }
.cover-body { position: relative; z-index: 2; padding: 0 22mm; }
.cover-kicker { margin-top: 10mm; font-family: 'Rubik'; font-weight: 800; font-size: 17pt; letter-spacing: .02em; }
.cover h1 { font-size: 44pt; font-weight: 900; margin: 6mm 0; line-height: 1.08; }
.cover p { font-size: 15pt; margin: 0 0 8mm; color: #4a3d2a; font-weight: 500; }
.cover-hand { font-family: 'Gveret Levin', cursive; font-size: 27pt; color: %(FLAME)s; }
.cover-foot { position: absolute; bottom: 10mm; width: 100%%; text-align: center; font-size: 10pt; color: #6b5d45; z-index: 2; }
.page { width: 210mm; padding: 16mm 15mm 16mm; break-before: page; }
.page.part { break-before: page; }
.pagehead { font-family: 'Rubik'; font-weight: 900; font-size: 24pt; margin-bottom: 8mm; }
.parthead { display: flex; align-items: center; gap: 6mm; margin: 0 0 8mm; padding: 6mm 7mm; background: var(--c); color: #fff; border: .7mm solid %(INK)s; border-radius: 6mm; box-shadow: 1.6mm 1.6mm 0 %(INK)s; }
.parthead h1 { font-size: 24pt; font-weight: 900; }
.parthead p { margin: 1mm 0 0; font-size: 11pt; opacity: .95; }
.partnum { flex: none; width: 15mm; height: 15mm; border-radius: 50%%; background: #fff; color: %(INK)s; display: flex; align-items: center; justify-content: center; font: 900 20pt 'Rubik'; border: .7mm solid %(INK)s; }
.lead { font-size: 12pt; margin: 0 0 6mm; }
.small { font-size: 9.6pt; color: #5b4e37; margin: 2mm 0; }
.note { font-size: 9.4pt; color: #5b4e37; margin: 1mm 0; }
.intro-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 4mm; margin-bottom: 7mm; }
.intro-grid .card { text-align: center; padding: 5mm 3mm; }
.intro-grid b { display: block; font: 900 24pt 'Rubik'; color: %(FLAME)s; }
.intro-grid span { font-size: 9.4pt; color: #5b4e37; }
.toc { padding: 0; margin: 0 0 6mm; list-style: none; counter-reset: t; }
.toc li { counter-increment: t; display: flex; align-items: baseline; gap: 4mm; padding: 3mm 0; border-bottom: .3mm dashed #b9a98a; }
.toc li::before { content: counter(t); font: 900 16pt 'Rubik'; color: %(FLAME)s; width: 8mm; }
.toc b { font-family: 'Rubik'; font-size: 12.5pt; }
.toc span { color: #5b4e37; font-size: 10pt; margin-inline-start: auto; }
.legend { padding: 4mm 5mm; border: .5mm solid %(INK)s; border-radius: 4mm; background: #fff; font-size: 10pt; margin: 6mm 0; line-height: 2; }
.card { background: #fff; border: .5mm solid %(INK)s; border-radius: 4mm; padding: 4.5mm 5mm; break-inside: avoid; }
.grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-bottom: 5mm; }
h2.sub { break-after: avoid; font-size: 15pt; font-weight: 800; margin: 7mm 0 3mm; padding-inline-start: 3mm; border-inline-start: 1.6mm solid %(FLAME)s; }
.card h3 { font-size: 12.5pt; font-weight: 800; margin-bottom: 1.5mm; }
.card p { margin: 0 0 2mm; font-size: 10pt; color: #4a3d2a; }
.typecard { border-top: 2.2mm solid var(--c); }
.ex { margin: 2mm 0; padding-inline-start: 5mm; font-weight: 700; font-size: 10pt; }
.typecard small { color: #6b5d45; font-size: 9pt; }
.steps { margin: 1mm 0 2mm; padding-inline-start: 5mm; font-size: 9.8pt; }
.steps li { margin-bottom: 1mm; }
.check { margin: 0; padding-inline-start: 5mm; font-size: 9.8pt; }
.check li { margin-bottom: 1.2mm; }
.cols2 { columns: 2; column-gap: 8mm; }
.movement { margin-bottom: 6mm; }
.movement h2 { font-size: 19pt; font-weight: 900; margin-bottom: 1mm; color: %(FLAME)s; }
.layer { display: grid; grid-template-columns: 24mm 1fr; gap: 4mm; align-items: start; padding: 2.4mm 0; border-bottom: .3mm solid #e4d9bc; break-inside: avoid; }
.layername b { font: 800 13pt 'Rubik'; display: block; }
.layername small { color: #6b5d45; font-size: 8.8pt; }
.lines { list-style: none; margin: 0; padding: 0; }
.lines li { margin-bottom: 1.2mm; font-size: 10.2pt; font-weight: 500; }
.lines li.empty { color: #9a8c70; }
.tag { display: inline-block; font-size: 7.6pt; font-weight: 800; padding: .3mm 2mm; border-radius: 99px; margin-inline-end: 2mm; vertical-align: middle; }
.tag-hers { background: #E7EFD6; color: #3E5219; border: .3mm solid #7A9A3E; }
.tag-new { background: #FBF0CE; color: #7a5a00; border: .3mm solid #E8B93C; }
.fixed { margin: 3mm 0; font-size: 10pt; }
.chip { display: inline-block; padding: .4mm 2.4mm; margin: 0 0 1mm 1.4mm; border-radius: 99px; background: #F6DDE7; color: #7a1f43; font-size: 9pt; font-weight: 700; border: .3mm solid #C24270; }
.quote { font: 800 12pt 'Rubik'; line-height: 1.45; display: flex; flex-direction: column; gap: 2mm; align-items: flex-start; }
.tmpl { background: #F4EEFB; }
.idea { padding-top: 4mm; }
.idea-top { display: flex; justify-content: space-between; gap: 3mm; align-items: flex-start; margin-bottom: 1.5mm; }
.idea-top h3 { font-size: 12pt; }
.idea .chip { background: #FBF0CE; border-color: #E8B93C; color: #5b4300; }
.meta { font-size: 9.2pt; color: #4a3d2a; margin-top: 1mm; }
.tip { margin-top: 2mm; padding: 2mm 3mm; background: #FBF0CE; border-radius: 3mm; font-size: 9.2pt; }
.plan { margin-top: 5mm; }
.plan-grid { display: grid; grid-template-columns: 30mm 1fr 30mm 1fr; gap: 3mm 4mm; align-items: end; margin: 3mm 0; }
.plan-grid label, label.big { font-weight: 800; font-size: 9.6pt; }
.plan-grid i { display: block; border-bottom: .3mm solid %(INK)s; height: 6mm; }
.sketch { height: 52mm; border: .4mm dashed %(INK)s; border-radius: 3mm; margin: 2mm 0 4mm; }
.lines3 i { display: block; border-bottom: .3mm solid %(INK)s; height: 7mm; }
.note-end { margin-top: 5mm; background: #F5F0E1; }
.note-end p { font-size: 9.4pt; }
'''


def main():
    body = build()
    html_doc = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>ספר הגלופות והקירות — המדריך למדריך</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800;900&family=Heebo:wght@400;500;700;800&family=Gveret+Levin&display=swap" rel="stylesheet">
<style>{CSS % dict(INK=INK, FLAME=FLAME, CREAM=CREAM)}</style></head><body>{body}</body></html>'''
    out = os.path.join(ROOT, 'docs', 'sefer-glufot-vekirot.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(html_doc)
    print('written', out, len(html_doc))


if __name__ == '__main__':
    main()
