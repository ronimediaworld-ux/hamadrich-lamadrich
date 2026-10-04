"""Helpers for editing the site's JSON content safely (keeps the existing 2-space formatting, validates records).

Usage from a batch script:
    from content_tools import load, save, add_activities, set_flow, normalize_age_labels
"""
import json, os, re

DATA = os.path.join(os.path.dirname(__file__), '..', 'src', 'data')
GRADE = {1: "א'", 2: "ב'", 3: "ג'", 4: "ד'", 5: "ה'", 6: "ו'", 7: "ז'", 8: "ח'", 9: "ט'", 10: "י'", 11: 'י"א', 12: 'י"ב'}


def load(name):
    with open(os.path.join(DATA, f'{name}.json'), encoding='utf8') as f:
        return json.load(f)


def save(name, data):
    with open(os.path.join(DATA, f'{name}.json'), 'w', encoding='utf8') as f:
        f.write(json.dumps(data, ensure_ascii=False, indent=2) + '\n')


def age_label(lo, hi):
    return f"כיתה {GRADE[lo]}" if lo == hi else f"כיתה {GRADE[lo]}-{GRADE[hi]}"


def normalize_age_labels(items):
    """one spelling for every grade range: 'כיתה ד'-ו'' (regular apostrophe, hyphen, derived from ageMin/ageMax)"""
    changed = 0
    for x in items:
        lab = x.get('ageLabel', '')
        if lab.startswith('כיתה') or re.match(r"^[א-ת]['\"״׳]?-", lab):
            new = age_label(x['ageMin'], x['ageMax'])
            if new != lab:
                x['ageLabel'] = new
                changed += 1
    return changed


REQUIRED_ACTIVITY = ['id', 'title', 'categorySlug', 'subtopics', 'ageLabel', 'ageMin', 'ageMax', 'duration', 'groupSize', 'equipment',
                     'shabbat', 'place', 'energy', 'depth', 'values', 'tags', 'rating', 'character', 'description', 'goals', 'opening',
                     'method', 'discussion', 'guideNotes', 'summary', 'tip']


def check_activity(a, existing_ids):
    for k in REQUIRED_ACTIVITY:
        assert k in a, f"{a.get('id')}: missing {k}"
    assert a['id'] not in existing_ids, f"duplicate id {a['id']}"
    assert a['shabbat'] in ('שבת', 'חול', 'שניהם')
    assert a['place'] in ('פנים', 'חוץ', 'שניהם')
    assert a['energy'] in ('נמוכה', 'בינונית', 'גבוהה')
    assert a['depth'] in ('קליל', 'בינוני', 'עמוק')
    assert a['character'] in list('ABCDEF')
    assert 1 <= a['ageMin'] <= a['ageMax'] <= 12
    assert a['ageLabel'] == age_label(a['ageMin'], a['ageMax']) or not a['ageLabel'].startswith('כיתה'), f"{a['id']}: label mismatch"
    for f in a.get('flow') or []:
        assert f.get('label'), f"{a['id']}: flow step without label"
    for u in [a.get('sourceLink')] + [f.get('link') for f in (a.get('flow') or [])]:
        if u:
            assert u['url'].startswith('https://'), f"{a['id']}: bad url {u['url']}"


def add_activities(new):
    acts = load('activities')
    ids = {a['id'] for a in acts}
    for a in new:
        if not a.get('ageLabel'):
            a['ageLabel'] = age_label(a['ageMin'], a['ageMax'])
        check_activity(a, ids)
        ids.add(a['id'])
        acts.append(a)
    normalize_age_labels(acts)
    save('activities', acts)
    return len(new)


def set_flow(updates):
    """updates: {activity_id: {'flow': [...], optional other fields like guideNotes/tip/equipment/goals/questions/description}}"""
    acts = load('activities')
    by = {a['id']: a for a in acts}
    for i, patch in updates.items():
        assert i in by, f'unknown activity {i}'
        by[i].update(patch)
        check_activity_fields = by[i]
        for f in check_activity_fields.get('flow') or []:
            assert f.get('label'), f'{i}: flow step without label'
    save('activities', acts)
    return len(updates)
