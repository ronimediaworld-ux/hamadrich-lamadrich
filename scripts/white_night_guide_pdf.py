# -*- coding: utf-8 -*-
"""מדריך PDF: איך הלילה הלבן יהפוך למשמעותי. מדריך תכנון לצוות. נבנה כ-HTML ומודפס ל-PDF בכרום."""
import os, html

ROOT = os.path.join(os.path.dirname(__file__), '..')
e = html.escape

CSS = '''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
:root { --ink:#1F1A2E; --night:#16142B; --flame:#D96A2B; --cream:#FFF8E8; --paper:#FFFDF7; --soft:#4A4258; --line:#E7DCC4; --moon:#F3D98B; --sage:#5E8C6A; --plum:#6B5AA6; }
body { margin:0; font-family:'Rubik','Heebo',sans-serif; color:var(--ink); direction:rtl; font-size:11.5pt; line-height:1.55; }
.page { width:210mm; height:297mm; padding:16mm 17mm 14mm; background:var(--paper); break-after:page; position:relative; overflow:hidden; }
.page:last-child { break-after:auto; }
.cover { background:var(--night); color:var(--cream); padding:0; }
.cover .sky { position:absolute; inset:0; }
.cover .txt { position:absolute; right:20mm; left:20mm; top:92mm; }
.cover .eyebrow { font-size:12pt; letter-spacing:.14em; color:var(--moon); font-weight:500; }
.cover h1 { font-size:46pt; line-height:1.08; margin:6mm 0 8mm; font-weight:800; text-wrap:balance; }
.cover h1 em { font-style:normal; color:var(--moon); }
.cover .sub { font-size:15pt; line-height:1.5; max-width:130mm; color:#DCD6EA; }
.cover .foot { position:absolute; bottom:14mm; right:20mm; left:20mm; font-size:10.5pt; color:#A9A2C0; }
h2 { font-size:22pt; line-height:1.2; margin:0 0 3mm; font-weight:800; text-wrap:balance; }
h2 small { display:block; font-size:10.5pt; font-weight:500; color:var(--flame); letter-spacing:.1em; margin-bottom:1.5mm; }
h3 { font-size:13.5pt; margin:0 0 1mm; font-weight:700; }
p { margin:0 0 3mm; }
.lead { font-size:13.5pt; line-height:1.6; color:var(--soft); max-width:165mm; }
.q { background:var(--night); color:var(--cream); border-radius:4mm; padding:7mm 8mm; margin:5mm 0; }
.q b { color:var(--moon); }
.q .big { font-size:18pt; font-weight:700; line-height:1.35; }
.three { display:grid; grid-template-columns:repeat(3,1fr); gap:4mm; margin:4mm 0 6mm; }
.three div { border:.4mm solid var(--line); background:#fff; border-radius:3mm; padding:4mm 4.5mm; }
.three b { display:block; font-size:14pt; color:var(--flame); margin-bottom:1mm; }
.principles { display:grid; grid-template-columns:1fr 1fr; gap:4mm 5mm; margin-top:3mm; }
.pr { padding:3.5mm 4.5mm; background:#fff; border:.4mm solid var(--line); border-radius:3mm; }
.pr h3 { color:var(--ink); }
.pr p { margin:0; font-size:10.8pt; color:var(--soft); }
.curve { margin:2mm 0 3mm; max-height:62mm; }
table { width:100%; border-collapse:collapse; font-size:10.4pt; }
th { text-align:right; background:var(--night); color:var(--cream); padding:2mm 3mm; font-weight:600; }
td { padding:1.5mm 3mm; border-bottom:.3mm solid var(--line); vertical-align:top; }
tr.hl td { background:#FFF1D6; }
td.t { white-space:nowrap; font-weight:700; color:var(--flame); width:21mm; font-variant-numeric:tabular-nums; }
td.k { font-weight:700; width:34mm; }
.tag { display:inline-block; font-size:9pt; padding:.3mm 2mm; border-radius:6mm; background:var(--cream); border:.3mm solid var(--line); margin-left:1.5mm; color:var(--soft); }
.note { border-right:1.6mm solid var(--flame); background:#FFF3E2; padding:3mm 5mm; border-radius:2mm; margin:4mm 0; font-size:10.8pt; }
.cols { display:grid; grid-template-columns:1fr 1fr; gap:6mm; }
ul { margin:0 0 3mm; padding:0 5mm 0 0; }
li { margin-bottom:1.4mm; }
.wrong li { color:var(--soft); }
.check { list-style:none; padding:0; }
.check li { padding-right:7mm; position:relative; }
.check li::before { content:''; position:absolute; right:0; top:1.4mm; width:3.8mm; height:3.8mm; border:.45mm solid var(--ink); border-radius:1mm; }
.ages td.k { width:28mm; }
.pg { position:absolute; bottom:8mm; left:17mm; font-size:9pt; color:#9A9080; }
'''


