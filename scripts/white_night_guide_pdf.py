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
<div class="sub">מדריך לצוות שרוצה שהלילה יישאר אצל החניכים גם אחרי הבוקר: מטרה, מבנה, רגעים שעובדים וטעויות שכדאי לדלג עליהן.</div></div>
<div class="foot">hamadrich-lamadrich.onrender.com</div></section>'''


def page_why():
    principles = [
        ('מטרה אחת, לא עשר', 'לילה שמנסה להספיק הכול נגמר בבלגן. בחרו נושא אחד (גיבוש, סיום שנה, שייכות, חיזוק קבוצה) ובנו הכול סביבו.'),
        ('בונים גל, לא קו ישר', 'אנרגיה עולה, שיא, ירידה, שקט, וזריחה. לילה בלי גל מרוקן את החניכים עד חצות ומשאיר אותם סתמיים בשלוש.'),
        ('החניכים מביאים, לא רק צורכים', 'לילה משמעותי הוא כזה שבו חניכים כותבים, מספרים, מנחים חלק ושרים. פעילות שבה רק מקשיבים נשכחת עד הבוקר.'),
        ('מחליפים בין רבים לקטנים', 'משחקים בקבוצה גדולה לשיא האנרגיה, ושיחות בשישה-שמונה חניכים לעומק. קרבה נוצרת במעגל קטן.'),
        ('העומק בשעה הנכונה', 'שיחה אישית עובדת בערך בין 23:30 ל־01:30, כשכולם עדיין ערים ובמצב לילה. ב־03:30 מקשיבים, לא מדברים.'),
        ('טקס שסוגר', 'לילה צריך נקודת סיום שאפשר לזכור: זריחה, מעגל אחרון, תפילה, או משפט אחד שכל חניך לוקח הביתה.'),
    ]
    cards = ''.join(f'<div class="pr"><h3>{e(t)}</h3><p>{e(b)}</p></div>' for t, b in principles)
    return f'''<section class="page"><h2><small>לפני שמתכננים</small>שאלה אחת לפני הכול</h2>
<p class="lead">לילה לבן הוא לא מרתון פעילויות. הוא נותן שלושה דברים שיום רגיל לא נותן, וכדאי לתכנן סביבם.</p>
<div class="three"><div><b>זמן</b>אין שעון ואין "עוד רגע המפגש נגמר". אפשר לעצור על שיחה טובה.</div><div><b>קרבה</b>אור נמוך, שמיכות ומעגלים קטנים מורידים מסכות מהר יותר מכל אייס־ברייקר.</div><div><b>שקט</b>בלילה אין תחרות על תשומת הלב, ולכן אפשר להקשיב לחניך שביום היה בשוליים.</div></div>
<div class="q"><div class="big">מה אנחנו רוצים שחניך יגיד לחבר ביום שאחרי?</div>
<p style="margin:3mm 0 0;color:#DCD6EA">נסחו משפט אחד לפני שבונים את הלוז. למשל: <b>"פעם ראשונה שהרגשתי שהקבוצה באמת מכירה אותי"</b>, <b>"הבנתי למה אנחנו עושים את זה ביחד"</b> או <b>"סיפרתי משהו שלא סיפרתי לאף אחד"</b>. כל סעיף בלוז נבחן מולו: מקרב אותנו למשפט, או רק ממלא זמן?</p></div>
<h2 style="font-size:17pt;margin-top:6mm">ששה עקרונות ללילה שנשאר</h2>
<div class="principles">{cards}</div>
<div class="pg">2</div></section>'''


def energy_svg():
    # עקומת אנרגיה: ציר X באחוזים מ-20:00 (0) עד 07:00 (100); y קטן = אנרגיה גבוהה
    X0, W, H = 18, 2.35, 0.62
    pts = [(0, 60), (8, 40), (18, 28), (23, 20), (32, 45), (40, 50), (50, 56), (57, 40), (66, 80), (74, 84), (82, 58), (90, 30), (100, 22)]
    P = [(X0 + x * W, y * H + 4) for x, y in pts]
    d = f'M{P[0][0]:.1f},{P[0][1]:.1f}'
    for i in range(len(P) - 1):
        p0, p1, p2, p3 = P[max(i - 1, 0)], P[i], P[i + 1], P[min(i + 2, len(P) - 1)]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        d += f' C{c1[0]:.1f},{c1[1]:.1f} {c2[0]:.1f},{c2[1]:.1f} {p2[0]:.1f},{p2[1]:.1f}'
    px = lambda hh: X0 + (hh * 60 / 660 * 100) * W  # שעות אחרי 20:00
    labels = [(0, '20:00'), (2, '22:00'), (4, '00:00'), (6, '02:00'), (8, '04:00'), (10, '06:00')]
    lab = ''.join(f'<text x="{px(h):.0f}" y="76" font-size="7" fill="#4A4258" text-anchor="middle">{t}</text>' for h, t in labels)
    z1, z2 = px(3.5), px(5.5)
    t1, t2 = px(7), px(8.5)
    s1, s2 = px(9.5), px(10.8)
    return f'''<svg class="curve" viewBox="0 0 270 80" width="100%" xmlns="http://www.w3.org/2000/svg">
