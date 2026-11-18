# -*- coding: utf-8 -*-
"""מוסיף את המדריך "לילה לבן" לעמוד נדבר ת׳כלס (src/pages/HowToBuild.tsx) ומפיק ממנו קובץ PDF להדפסה.
הרצה: python3 scripts/add_white_night_guide.py"""
import json, re, subprocess, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
G = {
    "id": "white-night",
    "tab": "לילה לבן",
    "heading": "איך מקיימים לילה לבן בחודש ארגון",
    "intro": "לילה לבן הוא הלילה היחיד בשנה שבו יש לכם זמן, קרבה ואנרגיה משותפת. אפשר לנצל אותו רק כדי לסיים צביעה וחזרות, ואפשר להפוך אותו ללילה שחניכים זוכרים שנים: כזה שבו כל חניך נראה אישית, הקבוצה מתחברת, ויש רגע אחד משמעותי שחיכיתם לו. העבודה היא הבסיס, והשאר נבנה סביבה.",
    "partsTitle": "מה בונה לילה לבן טוב",
    "parts": [
        {"name": "עבודה עם תפקיד לכל חניך", "meta": "רוב הלילה",
         "what": "קירות, חזרות והכנות הם הסיבה שנשארים ערים. מחלקים את החניכים לקבוצות עבודה קטנות, ולכל חניך יש תפקיד ברור שאחרים מסתמכים עליו. ככה העבודה עצמה מחברת ולא רק מעייפת.",
         "tip": "חניך שקט שמקבל אחריות על פרט אחד (צבע, שיר, מפקד) מרגיש בעל בית. תנו תפקיד שאפשר לסיים, ולא \"תעזור לשאר\"."},
        {"name": "שיחה אישית עם כל חניך", "meta": "לאורך כל הלילה",
         "what": "זה הזמן. בשגרה אין שקט כזה. כל מדריך לוקח 3–4 חניכים ומוציא כל אחד לעשר דקות בהליכה או בפינה שקטה, בזמן שהאחרים ממשיכים לעבוד. שלוש שאלות מספיקות: מה היה הרגע הכי טוב שלך השנה בסניף, מה היית רוצה שישתנה, ומה אתה לוקח מהחודש הזה.",
         "tip": "עייפות הורסת שיחה, ולכן מתחילים בשיחות כבר בשעות הראשונות ומסיימים אותן עד 3:00. כרטיסיות שאלות להדפסה מחכות בסוף הדף."},
        {"name": "גיבוש קבוצתי", "meta": "בהפסקות",
         "what": "לא צריך תוכנית גדולה, צריך שלושה רגעים קבועים: מעגל פתיחה בערב, ארוחה חמה משותפת בחצות ומעגל סיכום עם הזריחה. ביניהם שירה, משחקים וצחוק. הגיבוש נוצר מהדברים הקטנים: מי הכין למי קפה, ומי הצחיק את כולם בשלוש בלילה.",
         "tip": "הכינו מראש רשימת שירים ומשחק קצר אחד לכל השבט, כדי שיהיה מה לעשות כשהאנרגיה נופלת."},
        {"name": "הרגע המשמעותי שחיכיתם לו", "meta": "רגע אחד מתוכנן",
         "what": "הלילה הלבן הוא הזדמנות לדבר שאין לו מקום בשגרה ושחיכיתם לרגע הנכון בשבילו. למשל: להעניק לחניך תפקיד או אחריות חדשה, להקריא לכל חניך מכתב אישי מהמדריך, להכריז על משהו שהקבוצה מחכה לו, לסגור שלב בשנה בטקס קטן, או להודות בפומבי לחניך שעשה משהו גדול.",
         "tip": "בחרו רגע אחד ולא חמישה, ומקמו אותו סביב חצות כשעוד יש כוחות, ולא ברבע האחרון של הלילה כשכולם נרדמים."},
        {"name": "מה עושים בשאר הזמן", "meta": "ארגז רעיונות מוכן",
         "what": "בין 2:00 ל-4:00 האנרגיה יורדת, ולכן כדאי שיהיה ארגז אפשרויות ולבחור לפי הקבוצה: בישול משותף (פנקייקים, שקשוקה, מרק); ערב קולנוע קצר או סרטון הזיכרונות של השנה; חדר בריחה או תחרות בין שבטים בתוך הסניף; \"מכתב לעצמי בעוד שנה\"; מעגל שיחה על שאלה אחת גדולה; הכנת סרטון או אלבום תמונות מהחודש; טיול לילה קצר לצפייה בכוכבים, אם בטוח ומאושר; ותפילת שחרית משותפת עם הזריחה, אם מתאים לכם.",
         "tip": "כשהאנרגיה נופלת, פעילות גופנית ואוכל חם עובדים יותר מכל שיחה."},
        {"name": "אנרגיה ובטיחות", "meta": "כל הלילה",
         "what": "לילה בלי שינה דורש כללים ברורים: אישורי הורים מראש; לפחות מדריך אחראי אחד ער ובוגר בכל שעה, והשאר מתחלפים במנוחה; מים ואוכל לאורך הלילה; ואחרי 3:00 לא עובדים עם סולמות, בגובה או עם כלים חדים. חניך שקורס מקבל מקום לישון בלי ביקורת.",
         "tip": "בבוקר אף חניך לא חוזר הביתה לבד ועייף. מתאמים מראש הורים שאוספים, או מלווים."},
    ],
    "steps": [
        {"n": 1, "title": "לפני הלילה: שלוש מטרות ואישורים", "body": "מחליטים מה חייב להסתיים (קיר, חזרה), מה רוצים שיקרה בין החניכים, ומה הרגע המשמעותי. שולחים להורים אישור עם שעות, מה להביא ומי אחראי."},
        {"n": 2, "title": "חלקו מראש חניכים בין המדריכים", "body": "כל מדריך אחראי על 3–4 חניכים לשיחות אישיות. כך אף חניך לא נשכח, והעבודה לא נעצרת כשמדריך יוצא לשיחה."},
        {"n": 3, "title": "פתחו בערב במעגל קצר", "body": "עשר דקות: מה הלילה הזה, מה יש לכל אחד לעשות ומי המדריך שלו. מדגישים שמותר לקחת הפסקה."},
        {"n": 4, "title": "20:00–24:00: עבודה ושיחות במקביל", "body": "רוב ההכנות נעשות עכשיו, כשיש כוחות. במקביל מוציאים חניכים לשיחות אישיות לפי הרשימה."},
        {"n": 5, "title": "סביב חצות: ארוחה משותפת והרגע המשמעותי", "body": "עוצרים את העבודה לכולם, אוכלים חם יחד ועושים את הרגע שהכנתם. חצי שעה שהקבוצה זוכרת."},
        {"n": 6, "title": "2:00–4:00: מעבר לפעיל", "body": "מחליפים לארגז הרעיונות: בישול, משחקים, שירה או חדר בריחה. שיחות העומק נגמרו, ומה שנשאר מהעבודה הוא רק מה שלא מסוכן."},
        {"n": 7, "title": "זריחה: מעגל סיכום ושחרור הביתה", "body": "מעגל אחרון: משפט אחד מכל חניך על מה שהוא לוקח מהלילה, תודה לכולם, תפילת שחרית אם מתאים, ארוחת בוקר ויציאה בטוחה."},
        {"n": 8, "title": "אחרי הלילה: סיכום קצר", "body": "ביום שאחרי: הודעת תודה לקבוצה, ובשבילכם משפט אחד על כל חניך ושיחה על מה שעלה. כך הלילה ממשיך לעבוד גם בשבועות שאחריו."},
    ],
    "mistakes": [
        "מדחיסים עבודה עד הרגע האחרון ולא משאירים זמן לשיחות, והלילה הופך לעוד ערב עבודה.",
        "עורכים שיחות רק עם החניכים הבולטים או הקרובים. דווקא החניך השקט צריך אותה הכי הרבה.",
        "אין תוכנית לשעות 2:00–4:00, ומחכים שיהיה מה לעשות.",
        "משאירים את הרגע המשמעותי לסוף, כשכולם עייפים וחצי ישנים.",
        "דורשים מכל חניך להישאר ער. מי שצריך לישון, ישן, בלי תחושה של בושה.",
        "משחררים חניך עייף לחזור הביתה לבד בבוקר.",
    ],
    "checklist": [
        "יש לי אישורי הורים וידוע מי אחראי על הלילה.",
        "ברור לי מה חייב להסתיים ומה הרגע המשמעותי שאנחנו עושים.",
        "כל מדריך יודע על אילו 3–4 חניכים הוא אחראי לשיחות.",
        "יש לוח זמנים גמיש עם מעגל פתיחה, ארוחה בחצות ומעגל סיכום.",
        "יש ארגז רעיונות לשעות 2:00–4:00.",
        "אוכל חם ומים מוכנים לחצות ולבוקר.",
        "בכל שעה יש מדריך ער ובוגר, והמדריכים מתחלפים במנוחה.",
        "ברור איך כל חניך חוזר הביתה בבוקר.",
        "תכננתי הודעת תודה ושיחת סיכום ליום שאחרי.",
    ],
}