def stars():
    import random
    random.seed(7)
    out = []
    for _ in range(90):
        x, y = random.uniform(0, 210), random.uniform(0, 297)
        r = random.choice([.25, .3, .4, .55])
        o = random.choice([.35, .5, .7, .9])
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="#FFF8E8" opacity="{o}"/>')
    return ''.join(out)


def cover():
    return f'''<section class="page cover">
<svg class="sky" viewBox="0 0 210 297" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
<defs><radialGradient id="glow" cx="50%" cy="100%" r="70%"><stop offset="0" stop-color="#D96A2B" stop-opacity=".55"/><stop offset="1" stop-color="#16142B" stop-opacity="0"/></radialGradient></defs>
<rect width="210" height="297" fill="#16142B"/><rect width="210" height="297" fill="url(#glow)"/>
{stars()}
<circle cx="160" cy="52" r="17" fill="#F3D98B"/><circle cx="168" cy="46" r="15" fill="#16142B"/>
<path d="M0 297 L0 262 Q40 240 78 258 T150 250 T210 256 L210 297Z" fill="#0E0D1E"/>
</svg>
<div class="txt"><div class="eyebrow">המדריך למדריך · מדריך לצוות</div>
<h1>איך הלילה הלבן <em>יהפוך למשמעותי</em></h1>
<div class="sub">לילה של צבע, חזרות ואוכל, שבו כל גיל מסיים בשעה אחרת. איך מוודאים שכל חניך מרגיש חלק ממשהו ולא רק עוזר.</div></div>
<div class="foot">hamadrich-lamadrich.onrender.com</div></section>'''


def page_why():
    principles = [
        ('מטרה אחת לכל הלילה', 'למשל "בונים את הבית שלנו לשנה הבאה". כל גיל צריך לדעת איך הוא חלק מהמטרה, ולא רק מה לעשות.'),
        ('כל גיל עושה משהו אמיתי', 'משימה שרואים בבוקר, מותאמת לגיל. הכי גרוע זה "תחכו בצד עד שנגמר".'),
        ('רגע משותף בהתחלה ובאמצע', 'מעגל פתיחה וארוחה אחת לכולם. אחר כך הגילאים מתפזרים ויוצאים בזה אחר זה.'),
        ('כל יציאה היא טקס קטן', 'מי שיוצא מקבל תודה בשמו ומוסר את המכחול לגיל שנשאר. כך אף קבוצה לא "נעלמת".'),
        ('מערבבים גילאים', 'צוות אחד כולל חניך גדול וקטן. הגדולים מרגישים אחריות, הקטנים שייכות.'),
        ('כל מעשה מקבל משפט', 'לפני צביעה או חזרה, עשר שניות שאומרות למה זה חשוב. זה ההבדל בין עבודה ללילה משמעותי.'),
    ]
    cards = ''.join(f'<div class="pr"><h3>{e(t)}</h3><p>{e(b)}</p></div>' for t, b in principles)
    return f'''<section class="page"><h2><small>לפני שמתכננים</small>הלילה הלבן, ומה יכול להשתבש בו</h2>
<p class="lead">בלילה לבן יש הרבה עבודה: קירות לצבוע, חזרות להספיק, אווירה לבנות ואוכל להגיש. כשלא מתכננים, כל גיל עסוק בפינה שלו, חלק מהחניכים מחכים, ומי שהולך הביתה מוקדם לא יודע מה הוא תרם.</p>
<div class="three"><div><b>שייכות</b>כל חניך מרגיש שהוא חלק מהבית שנבנה, גם אם הוא צבע רק קיר קטן.</div><div><b>אחריות</b>גדולים מנהלים, קטנים תורמים. אף אחד לא רק "עוזר".</div><div><b>זיכרון</b>הקיר, השיר או הארוחה נשארים בסניף גם בשנה הבאה, עם סיפור.</div></div>
<div class="q"><div class="big">מה אנחנו רוצים שחניך בן שבע ובן שבע־עשרה יגידו בבוקר?</div>
<p style="margin:3mm 0 0;color:#DCD6EA">נסחו משפט אחד שמתאים לכולם, למשל: <b>"אני בניתי את הסניף הזה"</b> או <b>"היה לילה שבו כולנו עשינו משהו ביחד"</b>. כל שלב בלוז נבחן מולו.</p></div>
<h2 style="font-size:17pt;margin-top:6mm">ששה עקרונות ללילה שנשאר</h2>
<div class="principles">{cards}</div>
<div class="pg">2</div></section>'''


