# -*- coding: utf-8 -*-
"""ספר משפטים מוכנים לגלופות ולקירות: רק משפטים, בלי הסברים.
המשפטים של רוני (מתוך movementNames.json) מסומנים "של רוני", והצעות חדשות מסומנות "הצעה". אין לפרסם הצעה באתר בלי אישור."""
import json, os, html, datetime

ROOT = os.path.join(os.path.dirname(__file__), '..')
MOV = json.load(open(os.path.join(ROOT, 'src', 'data', 'movementNames.json'), encoding='utf-8'))
e = html.escape
INK, FLAME, CREAM = '#241C11', '#D96A2B', '#FFF8E8'
COLS = ['#D96A2B', '#7A9A3E', '#C24270', '#6B5AA6', '#3E7EA6', '#C79A1C']

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

GENERAL_NEW = [
    'הגענו בזמן? אנחנו עדיין מחכים לאחרים', 'אם זה לא כיף, זה לא אנחנו', 'חשבנו על גלופה מצחיקה, אז שאלנו את החניכים',
    'מקסימום כיף, מינימום שינה', 'קטנים בגובה, ענקיים בכיף', 'אנחנו לא באיחור, אנחנו אופנתיים',
    'פעולה קצרה? אין דבר כזה אצלנו', 'אם תמצאו כיסא פנוי – הוא של השכבה', 'מי צריך מפה? אנחנו הדרך',
    'שלושה דברים בחיים: אוכל, שבט, ועוד אוכל', 'מה ההבדל בינינו לבין סרט? אצלנו אין פרסומות', 'לא נולדנו עם גלופה, אבל קיבלנו אחת',
    'אותו שבט, עוד שנה, עוד כיף', 'אל תקראו לנו קבוצה, אנחנו משפחה (עם יותר מדי הודעות בווטסאפ)', 'הכי מוכנים: רק צריך למצוא את הציוד',
    'בלי מדריך זה כיף. עם מדריך זה כיף עם סדר', 'אנחנו כאן כדי להישאר (אחרי הארוחה)', 'יש לנו מדריכים, יש לנו חברים, אין לנו שעון',
    'מי שאיתנו, לא צריך אויבים (רק אוכל)', 'כשאנחנו נכנסים, הסניף מתעורר', 'קפה? אין. כיף? מובטח', 'אל תחכו לפעם הבאה, אנחנו כבר כאן',
]
TEMPLATES = [
    'כשהכיף אצל ____ – כולם באים', 'בלי ____ זה לא אותו דבר', '____: לא רק שם, אלא אורח חיים', 'המדריך אמר: ____ ואנחנו עשינו הפוך',
    'פעם ____, היום ____, מחר – ____', 'חמש סיבות לאהוב את ____ (לא מצאנו עוד)', 'כל הדרכים מובילות אל ____', 'אם חשבתם שהכיף נגמר, לא פגשתם את ____',
    'מה כל כך מיוחד ב____? הכל.', '____: מקום קטן, לב ענק', 'שנה חדשה, ____ חדשים, אותו כיף', 'לא תמצאו את זה בספרי ההדרכה – רק ב____',
]
WALLS = [
    ('כניסה וקבלת פנים', [
        'ברוכים הבאים הביתה', 'כאן תמיד יש מקום בשבילך', 'הגעת, סימן שהיינו צריכים אותך', 'נעים מאוד, עכשיו אתה חלק מהסיפור',
        'פה לא מכירים זרים, רק חברים שעוד לא הכרנו', 'היום הראשון שלך הוא תחילת סיפור גדול', 'כניסה חופשית, יציאה בחיוך',
        'שלום, אנחנו השבט. אנחנו כבר מחכים לך', 'דלת פתוחה, לב פתוח, חיוך מובטח', 'מי שנכנס יוצא עם חיוך. תנאי אחד: להיכנס']),
    ('קיר ערכים', [
        'כאן מותר לטעות, אסור לוותר', 'גדלים ביחד, צוחקים ביחד, מנצחים ביחד', 'מי שנותן, מקבל פי שניים', 'חברות היא לא דבר שקורה, היא דבר שעושים',
        'כל אחד שונה, כולנו שווים', 'גדול באמת מי ששם לב לקטנים', 'לא רק לדבר – לעשות', 'תודה היא מילה קטנה עם כוח גדול',
        'אצלנו אף אחד לא נשאר בחוץ', 'אחריות זה לא נטל, זה אמון', 'כשקשה – פונים אחד לשני', 'אמת אחת, אהבה אחת, שבט אחד']),
    ('קיר תודה', [
        'תודה שהגעתם, בזכותכם זה בית', 'תודה למי שנשאר אחרון לסדר', 'מי עזר לך השבוע? כתבו לו תודה', 'תודה היא לא מילה, היא תנועה',
        'תודה לכל מי שתמיד שם, גם כשלא רואים', 'יש תודה? כתבו. אין תודה? תמציאו']),
    ('פרשה ולימוד', [
        'הפרשה של השבוע: מה היא מלמדת אותך?', 'ומה אתה היית עושה?', 'פרשה אחת, אלף פירושים – מה שלך?', 'כל שבוע פרשה, כל שבוע אתה',
        'שבת שלום, שבוע טוב, שנה טובה', 'כל פרשה – פתק אחד שלך', 'מה אתם לוקחים מהפרשה לשבוע?', 'לימוד שבועי: אל תבלעו, תלעסו']),
    ('השנה והזיכרונות', [
        'עוד חג, עוד מחנה, עוד זיכרון', 'ציר הזמן שלנו – עדיין לא נגמר', 'כל אירוע שהיה, היה בזכותכם',
        'השנה הזאת כבר מלאה, ויש עוד מקום בקיר', 'הנה מה שעשינו, הנה מה שעוד נעשה', 'כאן כותבים את הסיפור שלנו, שורה אחרי שורה']),
    ('עידוד ומוטיבציה', [
        'מי שלא מנסה, לא נכשל, ולא גדל', 'היום קשה, מחר פחות, ובעוד שנה תחייך', 'אל תחכה לפעם הבאה, תעשה עכשיו', 'קטן + קטן + קטן = שבט',
        'כל מסע גדול מתחיל בצעד אחד (ובדרך כלל בפיצה)', 'תנסו. גם אם תטעו, למדתם', 'אור קטן יכול להאיר חדר שלם', 'ממש מעולה, תמשיכו']),
    ('כותרות לקירות', [
        'קיר הכבוד', 'פינת האור', 'קיר הכיף', 'קיר המחשבות', 'פינת השאלות', 'קיר הגלופות', 'העץ שלנו', 'קיר התודה', 'קיר ההצעות', 'קיר המחר', 'הקיר שלנו', 'מה חדש אצלנו']),
]


