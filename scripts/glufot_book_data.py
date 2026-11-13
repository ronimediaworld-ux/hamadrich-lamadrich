# -*- coding: utf-8 -*-
"""מוציא את תוכן ספר הגלופות והקירות ל-src/data/glufotBook.json, כדי שייכנס להדפסת הקלסר כקטגוריה."""
import json, os, importlib.util

ROOT = os.path.join(os.path.dirname(__file__), '..')
spec = importlib.util.spec_from_file_location('w', os.path.join(os.path.dirname(__file__), 'walls_lines_pdf.py'))
w = importlib.util.module_from_spec(spec)
spec.loader.exec_module(w)

names = {'ezra': 'עזרא', 'bnei-akiva': 'בני עקיבא', 'ariel': 'אריאל'}
sections = []
for m in w.MOV:
    if m['id'] == 'general':
        continue
    groups = []
    for g in m['groups']:
        lines = list(g['slogans']) + w.CANDIDATES.get(m['id'], {}).get(g['name'], [])
        groups.append({'name': g['name'], 'sub': f"כיתה {g['grade']}", 'lines': lines})
    sections.append({'title': 'משפטים לשכבות: ' + names.get(m['id'], m['movement']), 'groups': groups})

gen = [g for m in w.MOV if m['id'] == 'general' for g in m['groups']][0]['slogans']
sections.append({'title': 'משפטים לכל השכבות', 'groups': [{'name': '', 'sub': '', 'lines': [s for s in gen if '____' not in s] + list(w.GENERAL_NEW)}]})
sections.append({'title': 'תבניות למילוי', 'groups': [{'name': '', 'sub': '', 'lines': [s for s in gen if '____' in s] + list(w.TEMPLATES)}]})
sections.append({'title': 'משפטים לקירות הסניף', 'groups': [{'name': t, 'sub': '', 'lines': ls} for t, ls in w.WALLS]})

out = {'title': 'גלופות וקירות לנתקעים בדקה תשעים', 'sections': sections}
with open(os.path.join(ROOT, 'src', 'data', 'glufotBook.json'), 'w', encoding='utf-8') as f:
    f.write(json.dumps(out, ensure_ascii=False, indent=2) + '\n')
print('lines:', sum(len(g['lines']) for s in sections for g in s['groups']))
