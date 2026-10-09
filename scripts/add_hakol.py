"""הכל בידיים שלנו: פרשת בראשית (כיתות ג-ו) — מתוך הפעולה של רוני. כולל צ'ופר מוטבע."""
import json, sys
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from content_tools import load, save, add_activities

SRC = '/private/tmp/claude-501/-Users-rwtmgrws-Documents-claude----------/50fc56a8-6d4b-4707-998f-fa6c531168f8/scratchpad/pdf/hakol_content.json'
c = json.load(open(SRC))
fl = c['flow']

flow = [
    {'label': fl[0]['label'], 'body': fl[0]['body'], 'items': None},
    {'label': 'אחרי המשחק, המדריך אומר', 'body': fl[0]['afterGame']},
    {'label': fl[1]['label'], 'body': fl[1]['body']},
    {'label': 'אחרי הפנטומימה שואלים', 'items': fl[1]['questionsAfter']},
    {'label': fl[2]['label'], 'body': fl[2]['body'], 'note': 'הסיפור המלא בנספח 1.'},
    {'label': fl[3]['label'], 'body': fl[3]['body']},
    {'label': 'אחרי המשחק', 'items': fl[3]['questionsAfter'], 'note': fl[3]['closing']},
    {'label': fl[4]['label'], 'items': fl[4]['items']},
    {'label': fl[5]['label'], 'body': fl[5]['body'] + '\n\n' + '\n\n'.join('"' + p + '"' if i == 0 else p for i, p in enumerate(fl[5]['quote'].split('\n'))) + '\n\n' + fl[5]['chupar']},
]
for s in flow:
    if s.get('items') is None: s.pop('items', None)

story = '\n\n'.join(c['appendix1']['paragraphs'])
cards = c['appendix2']['intro'] + '\n\n' + '\n'.join(f'{d} — {t}||{r}' for d, t, r in c['appendix2']['cards'])

a = {
    'id': c['id'], 'title': c['title'], 'categorySlug': 'activities', 'subtopics': ['בחירה', 'אחריות', 'בריאת העולם'],
    'ageLabel': "כיתה ג'-ו'", 'ageMin': 3, 'ageMax': 6, 'duration': 50, 'groupSize': '8-25 חניכים',
    'equipment': ['חבל או קו מסומן מראש', 'כרטיסי ימי הבריאה (נספח 2), מודפסים וגזורים', 'הסיפור להקראה (נספח 1)', 'כרטיס צ׳ופר "הכל בידיים שלכם" לכל חניך (נספח 3)'],
    'shabbat': 'שניהם', 'place': 'שניהם', 'energy': 'בינונית', 'depth': 'בינוני',
    'values': ['אחריות', 'בחירה', 'הכרת הטוב'], 'tags': ['פרשת שבוע', 'בראשית', 'אחריות', 'בחירה', 'כיתות ג-ו', 'ימי הבריאה'],
    'rating': 4.8, 'character': 'D', 'description': c['description'], 'goals': c['goals'],
    'opening': fl[0]['body'] + ' ' + fl[0]['afterGame'],
    'method': '\n\n'.join([fl[1]['body'], fl[2]['body'], fl[3]['body']]),
    'discussion': fl[4]['items'], 'guideNotes': '\n'.join(c['guideNotes']),
    'summary': fl[5]['quote'].replace('\n', ' '), 'tip': c['tip'],
    'flow': flow,
    'shabbatNote': 'הפעולה מתאימה לשבת כמו שהיא, בלי שינויים. מסמנים את הקו של ים־יבשה, גוזרים את הכרטיסים ומכינים את הצ׳ופרים לפני שבת.',
    'chuparIds': ['all-in-our-hands-card'],
    'appendices': [
        {'label': 'נספח 1 — סיפור להקראה: הזקן החכם והפרפר', 'content': story},
        {'label': 'נספח 2 — כרטיסי פנטומימה: ימי הבריאה (לגזירה)', 'content': cards},
    ],
}
add_activities([a])

ch = load('chuparim')
assert not any(x['id'] == 'all-in-our-hands-card' for x in ch)
ch.append({
    'id': 'all-in-our-hands-card',
    'title': 'הכל בידיים שלכם — כרטיס צ׳ופר',
    'budget': 'חינם', 'prepTime': '5 דק׳', 'forWhom': 'אישי', 'kind': 'מתנה מוחשית',
    'description': 'כרטיס קטן לסיום פעולת "הכל בידיים שלנו" (פרשת בראשית): "הכל בידיים שלכם, באהבה," ושם המדריכה או המדריך. מקלידים את השם בשדה שמתחת לכרטיס ומדפיסים (תשעה כרטיסים בעמוד), או חותמים בעט.',
    'tip': 'מדפיסים על נייר עבה וגוזרים. חותמים בשורת "באהבה," לפני שמחלקים. עמוד אחד מספיק לתשעה חניכים.',
    'character': 'D',
    'print': {'shape': 'square', 'layout': 'plain', 'palette': 'sunrise', 'motif': 'sun', 'font': 'amatic',
              'text': 'הכל בידיים\nשלכם', 'sub': 'באהבה,\n________'},
})
save('chuparim', ch)
print('ok')
