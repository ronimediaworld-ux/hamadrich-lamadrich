# -*- coding: utf-8 -*-
"""עזר לחבילות פעולות ערכיות (הקשבה, חמלה, אהבת האחר, משמעות). כל הפעולות בעל פה ובלי ציוד, מתאימות לחול ולשבת."""
import re, sys
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from content_tools import load, add_activities

SOURCES = {
    'listen_heart': 'וְנָתַתָּ לְעַבְדְּךָ לֵב שֹׁמֵעַ',
    'listen_wise': 'אֵיזֶהוּ חָכָם, הַלּוֹמֵד מִכָּל אָדָם',
    'love': 'וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ',
    'hillel_self': 'אִם אֵין אֲנִי לִי, מִי לִי. וּכְשֶׁאֲנִי לְעַצְמִי, מָה אֲנִי. וְאִם לֹא עַכְשָׁיו, אֵימָתָי',
    'task': 'לֹא עָלֶיךָ הַמְּלָאכָה לִגְמֹר, וְלֹא אַתָּה בֶן חוֹרִין לִבָּטֵל מִמֶּנָּה',
}


def minutes(label):
    m = re.search(r'\((\d+)', label)
    return int(m.group(1)) if m else 0


def act(id, title, lo, hi, topic, values, tags, character, desc, goals, steps, notes, tip, group='10–25 חניכים', energy='בינונית', depth='בינוני', sub=None):
    flow = [({'label': l, 'items': b} if isinstance(b, list) else {'label': l, 'body': b}) for l, b in steps]
    bodies = [b for _, b in steps]
    return dict(id=id, title=title, categorySlug='activities', subtopics=sub or [topic], ageLabel='', ageMin=lo, ageMax=hi,
                duration=sum(minutes(l) for l, _ in steps), groupSize=group, equipment=[], shabbat='שניהם', place='פנים', energy=energy,
                depth=depth, values=values, tags=['ערכים', topic] + tags, rating=4.6, character=character, description=desc, goals=goals,
                opening=bodies[0], game=bodies[1], method=bodies[2], discussion=bodies[4], guideNotes=notes, summary=bodies[6], tip=tip,
                shabbatNote='בעל פה ובלי ציוד, מתאימה גם לשבת.', flow=flow)


def publish(acts):
    existing = {a['id'] for a in load('activities')}
    fresh = [a for a in acts if a['id'] not in existing]
    print('activities added:', add_activities(fresh) if fresh else 0)