<rect x="{X0}" y="0" width="{100*W+4:.0f}" height="66" rx="3" fill="#fff" stroke="#E7DCC4"/>
<rect x="{z1:.0f}" y="0" width="{z2-z1:.0f}" height="66" fill="#FFF1D6"/>
<rect x="{t1:.0f}" y="0" width="{t2-t1:.0f}" height="66" fill="#EDE8F7"/>
<rect x="{s1:.0f}" y="0" width="{s2-s1:.0f}" height="66" fill="#E3F0E6"/>
<path d="{d}" fill="none" stroke="#D96A2B" stroke-width="1.8" stroke-linecap="round"/>
<text x="{(z1+z2)/2:.0f}" y="8" font-size="6.2" fill="#8A5A12" text-anchor="middle">חלון העומק</text>
<text x="{(t1+t2)/2:.0f}" y="8" font-size="6.2" fill="#6B5AA6" text-anchor="middle">שפל</text>
<text x="{(s1+s2)/2:.0f}" y="8" font-size="6.2" fill="#3E7050" text-anchor="middle">זריחה</text>
<text x="{px(2.5):.0f}" y="12" font-size="6.2" fill="#8A3F10" text-anchor="middle">שיא</text>
<text x="{X0-3}" y="36" font-size="5.6" fill="#9A9080" text-anchor="end" transform="rotate(-90 {X0-3} 36)">אנרגיה</text>{lab}</svg>'''


def page_structure():
    # y בעקומה מחושב כך שגבוה = אנרגיה נמוכה; נהפוך בדמיון: הציר עולה כלפי מעלה
    rows = [
        ('20:00', 'התכנסות וחוקי הלילה', 'מי נשאר ער, מי רשאי לנוח, איפה החדר השקט. עשר דקות, ברורות.', False),
        ('20:15', 'פתיחה בתנועה', 'משחקי חבורה גדולים, שירה, חידון קבוצות. מורידים מתח ומחממים.', False),
        ('21:30', 'ארוחה ארוכה', 'שולחן אחד, תה וקפה. נותנים לשיחות ספונטניות לקרות.', False),
        ('22:30', 'השיא הגדול', 'משחק לילה, מסע תחנות או משימה גדולה. אחרי זה האנרגיה יורדת, וזה בסדר.', False),
        ('00:00', 'מעגל פתיחה: "עכשיו הלילה מתחיל"', 'כיבוי אורות עזים, נרות או פנסים. קטע קצר או סיפור אישי של מדריך. הסימן שעוברים לעומק.', True),
        ('00:30', 'קבוצות קטנות', 'שישה-שמונה חניכים עם מדריך, שאלות אמיתיות. זה לב הלילה.', True),
        ('01:30', 'לימוד או יצירה בחברותות', 'קטע קצר לדיון בזוגות, או כתיבה: מכתבים, ברכות, מילה טובה לכל חבר.', True),
        ('02:30', 'תנועה לפני השפל', 'מסע לילי קצר, פנסים, משחק ריצה. לא נותנים לקבוצה להירדם באמצע שיחה.', False),
        ('03:30', 'שקט וקבלה', 'מוזיקה שקטה, סרט קצר, סיפור שמקריאים. פעילות שבה מקשיבים ולא מדברים.', False),
        ('04:30', 'זוגות: מה לקחתי מהלילה', 'שיחת שניים, כל אחד אומר לשני משפט אחד.', False),
        ('05:30', 'זריחה וטקס סיום', 'מעגל אחרון, שיר, תפילת שחרית או רגע שקט מול הזריחה.', False),
        ('06:30', 'ארוחת בוקר ופירוק', 'ארוחה חמה, סיום לוגיסטי, הודעה אישית לכל חניך בהמשך היום.', False),
    ]
    trs = ''.join(f'<tr class="{"hl" if h else ""}"><td class="t">{t}</td><td class="k">{e(k)}</td><td>{e(d)}</td></tr>' for t, k, d, h in rows)
    return f'''<section class="page"><h2><small>מבנה הלילה</small>גל אחד מהערב עד הזריחה</h2>