def lanes_svg():
    # ציר זמן מימין (18:00) לשמאל (02:00), לפי הכיוון העברי
    XR, SC = 232, 0.455  # נקודת 18:00 והיחס לדקה
    X = lambda hh, mm=0: XR - ((hh - 18) % 24 * 60 + mm) * SC
    def bar(x1, x2, y, col, txt='', tc='#fff'):
        return f'<rect x="{x2:.1f}" y="{y}" width="{x1-x2:.1f}" height="11" rx="2" fill="{col}"/>' + (f'<text x="{(x1+x2)/2:.1f}" y="{y+7.7}" font-size="5.2" fill="{tc}" text-anchor="middle">{txt}</text>' if txt else '')
    OPEN, WORK, MEAL, SEND, CLOSE = '#6B5AA6', '#D96A2B', '#5E8C6A', '#C79A1C', '#16142B'
    lanes = [
        ('א׳־ג׳', 18, 30, 21, 0, [(18, 30, 19, 0, OPEN, ''), (19, 0, 20, 0, WORK, 'מלאכה קלה'), (20, 0, 20, 45, MEAL, 'ארוחה'), (20, 45, 21, 0, SEND, '')]),
        ('ד׳־ו׳', 18, 30, 22, 30, [(18, 30, 19, 0, OPEN, ''), (19, 0, 20, 0, WORK, 'עבודה'), (20, 0, 20, 45, MEAL, 'ארוחה'), (20, 45, 22, 15, WORK, 'עבודה וחזרות'), (22, 15, 22, 30, SEND, '')]),
        ('ז׳־ט׳', 18, 30, 24, 0, [(18, 30, 19, 0, OPEN, ''), (19, 0, 20, 0, WORK, 'עבודה'), (20, 0, 20, 45, MEAL, 'ארוחה'), (20, 45, 23, 30, WORK, 'קירות, חזרות, אווירה'), (23, 30, 24, 0, SEND, '')]),
        ('י׳־י״ב', 18, 30, 26, 0, [(18, 30, 19, 0, OPEN, ''), (19, 0, 20, 0, WORK, 'עבודה'), (20, 0, 20, 45, MEAL, 'ארוחה'), (20, 45, 24, 30, WORK, 'ניהול, קירות, חזרות, תאורה'), (24, 30, 25, 30, MEAL, 'אוכל חם'), (25, 30, 26, 0, CLOSE, 'סיום')]),
    ]
    out = []
    y0 = 14
    for i in range(0, 9):  # קווי שעות
        hh = 18 + i
        x = X(hh)
        out.append(f'<line x1="{x:.1f}" y1="8" x2="{x:.1f}" y2="{y0+len(lanes)*18+2}" stroke="#E7DCC4" stroke-width=".4"/>')
        out.append(f'<text x="{x:.1f}" y="6" font-size="5.6" fill="#4A4258" text-anchor="middle">{hh%24:02d}:00</text>')
    for j, (name, h1, m1, h2, m2, segs) in enumerate(lanes):
        y = y0 + j * 18
        out.append(f'<text x="{XR+22}" y="{y+8.2}" font-size="6.6" font-weight="700" fill="#1F1A2E" text-anchor="middle">{name}</text>')
        for (a1, a2, b1, b2, col, txt) in segs:
            out.append(bar(X(a1, a2), X(b1, b2), y, col, txt))
    out.append(f'<text x="{XR+22}" y="{y0+len(lanes)*18+9}" font-size="6.6" font-weight="700" fill="#1F1A2E" text-anchor="middle">צוות</text>')
    out.append(bar(X(18), X(26), y0 + len(lanes) * 18 + 1, '#8A8299', 'לאורך כל הלילה'))
    legend = [(OPEN, 'מעגל פתיחה לכולם'), (WORK, 'עבודה וחזרות'), (MEAL, 'ארוחה'), (SEND, 'טקס יציאה'), (CLOSE, 'סיבוב סיום')]
    lg = '<div style="display:flex;gap:4mm;flex-wrap:wrap;font-size:9.5pt;color:#4A4258;margin-bottom:3mm">' + ''.join(f'<span><i style="display:inline-block;width:3mm;height:3mm;border-radius:.6mm;background:{c};margin-left:1.5mm;vertical-align:-.4mm"></i>{t}</span>' for c, t in legend) + '</div>'
    return f'''<svg viewBox="0 0 270 {y0+len(lanes)*18+16}" width="100%" xmlns="http://www.w3.org/2000/svg" style="margin:2mm 0 1mm">{''.join(out)}</svg>{lg}'''


