"""בראשית: בוראים או צורכים? — מקור פנימי: הפסוקים מודפסים בנספח (בעמודות) במקום קישור חיצוני."""
import json, re, sys, urllib.request
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from content_tools import load, save

UA = {'User-Agent': 'Mozilla/5.0 hamadrich-research'}


def flat(x):
    if isinstance(x, str):
        return [x]
    out = []
    for y in x or []:
        out += flat(y)
    return out


def clean(t):
    t = re.sub(r'<[^>]+>', '', t).replace('&thinsp;', ' ').replace('&nbsp;', ' ')
    t = re.sub('[֑-ֽ֯׀]', '', t)
    t = re.sub('י[ְ-ּ]*ה[ְ-ּ]*ו[ְ-ּ]*ה[ְ-ּ]*', 'ה׳', t) if 'יְה' in t else t
    return re.sub(r'\s+', ' ', t).strip()


def verses(ref):
    url = f'https://www.sefaria.org/api/texts/{ref}?context=0&commentary=0&vhe=Miqra_according_to_the_Masorah'
    d = json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40))
    return [clean(v) for v in flat(d['he'])], d['heRef']


blocks = []
for ref, title in [
    ('Genesis.1.26-28', 'בראשית א׳ כ״ו–כ״ח — האדם נברא בצלם'),
    ('Genesis.2.15', 'בראשית ב׳ ט״ו — האדם בגן עדן'),
    ('Genesis.2.19-20', 'בראשית ב׳ י״ט–כ׳ — האדם נותן שמות'),
]:
    vs, _ = verses(ref)
    blocks.append(title + '\n' + ' '.join(vs))

acts = load('activities')
a = next(x for x in acts if x['id'] == 'parsha-bereshit-teen')
a.pop('sourceLink', None)
a['method'] = ('קוראים יחד את הפסוקים בנספח א׳ (בעמודות): בריאת האדם "בצלם", "ויניח אותו בגן עדן לעבדה ולשמרה", והאדם שנותן שמות לבעלי החיים. '
               'מציגים פרשנות רווחת: "צלם" אינו מראה חיצוני אלא יכולת — בני אדם הם היצור היחיד שממשיך לברוא אחרי הבריאה: רעיונות, כלים, קשרים, עולם. '
               'שימו לב: האדם הראשון אינו רק מקבל את העולם אלא מעבד אותו, שומר עליו וקורא לדברים בשמם. מחלקים את הקבוצה לתחומים (חברה, לימודים, משפחה, תנועה) — '
               'כל קבוצה כותבת: איפה בתחום הזה אנשים בגילנו בעיקר "צורכים", ואיפה הם יכולים "לברוא"?')
a['equipment'] = ['דפים וטושים', 'פתקים', 'נספח א׳ מודפס — פסוקים בעמודות (עותק לכל חניך)']
a['appendices'] = [{
    'label': 'נספח א׳ — פסוקים: האדם כיוצר (בעמודות)',
    'content': 'קוראים בקול, פסוק אחרי פסוק. שימו לב למילים: "בצלמנו", "ורדו", "לעבדה ולשמרה", "ויקרא".\n\n' + '\n\n'.join(blocks) +
               '\n\nמקור: ספר בראשית, נוסח המסורה.',
}]
a['guideNotes'] = (a['guideNotes'] + ' כל המקורות לפעולה מודפסים בנספח א׳ — אין צורך בקישור חיצוני או במכשיר.').strip()
save('activities', acts)
print('ok')