<p class="lead" style="margin-bottom:2mm">העומק לא קורה ברגע שרוצים אותו. הוא קורה בחלון מסוים של הלילה, ולכן סדר הפעילויות חשוב יותר מהפעילויות עצמן.</p>
{energy_svg()}
<table><tr><th>שעה</th><th>שלב</th><th>מה קורה</th></tr>{trs}</table>
<p class="note" style="margin-top:4mm">השעות הן דוגמה ללילה של 20:00 עד 07:00. בלילה קצר יותר, שמרו על הסדר ותקצרו את המשחקים והארוחה, לא את קבוצות השיחה. השורות המסומנות הן חלון העומק.</p>
<div class="pg">3</div></section>'''


def page_moments():
    ideas = [
        ('מכתב לעצמי', 'כל חניך כותב לעצמו מכתב שיקבל בעוד שנה. המדריכים אוספים ושומרים.', '15 דק׳', 'כל הגילאים'),
        ('מעטפות טובות', 'לכל חניך מעטפה עם שמו. כולם כותבים לכל אחד מילה אחת טובה ומוסיפים לה. פותחים בסוף הלילה.', '30 דק׳', 'ו׳ ומעלה'),
        ('עוברים אם זה נכון לי', 'מעגל, מישהו אומר משפט ("אני מרגיש שאני צריך להתאמץ כדי להשתייך") ומי שמזדהה צועד פנימה. רואים שלא לבד.', '20 דק׳', 'ז׳ ומעלה'),
        ('סיפור אישי של מדריך', 'מדריך מספר רגע קשה או מכונן מהחיים שלו. החשיפה של הצוות פותחת את החניכים.', '10 דק׳', 'ז׳ ומעלה'),
        ('שאלות על הכוס', 'תה וקפה בקבוצות קטנות, ועל כל כוס שאלה: "מי לימד אותך משהו חשוב?", "מה היית אומר לעצמך לפני שנה?".', '25 דק׳', 'כל הגילאים'),
        ('הליכה בשקט', 'מסלול של עשר דקות בלי לדבר, אחרי שהתדרכתם מראש. בסוף מתיישבים ושותפים משפט אחד.', '20 דק׳', 'ח׳ ומעלה'),
        ('קיר הזיכרונות', 'תמונות וציטוטים מהשנה על קיר. חניכים מוסיפים פתק: "הרגע שלי השנה".', '20 דק׳', 'כל הגילאים'),
        ('חברותא של לילה', 'קטע קצר מהמקורות או סיפור חסידי, שאלה אחת לזוגות, ושיתוף במעגל.', '30 דק׳', 'ז׳ ומעלה'),
    ]
    trs = ''.join(f'<tr><td class="k">{e(a)}</td><td>{e(b)}</td><td class="t">{e(c)}</td><td>{e(d)}</td></tr>' for a, b, c, d in ideas)
    return f'''<section class="page"><h2><small>רגעים שעובדים</small>מה הופך רגע למשמעותי</h2>