def page_structure():
    rows = [
        ('א׳־ג׳', 'טביעות כפות ידיים, שלטים וקישוטים פשוטים, עזרה בקערות וצלחות, חלק קצר ופשוט בחזרה. עד כ־21:00.'),
        ('ד׳־ו׳', 'צביעת קירות נמוכים עם מדריך, שרשראות ופנסים, הגשת אוכל, חלק קבוצתי בחזרה. עד כ־22:30.'),
        ('ז׳־ט׳', 'צביעת הקירות המרכזיים, חזרות מלאות, מנהלי תחנה של הצעירים יותר. עד כ־24:00.'),
        ('י׳־י״ב', 'ניהול חזרות, הקיר הסופי, מוזיקה ותאורה, מעבר אחרון, ניקיון וסיבוב סיום. עד סוף הלילה.'),
    ]
    trs = ''.join(f'<tr><td class="k">{a}</td><td>{e(b)}</td></tr>' for a, b in rows)
    return f'''<section class="page"><h2><small>מבנה הלילה</small>כל גיל מסיים בשעה אחרת, ואף אחד לא נשכח</h2>
<p class="lead" style="margin-bottom:1mm">הלילה נבנה משני רגעים לכולם (פתיחה וארוחה) ומטקס יציאה לכל גיל. השעות כאן הן דוגמה, התאימו אותן לסניף שלכם.</p>
{lanes_svg()}
<h3>מה כל גיל עושה</h3>
<table class="ages"><tr><th>גיל</th><th>משימות לדוגמה</th></tr>{trs}</table>
<h3 style="margin-top:5mm">איך נראית יציאה של גיל</h3>
<ul>
<li><b>15 דקות לפני:</b> מסיימים את המשימה ומצלמים תמונה קבוצתית ליד מה שעשיתם.</li>
<li><b>במעגל קטן:</b> אחראי הלילה מודה בשם לכל קבוצה על דבר מוחשי שעשתה.</li>
<li><b>מוסרים את המכחול:</b> נציג של הגיל היוצא מוסר צנצנת או מכחול לגיל שנשאר, ואומר משפט אחד.</li>
<li><b>עד שההורים מגיעים:</b> מדריך מלווה את הקבוצה, לא עוזבים חניכים לבד בחוץ.</li></ul>
<div class="note">לילה שבו גילאים מסיימים בשעות שונות דורש <b>אחראי גיל</b> לכל שכבה. הוא יודע מי עושה מה, מי יוצא מתי, ומי צריך הפסקה.</div>
<div class="pg">3</div></section>'''


