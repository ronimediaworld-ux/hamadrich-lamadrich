# -*- coding: utf-8 -*-
"""מכניס את המדריך "לילה לבן" (התוכן מתוך סקריפט היצירה של ה-PDF) לעמוד נדבר ת׳כלס.
הרצה: python3 scripts/white_night_to_site.py"""
import json, re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = pathlib.Path("/Users/rwtmgrws/Documents/claude/לילה לבן/add_white_night_guide.py")
code = SRC.read_text(encoding="utf-8").split("# ---------- 2) PDF")[0]
ns = {"__file__": str(SRC)}
exec(code, ns)
G = ns["G"]
ts = ROOT / "src/pages/HowToBuild.tsx"
s = ts.read_text(encoding="utf-8")
if "id: 'white-night'" in s:
    s = re.sub(r"  \{\n    id: 'white-night',.*?\n  \},\n(?=  \{\n    id: 'canva',)", "", s, flags=re.S)
j = lambda v: json.dumps(v, ensure_ascii=False)
lines = lambda arr: ",\n".join("      " + j(x) for x in arr)
block = f"""  {{
    id: 'white-night',
    tab: {j(G['tab'])},
    heading: {j(G['heading'])},
    intro:
      {j(G['intro'])},
    partsTitle: {j(G['partsTitle'])},
    parts: [
{lines(G['parts'])},
    ],
    steps: [
{lines(G['steps'])},
    ],
    mistakes: [
{lines(G['mistakes'])},
    ],
    checklist: [
{lines(G['checklist'])},
    ],
    extra: 'talk-cards',
    pdf: '/guides/lila-lavan-madrich.pdf',
  }},
"""
marker = "  {\n    id: 'canva',"
assert marker in s
s = s.replace(marker, block + marker, 1)
if "pdf?: string;" not in s:
    s = s.replace("  extra?: 'talk-cards' | 'canva-links' | 'seven-parts';", "  extra?: 'talk-cards' | 'canva-links' | 'seven-parts';\n  /** קובץ להדפסה שאפשר להוריד לצד המדריך */\n  pdf?: string;", 1)
    s = s.replace("""          <CopyButton variant="mini" text={guideToText(guide)} label="העתקת המדריך" />""", """          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {guide.pdf && <a href={guide.pdf} download className="chip" style={{ fontSize: 13, fontWeight: 700 }}>להורדה כקובץ להדפסה (PDF)</a>}
            <CopyButton variant="mini" text={guideToText(guide)} label="העתקת המדריך" />
          </div>""", 1)
ts.write_text(s, encoding="utf-8")
print("ok")