# טווחי מספרים: בכיוון עברי המקף מהפך את הסדר (24:00–20:00), לכן כותבים "עד"
def fix(o):
    if isinstance(o, str):
        return re.sub(r"(\d+(?::\d+)?)–(\d+(?::\d+)?)", r"\1 עד \2", o)
    if isinstance(o, list):
        return [fix(x) for x in o]
    if isinstance(o, dict):
        return {k: fix(v) for k, v in o.items()}
    return o
G = fix(G)

# ---------- 1) הכנסה ל-HowToBuild.tsx ----------
ts_path = ROOT / "src/pages/HowToBuild.tsx"
s = ts_path.read_text(encoding="utf-8")
if "id: 'white-night'" in s:
    s = re.sub(r"  \{\n    id: 'white-night',.*?\n  \},\n(?=  \{\n    id: 'canva',)", "", s, flags=re.S)
if "id: 'white-night'" not in s:
    obj = dict(G)
    parts = ",\n".join("      " + json.dumps(p, ensure_ascii=False) for p in G["parts"])
    steps = ",\n".join("      " + json.dumps(p, ensure_ascii=False) for p in G["steps"])
    mist = ",\n".join("      " + json.dumps(p, ensure_ascii=False) for p in G["mistakes"])
    chk = ",\n".join("      " + json.dumps(p, ensure_ascii=False) for p in G["checklist"])
    block = f"""  {{
    id: 'white-night',
    tab: {json.dumps(G['tab'], ensure_ascii=False)},
    heading: {json.dumps(G['heading'], ensure_ascii=False)},
    intro:
      {json.dumps(G['intro'], ensure_ascii=False)},
    partsTitle: {json.dumps(G['partsTitle'], ensure_ascii=False)},
    parts: [
{parts},
    ],
    steps: [
{steps},
    ],
    mistakes: [
{mist},
    ],
    checklist: [
{chk},
    ],
    extra: 'talk-cards',
  }},
"""
    marker = "  {\n    id: 'canva',"
    assert marker in s
    s = s.replace(marker, block + marker, 1)
    ts_path.write_text(s, encoding="utf-8")
    print("guide added to HowToBuild.tsx")

