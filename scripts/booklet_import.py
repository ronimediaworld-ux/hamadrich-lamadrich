# -*- coding: utf-8 -*-
import json
R='src/data/readings.json'; S='src/data/staffStudy.json'
def reading(id,title,age,mn,mx,desc,text,how,tags,src='אנונימי',dom='ערכי'):
    return dict(id=id,title=title,domain=dom,ageLabel=age,ageMin=mn,ageMax=mx,description=desc,text=text,howToUse=how,source=src,tags=tags)
def staff(id,title,topic,duration,forWhom,description,goals,opening,content,discussion,takeaway):
    return dict(id=id,title=title,topic=topic,duration=duration,forWhom=forWhom,description=description,goals=goals,opening=opening,content=content,discussion=discussion,takeaway=takeaway)
def add(readings=(),staffs=()):
    r=json.load(open(R,encoding='utf-8')); s=json.load(open(S,encoding='utf-8'))
    ri={x['id'] for x in r}; si={x['id'] for x in s}
    r+=[x for x in readings if x['id'] not in ri]; s+=[x for x in staffs if x['id'] not in si]
    json.dump(r,open(R,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
    json.dump(s,open(S,'w',encoding='utf-8'),ensure_ascii=False,indent=2)
    print('readings',len(r),'staff',len(s))
