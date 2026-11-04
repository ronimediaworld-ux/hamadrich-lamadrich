# מקצה לכל כרטיס צ׳ופר מלבני "לוק" (קומפוזיציה) ופונט, כך ששכנים לא חוזרים אחד על השני.
import json, io
P = 'src/data/chuparim.json'
C = json.load(io.open(P, encoding='utf-8'))

SPECIAL_LAYOUTS = {'plain', 'cinema', 'pharmacy'}
DIE = {'candy', 'lollipop', 'heart', 'bubble', 'bandaid', 'pill', 'drop', 'cloud', 'balloon'}
RECT = {'card', 'cert', 'ticket', 'label', 'tag', 'square', 'note', 'wide'}

ALLOWED = {
    'ticket': ['stripe', 'blobs', 'diag'],
    'wide': ['blobs', 'highlight', 'diag', 'layers', 'arch', 'bunting', 'tape', 'stripe', 'grid', 'confetti', 'dots'],
    'card': ['blobs', 'highlight', 'ribbon', 'diag', 'layers', 'arch', 'bunting', 'tape', 'stripe', 'grid', 'confetti', 'dots'],
    'cert': ['blobs', 'highlight', 'ribbon', 'diag', 'layers', 'arch', 'bunting', 'tape', 'stripe', 'grid', 'confetti', 'dots'],
    'label': ['blobs', 'highlight', 'layers', 'diag', 'stripe', 'tape', 'bunting', 'confetti'],
    'square': ['highlight', 'layers', 'confetti', 'tape', 'circle', 'bunting', 'dots', 'grid', 'arch', 'diag', 'blobs'],
    'note': ['highlight', 'layers', 'confetti', 'tape', 'circle', 'bunting', 'dots', 'grid', 'arch', 'diag', 'blobs'],
    'tag': ['highlight', 'layers', 'confetti', 'tape', 'circle', 'bunting', 'dots', 'grid', 'arch', 'diag', 'blobs'],
}
POEM_OK = {'layers', 'tape', 'highlight', 'confetti', 'chalk', 'dots', 'bunting'}
ROOMY = {'layers', 'tape', 'highlight', 'stripe', 'blobs', 'chalk'}
FONTS = ['secular', 'rubik', 'suez', 'playpen', 'secular', 'karantina', 'alef', 'rubik', 'suez', 'amatic', 'secular', 'heebo']

usage = {}
recent = []
fi = 0
for c in C:
    p = c.get('print')
    if not p or c.get('designImage') or p['layout'] in SPECIAL_LAYOUTS or p['shape'] not in RECT:
        continue
    pool = list(ALLOWED[p['shape']])
    poem = p['layout'] == 'poem'
    ln = len(p['text'])
    sub = p.get('sub') or ''
    total = ln + len(sub)
    parts = len([x for x in sub.replace('\n', '·').split('·') if x.strip()])
    if poem:
        pool = [x for x in pool if x in POEM_OK]
    elif total > 85 or parts >= 4:
        pool = [x for x in pool if x in ROOMY]
    else:
        if total > 42:
            pool = [x for x in pool if x not in ('circle', 'bunting')]
        if '\n' in sub or len(sub) > 34 or ln > 36:
            pool = [x for x in pool if x != 'ribbon']
        if total > 60:
            pool = [x for x in pool if x not in ('grid', 'arch', 'diag')]
    dark = p['palette'] in ('night', 'chalk')
    if dark and usage.get('chalk', 0) < 6 and p['shape'] in ('card', 'cert', 'square', 'tag', 'label', 'note') and not poem:
        pool = pool + ['chalk', 'chalk', 'chalk']
    cand = [x for x in pool if x not in recent[-4:]] or pool
    pick = min(cand, key=lambda x: (usage.get(x, 0), pool.index(x)))
    usage[pick] = usage.get(pick, 0) + 1
    recent.append(pick)
    p['look'] = pick
    # פונט: מחזור, בלי אמטיק לטקסט ארוך
    f = FONTS[fi % len(FONTS)]; fi += 1
    if f == 'amatic' and ln > 24:
        f = 'secular'
    if f == 'karantina' and ln > 40:
        f = 'rubik'
    if not poem:
        p['font'] = f
io.open(P, 'w', encoding='utf-8').write(json.dumps(C, ensure_ascii=False, indent=2) + '\n')
print(usage)
