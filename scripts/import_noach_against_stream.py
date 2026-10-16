# -*- coding: utf-8 -*-
import json, re, zipfile
def paras(f):
    z=zipfile.ZipFile('/Users/rwtmgrws/Desktop/'+f)
    x=z.read('word/document.xml').decode('utf-8')
    out=[]
    for p in re.findall(r'<w:p[ >].*?</w:p>',x,flags=re.S):
        p=re.sub(r'<w:br[^>]*/>','\n',p)
        t=''.join(a or b for a,b in re.findall(r'<w:t[^>]*>(.*?)</w:t>|(\n)',p,flags=re.S))
        t=t.replace('\xa0',' ').replace('&amp;','&').replace('&quot;','"').replace('&lt;','<').replace('&gt;','>').strip()
        out.append(t)
    return out
def block(ps,start_pred,end_pred):
    i=next(k for k,p in enumerate(ps) if start_pred(p)); j=next(k for k,p in enumerate(ps) if k>i and end_pred(p))
    return ps[i:j]
def build(f, aid, title, ageLabel, amin, amax, story_title, mins):
    ps=paras(f)
    k_parasha=next(k for k,p in enumerate(ps) if p.startswith('הפרשה בקצרה'))
    parasha=ps[k_parasha+1]; mainmsg=ps[k_parasha+2]
    k_games=next(k for k,p in enumerate(ps) if p.startswith('משחקים'))
    k_story=next(k for k,p in enumerate(ps) if p.startswith('סיפור:'))
    k_msg=next(k for k,p in enumerate(ps) if k>k_story and p.startswith('מסר'))
    games=[p for p in ps[k_games+1:k_story] if p]
    # games: name, description, message(s)
    herd=[p for p in games[:3]]; king=[p for p in games[3:6]]
    story=[p for p in ps[k_story+1:k_msg] if p]
    msg=[p for p in ps[k_msg+1:] if p]
    closing=msg[-1] if msg and msg[-1].startswith('שבת שלום') else ''
    msg_body=[p for p in msg if not p.startswith('שבת שלום')]
    msg_title=ps[k_msg]
    herd_name=herd[0]; herd_msg=herd[2]
    king_name=king[0]; king_msg=king[2]
    g1=f"{herd[1]}\n\n{herd_msg}"
    g2=f"{king[1]}\n\n{king_msg}"
    q1=herd_msg.replace('מסר:','').strip(); q2=king_msg.replace('מסר:','').strip()
    q3=next((p for p in msg_body if p.startswith('אז השאלה')),'').strip()
    story_text='\n\n'.join(story)
    msg_text='\n\n'.join(msg_body)+('\n\n'+closing if closing else '')
    intro=f"{parasha}\n\n{mainmsg}"
    flow=[
     {"label":f"פתיחה: הפרשה בקצרה ({mins[0]} דק׳)","body":intro},
     {"label":f"משחק: {herd_name.strip()} ({mins[1]} דק׳)","body":g1},
     {"label":f"משחק: {king_name.strip()} ({mins[2]} דק׳)","body":g2},
     {"label":f"סיפור: {story_title} ({mins[3]} דק׳)","body":story_text},
     {"label":f"מסר וסיכום ({mins[4]} דק׳)","body":msg_text},
    ]
    return dict(id=aid,title=title,categorySlug='activities',subtopics=['פרשת נח','לעמוד נגד הזרם','לחץ חברתי'],
      ageLabel=ageLabel,ageMin=amin,ageMax=amax,duration=sum(mins),groupSize='8–30 חניכים',equipment=[],shabbat='שבת',place='פנים',energy='בינונית',depth='בינוני',
      values=['אומץ','אמת','זהות'],tags=['פרשת שבוע','נח','לעמוד נגד הזרם','משחקים','סיפור'],rating=4.5,character='D',
      description="נח עמד נגד הזרם. שני משחקים מוכרים וסיפור שמראים אותנו כשאנחנו עושים מה שכולם עושים, ושאלה מה אנחנו באמת מאמינים בו.",
      goals=["החניכים יבינו שנח בחר בדרך הישר גם כשכל סביבו הלכו אחרת","החניכים ישאלו את עצמם מתי הם עושים דברים כי מאמינים בהם, ומתי רק כדי שכולם יחשבו עליהם טוב"],
      opening=intro, game=g1+"\n\n"+g2, method=story_text, discussion=[q1,q2,q3] if q3 else [q1,q2],
      guideNotes='', summary=msg_text, tip="אפשר לשחק את שני המשחקים ברצף ולעבור מיד לסיפור, ולשמור את שאלת המסר לסוף.",
      shabbatNote="כולה בעל פה, בלי כתיבה ובלי ציוד. מתאימה לשבת.", flow=flow)
older=build('פעולה לשבת נח- לעמוד נגד הזרם!.docx','noach-against-the-stream-7-9','נח: לעמוד נגד הזרם',"כיתה ז'-ט'",7,9,'גן עדן או גיהנום',[5,8,7,10,8])
younger=build('פעולה לשבת נח- לעמוד נגד הזרם!2.docx','noach-against-the-stream-3-6','נח: לעמוד נגד הזרם (גרסה לצעירים)',"כיתה ג'-ו'",3,6,'קלודט קולווין',[5,8,7,8,7])
P='src/data/activities.json'
d=json.load(open(P,encoding='utf-8'))
ids={x['id'] for x in d}
for a in (older,younger):
    if a['id'] not in ids: d.append(a)
json.dump(d,open(P,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
print(len(d)); print(json.dumps(older['flow'][1],ensure_ascii=False)); print(older['discussion']); print(younger['discussion'])