def page_stations():
    st = [
        ('צביעת קירות', [
            'בוחרים לכל קיר משפט או ערך לפני שצובעים: מה רוצים שמי שנכנס יחוש?',
            'צוותים מעורבי גיל: חניך גדול מכין, קטן צובע, ושניהם חותמים.',
            'כל קיר מקבל "שומר" שמספר בבוקר את הסיפור שלו.',
        ]),
        ('חזרות', [
            'לפני כל חזרה משפט אחד: למה החלק הזה חשוב, ומה הוא בא להגיד.',
            'חזרות קצרות וחוזרות, לא אחת ארוכה. אחרי כל חזרה מחמאה אחת לפני תיקון.',
            'לכל חניך תפקיד, גם למי שלא עולה: מקליט, מחזיק, מדריך הצעירים.',
        ]),
        ('אווירה', [
            'קבוצת אווירה מבין החניכים קובעת סגנון, ובוחרת מוזיקה לפי שעות: קצבית בערב ורגועה אחר כך.',
            'אור חם ופנסים אחרי החשיכה, וריח מוכר (קפה, פופקורן).',
            'פינת שקט מסומנת למי שצריך הפסקה, בלי להרגיש שהוא מפספס.',
        ]),
        ('אוכל', [
            'ארוחה אחת משותפת בשעה קבועה, ומושבים מעורבי גיל בהגרלה.',
            'כל גיל אחראי על משהו אחר: הכנה, הגשה, שתייה, ניקיון.',
            'אוכל חם נוסף בשעות מאוחרות למי שנשארים, וחטיף ושתייה זמינים כל הלילה.',
        ]),
    ]
    cards = ''.join(f'<div class="pr"><h3 style="color:var(--flame)">{e(t)}</h3><ul style="margin:1mm 0 0;font-size:10.5pt;color:var(--soft)">' + ''.join(f'<li>{e(x)}</li>' for x in items) + '</ul></div>' for t, items in st)
    return f'''<section class="page"><h2><small>ארבע תחנות</small>איך הופכים כל תחנה למשמעותית</h2>
<p class="lead" style="margin-bottom:3mm">אותה עבודה נראית אחרת כשיודעים למה עושים אותה. לכל תחנה שלוש הוראות שמשנות את הלילה.</p>
<div class="principles">{cards}</div>
<div class="q" style="margin-top:6mm"><div class="big">אם חניך שואל "מה אני עושה פה?", התשובה צריכה להיות משפט שמסביר גם למה זה חשוב לכולם.</div></div>
<h3 style="margin-top:5mm">סימן קבוע לכל גיל</h3>
<p style="color:var(--soft);font-size:10.8pt">כדי שהלילה יישאר גם אחרי הבוקר, תנו לכל גיל משהו שנשאר בסניף: טביעת כף יד בפינה של קיר מיוחד, חתימה בצד הקיר שכל אחד צבע, או תמונה קבוצתית שתלויה בסניף עד השנה הבאה.</p>
<div class="pg">4</div></section>'''


