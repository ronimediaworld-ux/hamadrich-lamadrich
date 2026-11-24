# -*- coding: utf-8 -*-
"""כרטיסי צ׳ופר לפעולות מחוברת פעולות שבת תשפ״ו.

בחוברת כל פעולה מסתיימת ב״צופ׳ר״: כרטיס קטן עם משפט סיום, שמדפיסים בכמה עותקים ומחלקים. בחוברת הכרטיסים נחתמו בשמות המדריכות שכתבו אותם;
כאן החתימה היא שורה ריקה (״________״) שממלאים בשם של המדריך או המדריכה.

הסקריפט מוסיף את הכרטיסים ל־chuparim.json ומחבר אותם לפעולות דרך chuparIds. אידמפוטנטי.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from content_tools import load, save

SIGN = 'אוהבת, ________'


def card(cid, title, desc, tip, character, shape, layout, palette, motif, font, text, sub):
    return dict(id=cid, title=title, budget='חינם', prepTime='5 דק׳', forWhom='אישי', kind='מתנה מוחשית',
                description=desc, tip=tip, character=character,
                print=dict(shape=shape, layout=layout, palette=palette, motif=motif, font=font, text=text, sub=sub))


TIP = 'מדפיסים על נייר עבה וגוזרים (תשעה כרטיסים בעמוד). את שורת החתימה ממלאים בשם שלכם לפני ההדפסה, או חותמים בעט. מחלקים בסוף הפעולה.'

CARDS = [
    (['shabbat-ki-tetze-critical-thinking'], [
        card('ki-tetze-reality-card', 'אל תקחו את המציאות כמובנת מאליה — כרטיס צ׳ופר',
             'כרטיס קטן לסיום פעולת ״חשיבה ביקורתית״ (פרשת כי תצא): ״אל תקחו את המציאות כמובנת מאליה, תזכרו תמיד לאיזו מציאות אתן שואפות, וקחו את החשיבה הביקורתית כדבר שיניע אתכן ליוזמה ועשייה.״ הכרטיס מופיע בחוברת פעולות שבת תשפ״ו.',
             TIP, 'A', 'square', 'plain', 'sky', 'compass', 'amatic',
             'אל תקחו את המציאות\nכמובנת מאליה',
             'תזכרו תמיד לאיזו מציאות אתן שואפות, וקחו את החשיבה הביקורתית כדבר שיניע אתכן ליוזמה ועשייה.\n' + SIGN),
        card('ki-tetze-dont-believe-card', 'אסור לנו להאמין למציאות כפי שהיא — כרטיס צ׳ופר (ציטוט)',
             'כרטיס ציטוט לסיום פעולת ״חשיבה ביקורתית״: ״אסור לנו להאמין למציאות כפי שהיא״ (הדר גולדין הי״ד). מתאים כגירסה קצרה, לחניכות שמעדיפות משפט אחד חזק.',
             TIP, 'D', 'card', 'center', 'night', 'star', 'secular',
             'אסור לנו להאמין\nלמציאות כפי שהיא',
             'הדר גולדין הי״ד'),
    ]),
    (['shabbat-bereshit-returning-generation'], [
        card('bereshit-youth-has-power-card', 'לנוער יש כוחות — כרטיס צ׳ופר',
             'כרטיס קטן לסיום פעולת בראשית: ציטוט של הרב דרוקמן על כוחו של הנוער, ובקשה: ״בעזרת השם נזכה להבין את הכוחות שקיימים בנו.״',
             TIP, 'A', 'square', 'plain', 'sunrise', 'sun', 'amatic',
             'הנוער, יש לו כוחות,\nובכוחות שלו יכולים לפעול גדולות',
             'הרב דרוקמן\nבעז״ה נזכה להבין את הכוחות שקיימים בנו.\n' + SIGN),
    ]),
    (['shabbat-lech-lecha-going-the-extra-mile'], [
        card('lech-lecha-edge-people-card', 'להיות תמיד בראש של אנשי קצה — כרטיס צ׳ופר',
             'כרטיס קטן לסיום פעולת ״אנשי קצה״ (פרשת לך לך): ״שנזכה להיות תמיד בראש של אנשי קצה, שמה שצריך אותי — אני שם, גם כשלא נוח לי.״',
             TIP, 'C', 'square', 'plain', 'forest', 'flag', 'amatic',
             'שנזכה להיות תמיד\nבראש של אנשי קצה',
             'מה שצריך אותי — אני שם, גם כשלא נוח לי.\nכשצריך משהו ממני, אני עושה את ההכי טוב שלי!\nשבת שלום, ________'),
    ]),
    (['kama-hanhaga-man-created-as-a-shaliach'], [
        card('toldot-every-person-is-a-shaliach-card', 'כל אדם הוא שליח — כרטיס צ׳ופר',
             'כרטיס קטן לסיום המפגש על שליחות (פרשת תולדות): ״ראשית כל צריך לדעת שכל אדם הוא שליח. עצם העובדה שהוא נברא הופכת אותו לשליח.״',
             TIP, 'B', 'square', 'plain', 'grape', 'key', 'amatic',
             'ראשית כל צריך לדעת\nשכל אדם הוא שליח',
             'הוא נולד בזמן מסוים ועם כוחות מסוימים כדי לבצע שליחות מסוימת, והשליחות היא תמיד בכוחותיו.\n' + SIGN),
    ]),
    (['shabbat-shmini-faith-and-the-holocaust'], [
        card('shmini-not-serving-god-card', 'לא עובדים את אלוקים אלא את עצמנו — כרטיס צ׳ופר (ציטוט)',
             'כרטיס ציטוט לסיום פעולת ״אמונה והשואה״ (פרשת שמיני), על פי מה שמיוחס לפרופ׳ ישעיהו ליבוביץ׳: ״מי שכועס על אלוקים כשרע לו ואוהב אותו כשטוב לו — לא עובד את אלוקים אלא את עצמו.״ נושא טעון: מוסרים בשקט ובלי להכריע בשם הקבוצה.',
             'מוסרים בשקט, אחרי שהשיחה נרגעה, ולא בתור תשובה על שאלת ״איפה אלוקים בשואה״. ' + TIP, 'E', 'card', 'center', 'night', 'moon', 'secular',
             'מי שכועס על אלוקים כשרע לו\nואוהב אותו כשטוב לו —\nלא עובד את אלוקים אלא את עצמו',
             'ישעיהו ליבוביץ׳'),
    ]),
    (['shabbat-acharei-kedoshim-aliyat-koma-movement'], [
        card('acharei-part-of-something-big-card', 'להיות חלק ממשהו גדול — כרטיס צ׳ופר',
             'כרטיס קטן לסיום פעולת ״עולות קומה״ (פרשת אחרי מות־קדושים): ״להיות חלק ממשהו גדול״, ולצדו המשפט שאמר נפוליאון כשראה יהודים בוכים על חורבן הבית: ״עם שמסוגל לבכות כך על עברו — יש לו עתיד.״',
             TIP, 'D', 'square', 'plain', 'cherry', 'flag', 'amatic',
             'להיות חלק\nממשהו גדול',
             'עם שמסוגל לבכות כך על עברו — יש לו עתיד.\n' + SIGN),
    ]),
    (['shabbat-emor-way-or-result'], [
        card('emor-way-and-result-card', 'תוצאה ודרך קשורים זה בזה — כרטיס צ׳ופר',
             'כרטיס קטן לסיום פעולת ״הדרך או התוצאה״: ״תוצאה ודרך קשורים זה בזה. אי אפשר להתרכז רק בתוצאה ובדרך תצא עקומה, או להפך. צריך למצוא את האמצע!״',
             TIP, 'C', 'square', 'plain', 'ocean', 'compass', 'amatic',
             'תוצאה ודרך\nקשורים זה בזה',
             'אי אפשר להתרכז רק בתוצאה ובדרך תצא עקומה, או להפך. צריך למצוא את האמצע!\n' + SIGN),
    ]),
    (['inner-life-vs-appearance'], [
        card('beshalach-inner-to-outer-card', 'מבפנים החוצה — כרטיס צ׳ופר',
             'כרטיס קטן לסיום פעולת ״חיצוניות ופנימיות״ (פרשת בשלח): ״מעצמיות הכוח הנפשי מתפשטים המעשים כולם. התגלות החיים ממקור חיי הנפש באה ומתבלטת בכל אשר יעשה האדם בחיים.״',
             TIP, 'B', 'square', 'plain', 'berry', 'heart', 'amatic',
             'מעצמיות הכוח הנפשי\nמתפשטים המעשים כולם',
             'התגלות החיים ממקור חיי הנפש באה ומתבלטת בכל אשר יעשה האדם בחיים.\n' + SIGN),
    ]),
]


def main():
    chup = load('chuparim')
    ids = {c['id'] for c in chup}
    acts = load('activities')
    by_id = {a['id']: a for a in acts}
    added = linked = 0
    for act_ids, cards in CARDS:
        for c in cards:
            if c['id'] not in ids:
                chup.append(c); ids.add(c['id']); added += 1
        for aid in act_ids:
            a = by_id.get(aid)
            if not a:
                print('missing activity', aid)
                continue
            cur = a.get('chuparIds') or []
            for c in cards:
                if c['id'] not in cur:
                    cur.append(c['id']); linked += 1
            a['chuparIds'] = cur
    save('chuparim', chup)
    save('activities', acts)
    print('chuparim added:', added, '| links added:', linked, '| total chuparim:', len(chup))


if __name__ == '__main__':
    main()