def mascot(size=130):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 80 80"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2C85B"/><stop offset="1" stop-color="#D96A2B"/></linearGradient></defs>'
            f'<path d="M40 6c10 14 26 24 26 42a26 26 0 0 1-52 0c0-8 3-14 7-19 2 7 7 10 11 7-5-13 1-22 8-30z" fill="url(#g)" stroke="{INK}" stroke-width="2.4" stroke-linejoin="round"/>'
            f'<circle cx="32" cy="52" r="4" fill="{INK}"/><circle cx="50" cy="52" r="4" fill="{INK}"/><path d="M32 62c3 3 13 3 16 0" stroke="{INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>')


def head(n, title, col):
    return f'<header class="parthead" style="--c:{col}"><span class="partnum">{n}</span><h1>{e(title)}</h1></header>'


def card(text, tag=None):
    t = {'hers': '<span class="tag tag-hers">של רוני</span>', 'new': '<span class="tag tag-new">הצעה</span>'}.get(tag, '')
    return f'<div class="line{" blank" if "____" in text else ""}">{e(text)}{t}</div>'


def build():
    out = []
    out.append(f'''<section class="cover"><div class="blob b1"></div><div class="blob b2"></div><div class="sq s1"></div><div class="sq s2"></div><div class="sq s3"></div>
<div class="cover-body">{mascot(150)}<div class="cover-kicker">המדריך למדריך</div><h1>משפטים מוכנים<br>לגלופות ולקירות</h1>
<div class="cover-hand">לבחור, להדפיס, לתלות</div></div><div class="cover-foot">{datetime.date.today().strftime("%d.%m.%Y")}</div></section>''')

    sec = 0
    # ---- לפי תנועה ----
    names = {'ezra': 'עזרא', 'bnei-akiva': 'בני עקיבא', 'ariel': 'אריאל'}
    for m in MOV:
        if m['id'] == 'general':
            continue
        sec += 1
        out.append(f'<section class="page">{head(sec, "משפטים לשכבות: " + names.get(m["id"], m["movement"]), COLS[(sec - 1) % 6])}')
        if sec == 1:
            out.append('<div class="legend"><span class="tag tag-hers">של רוני</span> משפט שכבר באתר &nbsp; <span class="tag tag-new">הצעה</span> משפט חדש לבחירה (בודקים מול הרכז לפני הדפסה)</div>')
        for g in m['groups']:
            new = CANDIDATES.get(m['id'], {}).get(g['name'], [])
            cards = ''.join(card(s, 'hers') for s in g['slogans']) + ''.join(card(s, 'new') for s in new)
            out.append(f'<div class="layer"><div class="layername"><b>{e(g["name"])}</b><small>כיתה {e(g["grade"])}</small></div><div class="lines">{cards}</div></div>')
        out.append('</section>')

    # ---- כללי ----
    gen = [g for m in MOV if m['id'] == 'general' for g in m['groups']][0]['slogans']
    sec += 1
    out.append(f'<section class="page">{head(sec, "משפטים לכל השכבות", COLS[(sec - 1) % 6])}<div class="lines two">' + ''.join(card(s, 'hers') for s in gen if '____' not in s) + ''.join(card(s, 'new') for s in GENERAL_NEW) + '</div></section>')
    sec += 1
    out.append(f'<section class="page">{head(sec, "תבניות למילוי", COLS[(sec - 1) % 6])}<div class="lines two">' + ''.join(card(s, 'hers') for s in gen if '____' in s) + ''.join(card(s, 'new') for s in TEMPLATES) + '</div></section>')

    # ---- קירות ----
    sec += 1
    out.append(f'<section class="page">{head(sec, "משפטים לקירות הסניף", COLS[(sec - 1) % 6])}')
    for title, lines in WALLS:
        out.append(f'<h2 class="sub">{e(title)}</h2><div class="lines two">' + ''.join(card(s, 'new') for s in lines) + '</div>')
    out.append('</section>')
    return '\n'.join(out)