def page_moments():
    ideas = [
        ('מעגל "למה אנחנו כאן"', 'כולם יחד. ראש הסניף אומר במשפט אחד מה בונים הלילה, מדריך מספר זיכרון מהסניף, וכל גיל אומר מה המשימה שלו.', '10 דק׳', 'כולם'),
        ('כתובת מתחת לצבע', 'לפני שצובעים קיר, כל חניך כותב עליו שם או משפט. אחר כך צובעים מעל. הקיר "יודע" מה כתוב מתחתיו.', '10 דק׳', 'כולם'),
        ('טביעת הדורות', 'כל גיל מטביע כף יד בצבע שונה בפינה של קיר מיוחד. בסוף כל הגילאים מופיעים ביחד.', '15 דק׳', 'כולם'),
        ('מסירת המכחול', 'הגיל היוצא מוסר צנצנת או מכחול לגיל שנשאר, עם משפט: "תמשיכו בשבילנו".', '3 דק׳', 'בכל יציאה'),
        ('שולחן אחד', 'ארוחה משותפת עם ישיבה מעורבת. לפני האוכל כל קבוצה מודה לקבוצה אחרת על משהו קונקרטי.', '45 דק׳', 'כולם'),
        ('תודה בשם', 'אחראי הלילה מודה בקול לכל גיל שיוצא, בשמות ובפרטים: "אתם צבעתם את הקיר הכחול".', '2 דק׳', 'בכל יציאה'),
        ('משפט לפני חזרה', 'לפני כל חזרה אומרים מה החלק בא להגיד, ובסופה כל חניך אומר דבר טוב אחד על חבר.', '5 דק׳', 'ד׳ ומעלה'),
        ('סיבוב סיום', 'הגדולים שנשארים מסיירים בסניף המעוצב, מצלמים תמונה אחרונה ומשאירים פתק לחניכים הצעירים: "מה בנינו בשבילכם".', '15 דק׳', 'י׳־י״ב'),
    ]
    trs = ''.join(f'<tr><td class="k">{e(a)}</td><td>{e(b)}</td><td class="t">{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in ideas)
    return f'''<section class="page"><h2><small>רגעים שעובדים</small>שמונה רגעים קצרים שמתאימים לכולם</h2>
<p class="lead" style="margin-bottom:3mm">כל רגע לוקח עד רבע שעה ומשתלב בתוך העבודה, בלי לעצור אותה.</p>
<table><tr><th>רגע</th><th>איך מבצעים</th><th>זמן</th><th>גיל</th></tr>{trs}</table>
<p class="note" style="margin-top:4mm">באתר יש גם מעגלי סיכום ופעולות ערכים שאפשר לשלב כמעגל סיום לכל גיל. אם תרצי, אכין לך מעגל קצר לכל שכבה.</p>
<div class="pg">5</div></section>'''


def page_team():
    roles = [
        ('אחראי הלילה', 'מחזיק את הלוז, פותח ומסיים את המעגלים, ומודה בשם לכל גיל.'),
        ('אחראי גיל, לכל שכבה', 'יודע מי נמצא, מי יוצא מתי, ושומר שאף חניך לא מחכה בלי משימה.'),
        ('אחראי צבע ובטיחות', 'אוורור, בגדי עבודה, סולמות רק לגדולים, מרחב נפרד לצעירים.'),
        ('אחראי אוכל', 'ארוחה משותפת, אוכל חם מאוחר, שתייה, וניקיון אחריה.'),
        ('אחראי אווירה ומוזיקה', 'מוזיקה לפי שעה, תאורה, פינת שקט, וקבוצת אווירה של חניכים.'),
        ('אחראי רגעים', 'דואג לרגעי הפתיחה, היציאה והסיום, ולתמונות הקבוצתיות.'),
    ]
    wrong = [
        'חניכים צעירים רק מביאים כוסות ומחכים. תנו להם קיר קטן משלהם.',
        'גדולים עושים הכול והקטנים רק מסתכלים. מערבבים בצוותים.',
        'חזרה ארוכה בלי משוב. תיקון בלי מחמאה מרוקן את החניכים.',
        'גיל שיוצא מוקדם בלי תודה ובלי סימן. הם יזכרו שלא ראו אותם.',
        'אוכל בשעות אקראיות. ארוחה אחת קבועה שכולם יושבים בה.',
        'אף אחד לא אומר למה צובעים. בלי משפט אחד, זו רק עבודה.',
    ]
    before = [
        'כתבנו משפט מטרה אחד שמתאים לכל הגילאים.',
        'לכל גיל יש משימה, אחראי גיל ושעת יציאה, ואישורי הורים בידינו.',
        'לכל קיר יש משפט וערך, ובגדי עבודה ואוורור מוכנים.',
        'קבענו ארוחה משותפת אחת, ואוכל חם לשעות המאוחרות.',
        'יש מעגל פתיחה, טקס יציאה לכל גיל וסיבוב סיום לגדולים.',
        'תכננו מה נשאר בסניף: כתובת, טביעה, תמונה.',
    ]
    after = [
        'בבוקר שולחים תמונה של הסניף המעוצב לכל השכבות.',
        'בפעילות הבאה מספרים לכל גיל מה השאירו אחרים לפניו.',
        'מודים לצוות ולהורים שהביאו ועזרו.',
    ]
    rl = ''.join(f'<li><b>{e(a)}:</b> {e(b)}</li>' for a, b in roles)
    wl = ''.join(f'<li>{e(x)}</li>' for x in wrong)
    bl = ''.join(f'<li>{e(x)}</li>' for x in before)
    al = ''.join(f'<li>{e(x)}</li>' for x in after)
    return f'''<section class="page"><h2><small>צוות, טעויות ובדיקה</small>מי עושה מה, ומה לדלג עליו</h2>
<div class="cols"><div><h3>תפקידים בצוות</h3><ul style="font-size:10.6pt">{rl}</ul>
<h3 style="margin-top:4mm">מה לא עובד</h3><ul class="wrong" style="font-size:10.6pt">{wl}</ul></div>
<div><h3>רשימת בדיקה לפני הלילה</h3><ul class="check" style="font-size:10.6pt">{bl}</ul>
<h3 style="margin-top:4mm">בבוקר שאחרי</h3><ul class="check" style="font-size:10.6pt">{al}</ul></div></div>
<div class="q" style="margin-top:5mm"><div class="big">לילה לבן טוב הוא לא זה שבו צבענו הכי הרבה קירות, אלא זה שבו כל חניך, מכיתה א׳ עד י״ב, יודע מה הוא בנה.</div></div>
<div class="pg">6</div></section>'''


def main():
    doc = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>איך הלילה הלבן יהפוך למשמעותי</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{cover()}{page_why()}{page_structure()}{page_stations()}{page_moments()}{page_team()}</body></html>'''
    out = os.path.join(ROOT, 'docs', 'white-night-guide.html')
    open(out, 'w', encoding='utf-8').write(doc)
    print('written', out)


if __name__ == '__main__':
    main()
