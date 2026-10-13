"""Extract only compatible study clips and repack referenced binary data as GLB."""
import json,struct,pathlib
source=pathlib.Path('/tmp/lugaish-rig')
x=json.loads((source/'source.gltf').read_text());binary=(source/x['buffers'][0]['uri']).read_bytes()
names={'Idle_Loop':'idle','Walk_Loop':'walk','Jog_Fwd_Loop':'run','Sitting_Enter':'sitDown','Sitting_Exit':'standUp','Sitting_Idle_Loop':'seated'}
x['animations']=[a for a in x['animations'] if a['name'] in names]
for a in x['animations']:a['name']=names[a['name']]
used=set()
for mesh in x['meshes']:
 for p in mesh['primitives']:
  used.update(p['attributes'].values())
  if 'indices' in p:used.add(p['indices'])
for skin in x['skins']:used.add(skin['inverseBindMatrices'])
for a in x['animations']:
 for s in a['samplers']:used.update([s['input'],s['output']])
amap={old:new for new,old in enumerate(sorted(used))}
accessors=[x['accessors'][i] for i in sorted(used)]
views=sorted(set(a['bufferView'] for a in accessors));vmap={old:new for new,old in enumerate(views)}
out=bytearray();newviews=[]
for i in views:
 v=dict(x['bufferViews'][i]);start=v.get('byteOffset',0)
 while len(out)%4:out.append(0)
 v['byteOffset']=len(out);out.extend(binary[start:start+v['byteLength']]);newviews.append(v)
for a in accessors:a['bufferView']=vmap[a['bufferView']]
for mesh in x['meshes']:
 for p in mesh['primitives']:
  p['attributes']={k:amap[v] for k,v in p['attributes'].items()}
  if 'indices' in p:p['indices']=amap[p['indices']]
for skin in x['skins']:skin['inverseBindMatrices']=amap[skin['inverseBindMatrices']]
for a in x['animations']:
 for s in a['samplers']:s['input']=amap[s['input']];s['output']=amap[s['output']]
x['accessors']=accessors;x['bufferViews']=newviews;x['buffers']=[{'byteLength':len(out)}]
x['asset']['extras']={'source':'Quaternius Universal Animation Library (CC0), 2025 mirror; six extracted clips'}
header=json.dumps(x,separators=(',',':')).encode();header+=b' '*((-len(header))%4);out+=b'\0'*((-len(out))%4)
glb=struct.pack('<III',0x46546c67,2,12+8+len(header)+8+len(out))+struct.pack('<II',len(header),0x4e4f534a)+header+struct.pack('<II',len(out),0x004e4942)+out
pathlib.Path('public/models/student/student.glb').write_bytes(glb)
print('Extracted',len(glb),'bytes')
for a in x['animations']:
 print(a['name'],max(x['accessors'][s['input']]['max'][0] for s in a['samplers']))
print([(i,n.get('name'),n.get('translation'),n.get('scale')) for i,n in enumerate(x['nodes']) if 'root' in n.get('name','').lower() or 'mesh' in n or 'hips' in n.get('name','').lower()])
