# -*- coding: utf-8 -*-
"""דף גלופות לפי שמות: רק משפטים שנמצאו בחיפוש ברשת (פורומים ואתרי רעיונות), בלי תוספות שלנו.
סוננו משפטים עם אלימות, פוליטיקה, או שמתייחסים לצוות מסוים בשנה מסוימת."""
import os, html

ROOT = os.path.join(os.path.dirname(__file__), '..')
e = html.escape
INK, FLAME, CREAM = '#241C11', '#D96A2B', '#FFF8E8'

BY_NAME = [
    ('ניצנים', ['ני-צנים מרוב שאנחנו לוהטים נשרף לנו הצנים...']),
    ('נבטים', ['קטנים קטנים אבל לא נגמרת לנו הבטריה (ותמונה של נוקיה)']),
    ('מעפילים', ['להרים פילים? בקטנה אחי!', 'שבט מ-up פילים', 'כי אפילו פילים לא יכולים עלינו']),
    ('הרא״ה', ['״ראה״ ולמד', 'הרא״ה – רואים שש-שש אבל אותך לא רואים ממטר..']),
    ('דביר', ['דב(י)רים טובים באים בכמויות קטנות', 'לשון הרע לא מדב(י)ר אליי', 'דב(י)ר כזה עוד לא ראיתם!']),
    ('נווה', ['אנחנו כמו נווה מדבר – שנייה אחת המדריך ממצמץ ואנחנו כבר לא שם']),
    ('מעוז', ['תורת חיים מעוז!']),
    ('נחלה', ['כל הסניף נחלתנו']),
    ('יסוד', ['יסוד – כי תמיד מתחילים איתנו']),
    ('חב״ב', ['חב״ב – חברה בלי בית', 'חב״ב (בענק), ומתחת, בקטן: כזה גדול עוד לא ראיתם']),
]
GENERAL = [
    'סניף כזה אפילו הרצל לא חזה', 'זה לא הכמות, זה האיכות', 'שבט ____ זאת לא הכמות, זאת האיכות! בעצם גם וגם', 'יש ___ סיבות למה שבט ____ הכי תותח',
    'רצינו לכתוב משהו עמוק אבל פחדנו שתטבעו!', 'לא אומרים שבחו של אדם בפניו, לכן כתבנו על הגב!', 'הסניף הוא כמו מצנם – ככל שאתה יותר בפנים, אתה יותר שרוף!',
    'אפילו ״פיילוט״ לא מייצרים שפיצים כמונו', 'כל כך שפיצים שזה כואב!', 'הייתי שפוי, הייתי נורמלי, הגעתי ל____ – תראו מה קרה לי',
    'גם בלי טלוויזיה אפשר לחיות בסרט!', 'אל תחפשו אותנו בפייסבוק', 'תוצרת ____', 'אין לנו כסף, אין לנו מזל, אבל העיקר שיש לנו מורל!',
    'חושבים שהגלופה יפה? חכו שנסתובב! שבט ____ יפות אחת אחת', 'אם ראיתם אותנו נופלים, אל תצחקו – לא בכל יום רואים כוכב נופל',
    'אחרי חודש כזה אנחנו צריכים בית', 'תקראו לנו קוצים, תקראו לנו דוסים, אבל הכי חשוב – תקראו לנו להשלים מניין!', 'חשבתם שחפרנו? חפרנו שחשבתם!',
    'חשבתם שאהבנו? אהבנו שחשבתם…', 'חשבנו שאין כמו במבה עד שהגענו ל____', 'מה זה משנה? גם ככה זה פיג׳מה!', 'אנחנו לא טועים, ואם טעינו – זה בטעות',
    'קשה זה טוב!', 'כדי לנשום אוויר הרים יש לשאוף אבק דרכים', 'בדרך לחתונה עוצרים בסיירים', 'אם אתה רואה את הגלופה – סימן שאיזה פראייר סוחב לי את התיק',
    'כי משפחה לא בוחרים..', 'כי אין לנו יותר לאן לשאוף..',
]

CSS = '''
@page { size: A4; margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Heebo', sans-serif; color: %(INK)s; background: %(CREAM)s; direction: rtl; font-size: 11pt; }
.page { width: 210mm; padding: 14mm; break-before: page; }
.page:first-child { break-before: auto; }
h1 { font: 900 24pt 'Rubik'; margin: 0 0 6mm; padding: 5mm 6mm; background: %(FLAME)s; color: #fff; border: .7mm solid %(INK)s; border-radius: 6mm; box-shadow: 1.6mm 1.6mm 0 %(INK)s; }
.name { display: grid; grid-template-columns: 26mm 1fr; gap: 4mm; align-items: start; padding: 3mm 0; border-bottom: .3mm solid #e4d9bc; break-inside: avoid; }
.name b { font: 800 15pt 'Rubik'; color: %(FLAME)s; }
.lines { display: grid; grid-template-columns: 1fr 1fr; gap: 2mm 3mm; }
.line { background: #fff; border: .45mm solid %(INK)s; border-radius: 3.2mm; padding: 2.6mm 3.4mm; font: 700 11pt 'Rubik'; line-height: 1.4; break-inside: avoid; }
.line.blank { background: #F4EEFB; }
'''


def card(t):
    return f'<div class="line{" blank" if "____" in t else ""}">{e(t)}</div>'


def main():
    parts = ['<section class="page"><h1>גלופות</h1>']
    for name, lines in BY_NAME:
        parts.append(f'<div class="name"><b>{e(name)}</b><div class="lines">{"".join(card(t) for t in lines)}</div></div>')
    parts.append(f'<div class="name"><b>לכל שם</b><div class="lines">{"".join(card(t) for t in GENERAL)}</div></div></section>')
    doc = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>גלופות</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800;900&family=Heebo:wght@400;500;700;800&display=swap" rel="stylesheet">
<style>{CSS % dict(INK=INK, FLAME=FLAME, CREAM=CREAM)}</style></head><body>{"".join(parts)}</body></html>'''
    out = os.path.join(ROOT, 'docs', 'glufot-found.html')
    open(out, 'w', encoding='utf-8').write(doc)
    print('written', out)


if __name__ == '__main__':
    main()
