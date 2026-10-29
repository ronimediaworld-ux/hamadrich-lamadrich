# -*- coding: utf-8 -*-
"""מודל זמנים ריאלי לשלבי פעולה, על בסיס מחקר: הקראה בקול 110-130 מילים בדקה, דיון 3-5 דקות לשאלה (קבוצה של 10-25),
הסבר כללי המשחק 2-3 דקות וסבב משחק 3-5 דקות, תוספת מעברים, ותוספת ביטחון לפי הטיית התכנון (פי 1.3-1.5).
הפונקציות כאן רק מחשבות; הכתיבה לנתונים נעשית בסקריפט נפרד."""
import re, json, math

READ_WPM = 120      # מדריך שקורא בקול לקבוצה (רגיל 120-130, בכיתות צעירות 110)
SPEAK_WPM = 130     # הסבר בעל פה
DISCUSS_PER_Q = 4   # דקות לשאלה פתוחה בקבוצה
TRANSITION = 1      # דקה למעבר בין שלבים (התכנסות, הזזת כסאות)
MARK = re.compile(r'[*•]')


def words(t):
    return len(re.findall(r'\S+', MARK.sub(' ', t or '')))


def kind_of(label):
    l = label
    if re.search(r"צ[׳']ופר", l): return 'chupar'
    if 'סיכום' in l: return 'summary'
    if re.search('דיון|שאלות לדיון', l): return 'discussion'
    if re.search('קטע|סיפור|מקור|קריאה', l): return 'reading'
    if re.search('הסבר|חיבור|ומה זה קשור|מכאן', l): return 'explanation'
    if 'פתיחה' in l: return 'opening'
    if re.match(r'^(מתודה|מהלך)', l.strip()): return 'main'
    if re.search('משחק|חידות|תרגיל|סבב|תחנות|משימ', l): return 'game'
    return 'other'


def step_text(s):
    if s.get('body'): return s['body']
    return ' '.join(s.get('items') or [])


def model_minutes(s, young=False):
    """דקות מוצעות לשלב, לפי סוגו ואורך הטקסט שלו; מעוגל לדקה שלמה"""
    k = kind_of(s['label'])
    t = step_text(s)
    w = words(t)
    rwpm = 110 if young else READ_WPM
    if k == 'chupar': return 2
    everyone = bool(re.search('כל חניך|כל אחד|כל אחת|סבב', t))   # כשכל חניך מדבר, 15 חניכים כפול כחצי דקה
    if k == 'summary': return max(5 if everyone else 3, math.ceil(w / SPEAK_WPM + (4 if everyone else 2)))
    if k == 'discussion':
        n = len(s.get('items') or []) or max(1, len(re.findall(r'[?؟]', t)))
        return max(5, DISCUSS_PER_Q * min(n, 3) + min(max(n - 3, 0), 2))   # שלוש שאלות ראשונות בקצב מלא, השאר רשות
    if k == 'reading': return math.ceil(w / rwpm + 2)       # הקראה + תגובה קצרה
    if k == 'explanation': return math.ceil(w / SPEAK_WPM + 2) # הסבר + בדיקת הבנה
    if k == 'opening': return max(5 if everyone else 3, math.ceil(w / SPEAK_WPM + (4 if everyone else 3)))
    if k in ('game', 'other'): return max(8, math.ceil(3 + w / SPEAK_WPM + 8))  # הסבר חוקים + שני סבבים + שאלה אחרי
    if k == 'main': return max(8, math.ceil(3 + w / SPEAK_WPM + 2 * len(re.findall(r'^\s*(?:\d+\.|•)', t, re.M)) + 3))
    return None


def label_minutes(label):
    m = re.search(r'\((\d+)(?:\s*[–-]\s*(\d+))?\s*דק', label)
    if not m: return None
    return round((int(m.group(1)) + int(m.group(2))) / 2) if m.group(2) else int(m.group(1))


TEXT_KINDS = ('opening', 'reading', 'explanation', 'discussion', 'summary')   # שלבים שזמנם נגזר מאורך הטקסט
