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

COLORS = ['#FFD9A8', '#BFE3F2', '#F9C5D5', '#CDE8B0', '#E3D3F5', '#FFF0A0', '#BDEBDD', '#FFC9B8']

CSS = '''
@page { size: A4; margin: 8mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font-family: 'Rubik', 'Heebo', sans-serif; color: #000; background: #fff; direction: rtl; }
.sheet { height: 281mm; display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(9, 1fr); gap: 2.2mm; }
.sq { border: .45mm solid #111; border-radius: 2.5mm; padding: 1.5mm 2.5mm; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 700; font-size: 9.5pt; line-height: 1.3; overflow: hidden; }
.sq.blank { border-style: dashed; }
'''


def main():
    lines = [t for _, ls in BY_NAME for t in ls] + GENERAL
    cells = [f'<div class="sq{" blank" if "____" in t else ""}" style="background:{COLORS[i % len(COLORS)]}">{e(t)}</div>' for i, t in enumerate(lines)]
    while len(cells) < 45:
        cells.append(f'<div class="sq blank" style="background:{COLORS[len(cells) % len(COLORS)]}"></div>')
    doc = f'''<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>גלופות</title>
<link href="https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800&display=swap" rel="stylesheet">
<style>{CSS}</style></head><body><div class="sheet">{"".join(cells)}</div></body></html>'''
    out = os.path.join(ROOT, 'docs', 'glufot-found.html')
    open(out, 'w', encoding='utf-8').write(doc)
    print('written', out, len(lines), 'lines')


if __name__ == '__main__':
    main()