<p class="lead" style="margin-bottom:3mm">בכל רגע שזוכרים יש לפחות שניים מארבעת המרכיבים האלה.</p>
<div class="three" style="grid-template-columns:repeat(4,1fr)">
<div><b style="font-size:12.5pt">שאלה אמיתית</b>שאלה שלא ענו עליה מאה פעמים.</div>
<div><b style="font-size:12.5pt">סיכון קטן</b>מישהו אומר משהו קצת חשוף.</div>
<div><b style="font-size:12.5pt">הקשבה</b>אף אחד לא מתקן, לא מחדד ולא מציל.</div>
<div><b style="font-size:12.5pt">סימן</b>מכתב, מעטפה או נר שאפשר לקחת הביתה.</div></div>
<h3 style="margin-top:2mm">שמונה רגעים מוכנים</h3>
<table><tr><th>רגע</th><th>איך מבצעים</th><th>זמן</th><th>גיל</th></tr>{trs}</table>
<p class="note">באתר יש פעולה מוכנה בנושא: <b>"לילה לבן בשטח"</b> (ט״ז־י״ח, קטגוריית ערבי גיבוש וכיף), עם תחנות ומעגל סיום מתחת לכוכבים.</p>
<div class="pg">4</div></section>'''


def page_team():
    wrong = [
        'לשאול שאלות עמוקות ב־03:30, כשהחניכים נרדמים. שמרו לחלון העומק.',
        'לחייב כל חניך לשתף. נוכחות שקטה גם היא השתתפות.',
        'הסברים ארוכים לפני כל משחק. בלילה אין סבלנות.',
        'להשאיר חניך בודד בשוליים. מדריך אחד אחראי על העין לבודדים.',
        'לילה בלי שינה בכלל לכל הצוות. מחלקים משמרות כדי שיהיה מי שיחזיר הביתה בבטחה.',
        'מוזיקה חזקה כל הלילה. מפסיקים אחרי השיא, וחוזרים לרמקול רק בזריחה.',
    ]
    roles = [
        ('מנחה ראשי', 'מחזיק את הלוז והגל. מחליט מתי להאריך שיחה ומתי לעבור הלאה.'),
        ('שומר הקצב', 'מודד אנרגיה בקבוצה ומציע פעילות מתאימה: להאיץ או לרדת.'),
        ('מדריך הרגוע', 'יושב ליד מי שמתעייף, מוטרד או מתבודד.'),
        ('אחראי בטיחות ולוגיסטיקה', 'אישורי הורים, מי נשאר ער, אוכל, תה, רכב חירום. אחראי שאינו נכנס לשיחות.'),
    ]
    rl = ''.join(f'<li><b>{e(a)}:</b> {e(b)}</li>' for a, b in roles)
    wl = ''.join(f'<li>{e(x)}</li>' for x in wrong)
    safety = [
        'אישורי הורים וטלפון זמין של הורה לכל חניך.',
        'מבוגר ער ואחראי בכל רגע, והצוות בלי אלכוהול.',
        'מקום שקט לשינה לכל מי שצריך, בלי להרגיש שנכשל.',
        'מסלולים בחוץ ממופים באור יום, עם פנסים ותדריך.',
        'כללי הלינה של התנועה לבנים ולבנות נשמרים כרגיל.',
    ]
    sl = ''.join(f'<li>{e(x)}</li>' for x in safety)
    return f'''<section class="page"><h2><small>הצוות והלילה</small>מי עושה מה, ומה לדלג עליו</h2>
