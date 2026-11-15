"""Replaces the SUMMARIES of reading passages in the existing activities with the passage IN FULL (word for word, from add_readings_from_files.py).

After running, each passage appears in full as an appendix named after the passage, and the "קטע קריאה" step (or the step that
mentions the passage) points to it (for Rabbi Akiva's story and the Shelach/modesty pieces the full text is also in the step itself where noted).
Run `add_readings_from_files.py` first or after - the two scripts are independent; this one only reads texts from it.

Idempotent: appendices are upserted by label, step bodies are rebuilt deterministically. Nothing is written on import.
Usage: python3 patch_full_readings_in_activities.py [--dry-run]
"""
import sys
from content_tools import load, save
import add_readings_from_files as AR

TEXT = {r['id']: r['text'] for r in AR.NEW}
BANNED = AR.BANNED

DILEMMA_ONE = (
    "בתורה מושג ה'התחברות' אינו מופיע. זהו מושג הנגזר מהסתכלות אינדיבידואליסטית. לא ריבונו של עולם מעניין אותי אלא רק דבר אחד: אני. "
    "שיהיה לי נעים, ואינני נגד המצוות אך אם למשל התפילה תנעם לי עכשיו, אתפלל. ואם חצאית ארוכה תנעם לי, אלבשנה… האידאל של חיי הוא: אני, שאני אתחבר. "
    "שיוויתי עצמי לנגדי תמיד ולא את ריבונו של עולם. אם נעים לי להתחבר עם ריבונו של עולם, וזו חוויה נפלאה, נשגבה, אעשה זאת. "
    "אם התפילה תהיה חוויה בנוסח שירה מרגשת, אשתתף בה. אם לא, אעדיף להצטייד ברשמקול ולשמוע מוסיקת רוק כבד."
)
HERSHKOVITZ_CARD = TEXT['hershkovitz-what-can-i-give-my-people']


def upsert_appendix(act, label, content, replaces=()):
    """replace an appendix in place (same label, or a label starting with one of `replaces`); otherwise append"""
    apps = act.setdefault('appendices', [])
    for ap in apps:
        if ap['label'] == label or any(ap['label'].startswith(p) for p in replaces):
            ap['label'], ap['content'] = label, content
            return
    apps.append({'label': label, 'content': content})


def keep_before(body, *markers):
    """the part of a step body before the first marker (so that re-running rebuilds the same text)"""
    cut = len(body)
    for m in markers:
        i = body.find(m)
        if i != -1:
            cut = min(cut, i)
    return body[:cut]


def set_step(act, idx, label_prefix, body):
    step = act['flow'][idx]
    assert step['label'].startswith(label_prefix), (act['id'], idx, step['label'])
    step['body'] = body


