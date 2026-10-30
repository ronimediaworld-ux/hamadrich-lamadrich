# -*- coding: utf-8 -*-
"""לימוד חניכים לפרשת וירא (תפילת לוט ותפילת אברהם), מהמסמך שסיפקה מנהלת האתר. הטקסט נשמר כלשונו, בלי פתיחה.
קורא את הפסקאות ישירות מקובץ ה-docx כדי שלא תהיה טעות העתקה."""
import re, sys, zipfile
sys.path.insert(0, 'scripts')
from booklet_import import staff, add

DOCX = '/Users/rwtmgrws/Desktop/לימוד חניכים - פרשת וירא.docx'
xml = zipfile.ZipFile(DOCX).read('word/document.xml').decode('utf-8')
paras = [''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', p)).strip() for p in re.findall(r'<w:p[ >].*?</w:p>', xml, flags=re.S)]
paras = [p for p in paras if p]
assert paras[0].startswith('לימוד חניכים'), paras[0]
TEXT = '\n\n'.join(paras[1:])

S = staff('staff-vayera-lot-prays-from-trouble', 'וירא: תפילה מתוך הצרה', 'פרשת וירא', 25, 'חניכים וצוות, מתאים לשבת פרשת וירא',
          'אברהם התפלל על סדום ולא נענה, ולוט התפלל על צוער ונענה מיד. לימוד על כוחה של תפילה שיוצאת מתוך הצרה, ועל מה שאנחנו יכולים ללמוד מזה לחיים.',
          ['החניכים יכירו את התמיהה: למה תפילת לוט התקבלה ותפילת אברהם על סדום לא', 'החניכים יבינו מה מיוחד בתפילה שנאמרת מתוך הצרה', 'כל חניך יחשוב על דבר אחד שהוא מבקש מהלב ושיוכל להתפלל עליו'],
          '', TEXT,
          ['למה לדעתכם הקב״ה נענה ללוט ולא לאברהם? מה ההבדל בין שתי התפילות?',
           'מה זה אומר להתפלל ״מתוך הצרה״? במה זה שונה מבקשה על משהו שנוח לנו שיהיה?',
           'מתי ביקשתם משהו בלב שלם, כי ממש הייתם צריכים? (אין חובה לשתף)',
           'איך אפשר לעזור לחבר שנמצא בצרה, גם כשאי אפשר לפתור לו אותה?'],
          'כל חניך חושב על דבר אחד שהוא מבקש מהלב, ויכול להתפלל עליו השבוע בשיחה קצרה עם הקב״ה.')
# idempotent: replace an earlier version
import json
p = 'src/data/staffStudy.json'
items = [x for x in json.load(open(p, encoding='utf-8')) if x['id'] != S['id']]
json.dump(items, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=2)
add([], [S])
print('words:', len(TEXT.split()))