CSS = '''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Heebo', sans-serif; color: %(INK)s; background: %(CREAM)s; font-size: 11pt; line-height: 1.5; direction: rtl; }
h1, h2 { font-family: 'Rubik', sans-serif; margin: 0; line-height: 1.2; }
.cover { position: relative; width: 210mm; height: 297mm; overflow: hidden; break-after: page; display: flex; align-items: center; justify-content: center; text-align: center; }
.blob { position: absolute; border-radius: 52%% 48%% 60%% 40%% / 50%% 42%% 58%% 50%%; }
.b1 { width: 130mm; height: 130mm; background: #F2C85B; top: -30mm; left: -35mm; }
.b2 { width: 120mm; height: 120mm; background: #6B5AA6; bottom: -35mm; right: -30mm; opacity: .92; }
.sq { position: absolute; border: 2.2mm solid %(INK)s; border-radius: 6mm; }
.s1 { width: 46mm; height: 46mm; background: #7A9A3E; transform: rotate(14deg); bottom: 30mm; left: 14mm; }
.s2 { width: 30mm; height: 30mm; background: #C24270; transform: rotate(-9deg); bottom: 14mm; left: 46mm; }
.s3 { width: 34mm; height: 34mm; background: #3E7EA6; transform: rotate(-12deg); top: 38mm; right: 14mm; }
.cover-body { position: relative; z-index: 2; padding: 0 22mm; }
.cover-kicker { margin-top: 10mm; font: 800 17pt 'Rubik'; }
.cover h1 { font-size: 42pt; font-weight: 900; margin: 6mm 0 8mm; line-height: 1.1; }
.cover-hand { font-family: 'Gveret Levin', cursive; font-size: 28pt; color: %(FLAME)s; }
.cover-foot { position: absolute; bottom: 10mm; width: 100%%; text-align: center; font-size: 10pt; color: #6b5d45; z-index: 2; }
.page { width: 210mm; padding: 14mm 14mm 14mm; break-before: page; }
.parthead { display: flex; align-items: center; gap: 5mm; margin: 0 0 6mm; padding: 5mm 6mm; background: var(--c); color: #fff; border: .7mm solid %(INK)s; border-radius: 6mm; box-shadow: 1.6mm 1.6mm 0 %(INK)s; }
.parthead h1 { font-size: 22pt; font-weight: 900; }
.partnum { flex: none; width: 13mm; height: 13mm; border-radius: 50%%; background: #fff; color: %(INK)s; display: flex; align-items: center; justify-content: center; font: 900 17pt 'Rubik'; border: .7mm solid %(INK)s; }
.legend { padding: 3mm 5mm; border: .5mm solid %(INK)s; border-radius: 4mm; background: #fff; font-size: 10pt; margin-bottom: 5mm; }
.layer { display: grid; grid-template-columns: 24mm 1fr; gap: 4mm; align-items: start; padding: 3mm 0; border-bottom: .3mm solid #e4d9bc; break-inside: avoid; }
.layername b { font: 800 14pt 'Rubik'; display: block; color: %(FLAME)s; }
.layername small { color: #6b5d45; font-size: 9pt; }
.lines { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 3mm; }
.lines.two { gap: 3mm; }
.line { background: #fff; border: .45mm solid %(INK)s; border-radius: 3.2mm; padding: 2.6mm 3.4mm; font: 700 11pt 'Rubik'; line-height: 1.4; display: flex; flex-direction: column; align-items: flex-start; gap: 1.2mm; break-inside: avoid; }
.line.blank { background: #F4EEFB; }
.tag { display: inline-block; font: 800 7.4pt 'Heebo'; padding: .3mm 2mm; border-radius: 99px; }
.tag-hers { background: #E7EFD6; color: #3E5219; border: .3mm solid #7A9A3E; }
.tag-new { background: #FBF0CE; color: #7a5a00; border: .3mm solid #E8B93C; }
h2.sub { break-after: avoid; font-size: 14.5pt; font-weight: 800; margin: 6mm 0 3mm; padding-inline-start: 3mm; border-inline-start: 1.6mm solid %(FLAME)s; }
'''


def main():
    body = build()
    doc = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>משפטים מוכנים לגלופות ולקירות</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800;900&family=Heebo:wght@400;500;700;800&family=Gveret+Levin&display=swap" rel="stylesheet">
<style>{CSS % dict(INK=INK, FLAME=FLAME, CREAM=CREAM)}</style></head><body>{body}</body></html>'''
    out = os.path.join(ROOT, 'docs', 'sefer-glufot-vekirot.html')
    open(out, 'w', encoding='utf-8').write(doc)
    print('written', out)


if __name__ == '__main__':
    main()