# ---------- 2) PDF להדפסה ----------
COLORS = [("#2F7A4B", "#E7F3EA"), ("#B34E14", "#FBEBDD"), ("#2F5F95", "#E5EEF8"), ("#6B4A9B", "#EEE8F6"), ("#A63D6B", "#F8E6EE"), ("#7A5B00", "#FAF0CF"), ("#176B6B", "#DFF1F1")]
e = html.escape
def card(i, name, meta, what, tip):
    c, t = COLORS[i % 7]
    return f'<div class="card" style="background:{t};border-right:6px solid {c}"><div class="ch"><b style="color:{c}">{e(name)}</b><span style="color:{c}">{e(meta)}</span></div><p>{e(what)}</p><p class="tip"><b style="color:{c}">טיפ:</b> {e(tip)}</p></div>'
parts_html = "".join(card(i, p["name"], p["meta"], p["what"], p["tip"]) for i, p in enumerate(G["parts"]))
steps_html = "".join(f'<div class="step"><span class="n" style="background:{COLORS[i%7][0]}">{s_["n"]}</span><div><b>{e(s_["title"])}</b><p>{e(s_["body"])}</p></div></div>' for i, s_ in enumerate(G["steps"]))
mist_html = "".join(f"<li>{e(m)}</li>" for m in G["mistakes"])
chk_html = "".join(f"<li><span class='box'></span>{e(c)}</li>" for c in G["checklist"])
doc = f"""<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><title>{e(G['heading'])}</title>
<style>
@font-face{{font-family:Heebo;src:url("file://{ROOT}/docs/video/campfire/assets/fonts/Heebo.ttf");font-weight:100 900}}
@page{{size:A4;margin:14mm 14mm 16mm}}
*{{box-sizing:border-box}} body{{font-family:Heebo,sans-serif;color:#2a2438;font-size:11.2pt;line-height:1.6;margin:0}}
header{{display:flex;align-items:center;gap:10px;border-bottom:3px solid #FF7A1F;padding-bottom:8px;margin-bottom:12px}}
header .brand{{font-weight:800;color:#B34E14;font-size:12pt}} h1{{font-size:22pt;margin:6px 0 4px;font-weight:900}}
.intro{{font-size:11.6pt;margin:0 0 12px}} h2{{font-size:14pt;margin:16px 0 8px;font-weight:800}}
.card{{border-radius:10px;padding:9px 12px;margin-bottom:8px;break-inside:avoid}} .card p{{margin:2px 0}}
.ch{{display:flex;justify-content:space-between;gap:10px;font-size:11.8pt}} .tip{{font-size:10.4pt;color:#4a4458}}
.step{{display:flex;gap:10px;margin-bottom:7px;break-inside:avoid}} .step p{{margin:1px 0 0;font-size:10.8pt}}
.n{{flex:none;width:26px;height:26px;border-radius:50%;color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;font-size:11pt}}
ul{{margin:0;padding-right:20px}} li{{margin-bottom:4px}} .chk{{list-style:none;padding:0}} .chk li{{display:flex;gap:9px;align-items:flex-start}}
.box{{flex:none;width:13px;height:13px;border:2px solid #176B6B;border-radius:3px;margin-top:5px}}
.mist{{background:#F8E6EE;border-right:6px solid #A63D6B;border-radius:10px;padding:9px 14px;break-inside:avoid}}
footer{{margin-top:14px;font-size:9pt;color:#7a7488;text-align:center}}
</style></head><body>
<header><span class="brand">המדריך למדריך · נדבר ת׳כלס</span></header>
<h1>{e(G['heading'])}</h1><p class="intro">{e(G['intro'])}</p>
<h2 style="color:#2F7A4B">{e(G['partsTitle'])}</h2>{parts_html}
<h2 style="color:#B34E14">שלב אחרי שלב</h2>{steps_html}
<h2 style="color:#A63D6B">טעויות נפוצות</h2><div class="mist"><ul>{mist_html}</ul></div>
<h2 style="color:#176B6B">רשימת בדיקה</h2><ul class="chk">{chk_html}</ul>
<footer>hamadrich-lamadrich.com/how-to-build?guide=white-night</footer>
</body></html>"""
out_html = ROOT / "docs/guides/lila-lavan.html"
out_html.write_text(doc, encoding="utf-8")
chrome = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
pdf = ROOT / "docs/guides/lila-lavan-madrich.pdf"
subprocess.run([chrome, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={pdf}", f"file://{out_html}"], check=True, capture_output=True, timeout=120)
print("pdf:", pdf, pdf.stat().st_size)