def patch(acts):
    by = {a['id']: a for a in acts}

    # ------------------------------------------------------------------ "בשביל מה אתם מדריכים?"
    a = by['kama-series-why-do-you-guide']
    set_step(a, 3, 'קטע קריאה',
             'קוראים (או מקריאים) שני קטעים. כל אחד מהם נמצא במלואו בנספחים:\n'
             '1) "הדרכה" (נספח א): קטע בגוף ראשון שפונה למדריך, ועוסק במעבר ממקבל לנותן ובפער בין הדמות לבין מי שאני באמת.\n'
             '2) "בשביל מה אתם מדריכים?" (נספח ב): מדריך מספר על רכז ארצי ששואל שוב ושוב "בשביל מה?" עד שמגיעים לשאלת החזון.')
    set_step(a, 5, 'הסבר',
             keep_before(a['flow'][5]['body'], ' (הטקסט המלא של דברי הרב דסלר בנספח ג.)') + ' (הטקסט המלא של דברי הרב דסלר בנספח ג.)')
    upsert_appendix(a, 'נספח א: "הדרכה" (קטע קריאה, שם הכותב אינו מופיע בקובץ)', TEXT['being-a-guide-from-taker-to-giver'])
    upsert_appendix(a, 'נספח ב: "בשביל מה אתם מדריכים?" (קטע קריאה, שם הכותב אינו מופיע בקובץ)', TEXT['why-do-you-guide-the-big-vision'])
    upsert_appendix(a, 'נספח ג: הרב דסלר, "מכתב מאליהו" — כוח הנתינה וכוח הנטילה', TEXT['rav-dessler-power-of-giving'])
    upsert_appendix(a, 'כרטיס ציטוט לחלוקה: החייל יוסי הרשקוביץ הי״ד', HERSHKOVITZ_CARD)

    # ------------------------------------------------------------------ "איך מרכיבים אישיות?"
    a = by['kama-series-building-personality']
    set_step(a, 3, 'קטע קריאה',
             'מקריאים את השאלה ואת התשובה מתוך "חברים מקשיבים" במלואן (נספח ג). אחרי הקריאה אפשר להזכיר שהשאלה היא לא '
             '"איך לעצב אישיות" אלא "איך לעצב אותה נכון".')
    set_step(a, 6, 'סיכום',
             keep_before(a['flow'][6]['body'], '\n\nאפשר לסיים') +
             '\n\nאפשר לסיים בקריאת השיר "השביל שלא נבחר" מאת רוברט פרוסט (נספח ד).')
    upsert_appendix(a, 'נספח ג: "חברים מקשיבים" — איך מרכיבים אישיות? (שאלה ותשובה, הקטע במלואו; התשובה מאת משה)',
                    TEXT['friends-listen-how-to-build-a-personality'])
    upsert_appendix(a, 'נספח ד: "השביל שלא נבחר" — רוברט פרוסט (תרגום לעברית כפי שבקובץ; שם המתרגם אינו מופיע)',
                    TEXT['frost-the-road-not-taken'])

    # ------------------------------------------------------------------ פתיחת מערך הנהגה
    a = by['kama-hanhaga-opening-leadership-partner-or-customer']
    set_step(a, 3, 'קטע קריאה',
             keep_before(a['flow'][3]['body'], '\n\nאחר כך קוראים') +
             '\n\nאחר כך קוראים את הקטע "מנהיגים" במלואו (נספח "מנהיגים"; שם הכותב אינו מופיע בקובץ).')
    set_step(a, 8, 'קטע קריאה',
             keep_before(a['flow'][8]['body'], '\n\nתקציר הקטע', '\n\nקוראים את הקטע במלואו') +
             '\n\nקוראים את הקטע במלואו (נספח "שותף או לקוח?", הרב יהושע ויצמן).')
    upsert_appendix(a, 'מנהיגים (קטע קריאה, שם הכותב אינו מופיע בקובץ)', TEXT['leaders-article-values-before-leadership'])
    upsert_appendix(a, 'שותף או לקוח? — הרב יהושע ויצמן (קטע קריאה)', TEXT['weizmann-partner-or-customer'])

    # ------------------------------------------------------------------ האדם נברא בתור שליח
    a = by['kama-hanhaga-man-created-as-a-shaliach']
    set_step(a, 1, 'קטע קריאה',
             'קוראים את הפסוקים על משה במלואם (נספח "שמות ג, י–יב וד, י–יב"): בשמות ג, י-יב מטיל הקב״ה על משה משימה, ומשה שואל ״מי אנכי״ '
             'ומקבל תשובה שיש לו ליווי (״כי אהיה עמך״). בשמות ד, י-יב משה אומר שהוא כבד פה וכבד לשון, והקב״ה עונה שהוא זה שנתן פה לאדם '
             'ושהוא יהיה עם פיו ויורה לו מה לדבר.\n\nמסכמים: הקב״ה מביא על משה משימה אבל לא נעלם. הוא מביא את המשימה יחד עם כוחות וליווי.')
    set_step(a, 2, 'קטע קריאה',
             'קוראים את הקטע ״פסיעות בחול״ (מוכר גם בשם ״עקבות בחול״; שם הכותב אינו מופיע בקובץ) במלואו (נספח "פסיעות בחול").\n\n'
             'מחברים לשיחה: תפקיד ושליחות הם דבר עצום, אבל ביחד איתם מגיעים גם כוחות עצומים וצריך לדעת להשתמש בהם.')
    set_step(a, 3, 'הסבר',
             'שיחה של אפרת מצלר-פורת (כך בקובץ; תוכן השיחה עצמה אינו מצורף) ויחד איתה קטע של הרב סולובייצ׳יק, ״האדם נברא בתור שליח״. '
             'את הקטע קוראים במלואו (נספח "הרב סולובייצ׳יק").')
    upsert_appendix(a, 'שמות ג, י–יב וד, י–יב (קטע קריאה)', TEXT['moses-sent-and-given-strength-exodus'])
    upsert_appendix(a, 'פסיעות בחול (קטע קריאה, שם הכותב אינו מופיע בקובץ)', TEXT['footprints-in-the-sand'])
    upsert_appendix(a, 'הרב סולובייצ׳יק: "האדם נברא בתור שליח" (קטע קריאה)', TEXT['soloveitchik-man-created-as-a-shaliach'])

    # ------------------------------------------------------------------ פער"ש שלח
    a = by['perash-shelach-point-of-view-by-choice']
    set_step(a, 3, 'קטע קריאה: רבי עקיבא',
             'מקריאים או מספרים את סיפור רבי עקיבא (על פי תלמוד בבלי, ברכות ס ע״ב), כפי שהוא כתוב בחומר הפעולה:\n\n' +
             TEXT['rabbi-akiva-everything-is-for-the-best'] + '\n\nבסוף שואלים את הקבוצה: מה קרה פה בעצם?')
    set_step(a, 5, 'קטע קריאה: אלה החיים שלנו',
             keep_before(a['flow'][5]['body'], '\n\nהערה למדריך:') +
             '\n\nהערה למדריך: אם לא ידוע מי כתב את הקטע, אל תציגו אותו כשיר מוכר או כציטוט, אלא כ״קטע שנקרא״. כדאי להדפיס אותו מראש.')
    set_step(a, 8, 'קטע קריאה: פרשת שלח',
             'המדריך מקריא את נספח ב, הקטע על פרשת שלח, במלואו (ראו בנספחים). שם הכותב אינו מופיע בקובץ.')
    upsert_appendix(a, 'נספח א: ״אלה החיים שלנו, עם ישראל״ (הקטע במלואו, בלי שם כותב ובלי כותרת)', TEXT['these-are-our-lives-israel'],
                    replaces=('נספח א',))
    upsert_appendix(a, 'נספח ב: פרשת שלח לך — לא לתת למשהו אחד למחוק את כל הדברים הטובים (הקטע במלואו)',
                    TEXT['shelach-one-but-does-not-erase-the-good'], replaces=('נספח ב',))

    # ------------------------------------------------------------------ צניעות
    a = by['modesty-outer-how-and-why']
    set_step(a, 3, 'קטע קריאה',
             'מספרים לחניכות שזה קטע ממכתב שמישהי כתבה לחברה חילונית שנשאלה למה היא מתלבשת בצניעות ומה עומד מאחורי זה, '
             'וקוראים את המכתב במלואו (נספח "מכתב לאלונה").')
    upsert_appendix(a, 'מכתב לאלונה (חתום "מיכל", הקטע במלואו)', TEXT['modesty-letter-to-alona'], replaces=('מכתב לאלונה',))

    a = by['modesty-inside-and-outside']
    set_step(a, 2, 'מתודה',
             keep_before(a['flow'][2]['body'], '\n\nבהמשך אפשר') +
             '\n\nבהמשך אפשר לקרוא יחד את הקטע ״מה אני רוצה?״ (שאלה ותשובה, נספח 2) ולדון בו.')
    upsert_appendix(a, 'נספח 2: ״מה אני רוצה?״ (שאלה ותשובה, הקטע במלואו; שם הכותב אינו מופיע בקובץ)', TEXT['modesty-the-inner-will-answer'])

    a = by['modesty-real-world-dilemmas']
    set_step(a, 4, 'סיכום',
             keep_before(a['flow'][4]['body'], '\n\nאפשר לסיים') +
             '\n\nאפשר לסיים בקריאת הקטע על חני וינרוט ז״ל (נספח "צניעות כהלך רוח").')
    upsert_appendix(a, 'הטקסט שבדילמה הראשונה (כלשונו בקובץ; שם הכותב אינו מופיע)', DILEMMA_ONE)
    upsert_appendix(a, 'צניעות כהלך רוח: הרב יוני לביא / חני וינרוט ז״ל (קטע קריאה)', TEXT['hani-weinroth-on-modesty'])


PATCHED = {'kama-series-why-do-you-guide', 'kama-series-building-personality', 'kama-hanhaga-opening-leadership-partner-or-customer',
           'kama-hanhaga-man-created-as-a-shaliach', 'perash-shelach-point-of-view-by-choice', 'modesty-outer-how-and-why',
           'modesty-inside-and-outside', 'modesty-real-world-dilemmas'}


def main(dry_run=False):
    acts = load('activities')
    patch(acts)
    # the patched appendices / steps must not mention the client's name, nor the words the client asked us to avoid
    for a in acts:
        if a['id'] in PATCHED:
            for ap in a.get('appendices') or []:
                for part in (ap['label'], ap['content']):  # checked separately, so a label+content seam can't give a false hit
                    assert not any(b in part for b in BANNED), (a['id'], ap['label'])
            for st in a.get('flow') or []:
                assert not any(b in st.get('body', '') for b in BANNED), (a['id'], st['label'])
    if not dry_run:
        save('activities', acts)
    print(('(dry run) ' if dry_run else '') + f'patched {len(PATCHED)} activities')


if __name__ == '__main__':
    main(dry_run='--dry-run' in sys.argv)
