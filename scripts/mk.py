"""Compact builder: turns a short spec into a full Activity record (with a timed `flow` and the legacy fields kept in sync)."""
from content_tools import age_label


def mk(id, title, ages, duration, subtopics, values, tags, description, goals, opening, steps, discussion, summary, guideNotes, tip,
       game=None, reading=None, sourceLink=None, shabbat='שניהם', place='פנים', energy='בינונית', depth='בינוני', rating=4.6, character='D',
       groupSize='8-25 חניכים', equipment=None, shabbatNote=None, questions=None, appendices=None, category='activities'):
    """opening / game: (text, minutes)   steps: [(label, body, minutes, optional items list, optional note)]
       reading: (label, text, minutes)   discussion: list of questions (kept as items in the discussion step)"""
    lo, hi = ages
    flow = [{'label': f'פתיחה ({opening[1]} דק׳)', 'body': opening[0]}]
    legacy_method = []
    if game:
        flow.append({'label': f'משחק ({game[1]} דק׳)', 'body': game[0]})
    for st in steps:
        label, body, mins = st[0], st[1], st[2]
        items = st[3] if len(st) > 3 else None
        note = st[4] if len(st) > 4 else None
        step = {'label': f'{label} ({mins} דק׳)', 'body': body}
        if items:
            step['items'] = items
        if note:
            step['note'] = note
        flow.append(step)
        legacy_method.append(body)
    if reading:
        flow.append({'label': f'{reading[0]} ({reading[2]} דק׳)', 'body': reading[1]})
    flow.append({'label': 'דיון', 'items': discussion})
    if questions:
        flow.append({'label': 'שאלות נוספות (אם נשאר זמן)', 'items': questions})
    flow.append({'label': 'סיכום', 'body': summary})
    a = {
        'id': id, 'title': title, 'categorySlug': category, 'subtopics': subtopics, 'ageLabel': age_label(lo, hi), 'ageMin': lo, 'ageMax': hi,
        'duration': duration, 'groupSize': groupSize, 'equipment': equipment or [], 'shabbat': shabbat, 'place': place, 'energy': energy,
        'depth': depth, 'values': values, 'tags': tags, 'rating': rating, 'character': character, 'description': description, 'goals': goals,
        'opening': opening[0], 'method': '\n\n'.join(legacy_method), 'discussion': discussion, 'guideNotes': guideNotes, 'summary': summary, 'tip': tip,
        'flow': flow,
    }
    if game:
        a['game'] = game[0]
    if reading:
        a['reading'] = {'label': reading[0], 'text': reading[1]}
    if sourceLink:
        a['sourceLink'] = {'title': sourceLink[0], 'url': sourceLink[1]}
    if shabbatNote:
        a['shabbatNote'] = shabbatNote
    if questions:
        a['questions'] = questions
    if appendices:
        a['appendices'] = [{'label': l, 'content': c} for l, c in appendices]
    return a


def enrich(id, opening, steps, discussion, summary, guideNotes=None, tip=None, game=None, reading=None, questions=None, appendices=None,
           goals=None, equipment=None, description=None, shabbatNote=None, duration=None, sourceLink=None):
    """Patch for an existing activity: deeper timed flow + synced legacy fields (anything not passed stays as it is)."""
    flow = [{'label': f'פתיחה ({opening[1]} דק׳)', 'body': opening[0]}]
    legacy = []
    if game:
        flow.append({'label': f'משחק ({game[1]} דק׳)', 'body': game[0]})
    for st in steps:
        label, body, mins = st[0], st[1], st[2]
        step = {'label': f'{label} ({mins} דק׳)', 'body': body}
        if len(st) > 3 and st[3]:
            step['items'] = st[3]
        if len(st) > 4 and st[4]:
            step['note'] = st[4]
        flow.append(step)
        legacy.append(body)
    if reading:
        flow.append({'label': f'{reading[0]} ({reading[2]} דק׳)', 'body': reading[1]})
    flow.append({'label': 'דיון', 'items': discussion})
    if questions:
        flow.append({'label': 'שאלות נוספות (אם נשאר זמן)', 'items': questions})
    flow.append({'label': 'סיכום', 'body': summary})
    p = {'flow': flow, 'opening': opening[0], 'method': '\n\n'.join(legacy), 'discussion': discussion, 'summary': summary}
    if game: p['game'] = game[0]
    if reading: p['reading'] = {'label': reading[0], 'text': reading[1]}
    if guideNotes: p['guideNotes'] = guideNotes
    if tip: p['tip'] = tip
    if questions: p['questions'] = questions
    if appendices: p['appendices'] = [{'label': l, 'content': c} for l, c in appendices]
    if goals: p['goals'] = goals
    if equipment is not None: p['equipment'] = equipment
    if description: p['description'] = description
    if shabbatNote: p['shabbatNote'] = shabbatNote
    if duration: p['duration'] = duration
    if sourceLink: p['sourceLink'] = {'title': sourceLink[0], 'url': sourceLink[1]}
    return p