<div class="cols"><div><h3>תפקידים בצוות</h3><ul>{rl}</ul>
<h3 style="margin-top:5mm">בטיחות והורים</h3><ul class="check">{sl}</ul></div>
<div><h3>מה לא עובד בלילה לבן</h3><ul class="wrong">{wl}</ul></div></div>
<div class="note"><b>ליל שבת או חג (למשל ליל שבועות):</b> אין כתיבה, חשמל ורמקול. מחליפים בשיחות בעל־פה, לימוד בחברותות, סיפורים ושירה, וכל "מכתב" נאמר בקול. המבנה והגל נשארים אותו דבר.</div>
<h2 style="font-size:17pt;margin-top:5mm">איך משנים לפי גיל</h2>
<table class="ages"><tr><th>גיל</th><th>מה לשנות</th></tr>
<tr><td class="k">א׳־ג׳</td><td>לא לילה לבן. לינה בסניף עד 22:00, שיא קצר של משחק לילה וסיפור לפני השינה.</td></tr>
<tr><td class="k">ד׳־ו׳</td><td>עד 24:00. הרבה תנועה, פעילות קבוצתית קצרה ושיחה אחת קטנה. בלי "חלון עומק" ארוך.</td></tr>
<tr><td class="k">ז׳־ט׳</td><td>לילה מלא עם שיא גדול. קבוצות שיחה של 6, ובנו אמון לפני שמבקשים חשיפה.</td></tr>
<tr><td class="k">י׳־י״ב</td><td>שיחות עמוקות, אחריות על חלק מהלילה לחניכים, מסע שקט וזריחה.</td></tr></table>
<div class="pg">5</div></section>'''


def page_after():
    before = [
        'כתבנו משפט אחד: מה החניכים יגידו ביום שאחרי.',
        'הלוז בנוי כגל, ויש בו חלון עומק בין 23:30 ל־01:30.',
        'לכל קבוצה קטנה יש מדריך וארבע שאלות מוכנות.',
        'יש רגע סימן אחד לכל חניך (מכתב, מעטפה או נר).',
        'מחלקים תפקידים ומשמרות לצוות, כולל מי ישן ומי מחזיר הביתה.',
        'אישורי הורים, תה, שמיכות, פנסים, דפים ועטים מוכנים מראש.',
    ]
    after = [
        'ביום שאחרי שולחים לכל חניך הודעה אישית: משפט אחד על משהו ששמעתם ממנו בלילה.',
        'בסניף הבא מזכירים רגע אחד מהלילה ומחברים אותו לפעולה רגילה.',
        'מעבירים הלאה מעטפות, מכתבים ותמונות בזמן שהובטח, לא יותר.',
        'מסכמים בצוות: מה קרה בחלון העומק, מי נפתח, ומי נשאר בצד ודורש שיחה.',
    ]
    bl = ''.join(f'<li>{e(x)}</li>' for x in before)
    al = ''.join(f'<li>{e(x)}</li>' for x in after)
    return f'''<section class="page"><h2><small>לפני ואחרי</small>מה שהופך לילה לזיכרון</h2>
<div class="cols"><div><h3>רשימת בדיקה לפני הלילה</h3><ul class="check">{bl}</ul></div>
<div><h3>היום שאחרי</h3><ul class="check">{al}</ul></div></div>
<div class="q" style="margin-top:10mm"><div class="big">לילה משמעותי הוא לא כזה שבו היו הכי הרבה פעילויות. הוא כזה שבו חניך אחד לפחות הרגיש שראו אותו.</div></div>
<p class="lead" style="font-size:11.5pt">בהצלחה, והעיקר שהצוות גם יתעורר בבוקר עם חיוך.</p>
<div class="pg">6</div></section>'''


def main():
    doc = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>איך הלילה הלבן יהפוך למשמעותי</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body>{cover()}{page_why()}{page_structure()}{page_moments()}{page_team()}{page_after()}</body></html>'''
    out = os.path.join(ROOT, 'docs', 'white-night-guide.html')
    open(out, 'w', encoding='utf-8').write(doc)
    print('written', out)


if __name__ == '__main__':
    main()
