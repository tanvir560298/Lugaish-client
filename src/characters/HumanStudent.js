import {BufferGeometry,Float32BufferAttribute,Mesh,MeshStandardMaterial,SphereGeometry,TorusGeometry,Group,CatmullRomCurve3,Vector3,Uint16BufferAttribute} from 'three';
// Original Lugaish artwork: anatomical lofts deform across elbow/knee joints.
// Existing selected identities, skeleton and compatible clips are retained.
function loft(profile,sides=20,rings=28){
 const curve=new CatmullRomCurve3(profile.map(([y,x,z])=>new Vector3(x,y,z)),false,'centripetal'),positions=[],indices=[],uv=[];
 for(let r=0;r<=rings;r++){const p=curve.getPoint(r/rings);for(let s=0;s<=sides;s++){const a=s/sides*Math.PI*2;positions.push(Math.max(.001,p.x)*Math.cos(a),p.y,Math.max(.001,p.z)*Math.sin(a));uv.push(s/sides,r/rings);}}
 for(let r=0;r<rings;r++)for(let s=0;s<sides;s++){const a=r*(sides+1)+s,b=a+sides+1;indices.push(a,b,a+1,a+1,b,b+1);}
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
export function attachHumanStudent(scene,preset){
 scene.traverse(o=>{if(o.isMesh)o.visible=false;});
 const bones=[];scene.traverse(o=>{if(o.isBone)bones.push(o);});
 const bone=name=>scene.getObjectByName(name)||scene.getObjectByName(name.replaceAll('.',''));
 const materials=new Map(),sphere=new SphereGeometry(1,20,12);
 const material=(color,roughness=.85)=>{const key=`${color}:${roughness}`;if(!materials.has(key))materials.set(key,new MeshStandardMaterial({color,roughness,metalness:0}));return materials.get(key);};
 const shape=(parent,color,position,scale,roughness=.85)=>{const mesh=new Mesh(sphere,material(color,roughness));mesh.position.set(...position);mesh.scale.set(...scale);mesh.castShadow=true;parent.add(mesh);return mesh;};
 const sculpt=(parent,profile,color,second=null,joint=0,blend=.07)=>{
  const geometry=loft(profile);if(second){const positions=geometry.attributes.position,ids=[],weights=[];for(let i=0;i<positions.count;i++){const t=Math.max(0,Math.min(1,(positions.getY(i)-joint+blend)/(blend*2))),w=t*t*(3-2*t);ids.push(bones.indexOf(parent),bones.indexOf(second),0,0);weights.push(1-w,w,0,0);}geometry.setAttribute('skinIndex',new Uint16BufferAttribute(ids,4));geometry.setAttribute('skinWeight',new Float32BufferAttribute(weights,4));}
  const mesh=new Mesh(geometry,material(color));mesh.castShadow=true;parent.add(mesh);return mesh;
 };
 const torso=bone('DEF-spine.001'),hips=bone('DEF-hips');
 if(torso){const shirt=sculpt(torso,[[-.095,.08,.055],[-.05,.17,.115],[.03,.175,.12],[.16,.19,.12],[.29,.215,.115],[.36,.225,.112],[.405,.225,.104],[.445,.17,.082],[.465,.055,.05]],preset.jacketColor,bone('DEF-spine.002'),.125,.065);shirt.userData.breath=true;
  shape(torso,preset.innerColor,[0,.35,.09],[.07,.045,.02]);
  for(const x of [-.075,.075]){const collar=shape(torso,preset.innerColor,[x,.36,.088],[.06,.025,.025]);collar.rotation.z=x<0?-.4:.4;}
  for(const y of [.12,.20,.28])shape(torso,'#d9d5c6',[.025,y,.12],[.009,.009,.006],.5);
  shape(torso,preset.backpackColor,[0,.17,-.15],[.16,.20,.065]);for(const x of [-.15,.15])shape(torso,preset.backpackColor,[x,.25,.088],[.014,.14,.018]);
 }
 if(hips)shape(hips,preset.pantsColor,[0,.018,0],[.18,.095,.12]);
 for(const side of ['L','R']){
  const upper=bone(`DEF-upper_arm.${side}`),fore=bone(`DEF-forearm.${side}`),thigh=bone(`DEF-thigh.${side}`),shin=bone(`DEF-shin.${side}`),hand=bone(`DEF-hand.${side}`),foot=bone(`DEF-foot.${side}`);
  if(upper&&fore)sculpt(upper,[[-.055,.015,.014],[-.025,.07,.063],[.025,.082,.075],[.11,.074,.068],[.23,.063,.058],[.275,.062,.055],[.34,.061,.051],[.43,.054,.046],[.51,.039,.035],[.555,.033,.030]],preset.jacketColor,fore,.274,.065);
  if(thigh&&shin)sculpt(thigh,[[-.025,.055,.055],[.04,.105,.095],[.18,.093,.084],[.32,.074,.068],[.40,.069,.064],[.48,.072,.062],[.60,.066,.054],[.76,.049,.043],[.832,.045,.04]],preset.pantsColor,shin,.4,.075);
  if(hand){shape(hand,preset.skinColor,[0,.027,0],[.036,.052,.028],.6);shape(hand,preset.skinColor,[0,.086,.002],[.047,.063,.026],.6);
   for(const [i,x]of [-.029,-.009,.012,.030].entries()){const finger=sculpt(hand,[[.105,.011,.012],[.13,.010,.012],[.165-(i===3?.015:0),.008,.01],[.174-(i===3?.015:0),.001,.001]],preset.skinColor);finger.position.x=x;finger.material=material(preset.skinColor,.6);}
   const thumb=shape(hand,preset.skinColor,[(side==='L'?1:-1)*.047,.075,.02],[.019,.039,.019],.6);thumb.rotation.z=side==='L'?-.45:.45;
  }
  if(foot){shape(foot,preset.shoeColor,[0,.082,-.038],[.076,.125,.045],.8);shape(foot,'#e7e2d7',[0,.083,.006],[.078,.126,.014]);for(const y of [.055,.08,.105])shape(foot,'#e7e2d7',[0,y,-.081],[.037,.004,.005]);}
 }
 const neck=bone('DEF-neck');if(neck)sculpt(neck,[[0,.058,.055],[.045,.057,.052],[.09,.062,.055]],preset.skinColor);
 const head=bone('DEF-head');if(!head)return;const face=new Group();head.add(face);
 const faceMesh=sculpt(face,[[-.055,.028,.035],[0,.098,.092],[.07,.143,.12],[.15,.158,.135],[.24,.14,.122],[.285,.085,.08],[.3,.001,.001]],preset.skinColor);faceMesh.material=material(preset.skinColor,.6);
 for(const x of [-.154,.154]){shape(face,preset.skinColor,[x,.115,-.005],[.028,.045,.023],.6);shape(face,'#d59682',[x*1.01,.115,.013],[.013,.026,.006],.7);}
 for(const x of [-.057,.057]){const white=shape(face,'#fff8eb',[x,.14,.126],[.033,.028,.014],.35),iris=shape(face,'#5d402c',[x,.139,.139],[.017,.021,.006],.3),pupil=shape(face,'#241e1b',[x,.139,.145],[.009,.015,.003],.25),shine=shape(face,'#ffffff',[x-.006,.147,.149],[.005,.006,.002],.3);for(const eye of [white,iris,pupil,shine])eye.userData.blink=true;
  const brow=shape(face,preset.hairColor,[x,.184,.12],[.031,.009,.007],.5);brow.rotation.z=x<0?.15:-.15;shape(face,'#e6aa94',[x*1.6,.082,.105],[.028,.015,.009],.7);
 }
 shape(face,preset.skinColor,[0,.105,.14],[.025,.035,.021],.6);shape(face,'#c7806d',[0,.065,.125],[.037,.008,.006],.65);shape(face,'#fff2df',[0,.067,.13],[.021,.003,.003],.6);
 shape(face,preset.hairColor,[0,.245,-.034],[.161,.082,.123],.5);
 for(let i=0;i<5;i++){const x=(i-2)*.048,lock=shape(face,preset.hairColor,[x,.244-Math.abs(x)*.25,.06],[.047,.052,.07],.5);lock.rotation.z=.35;}
 if(preset.hairStyle!=='short'){shape(face,preset.hairColor,[0,.12,-.115],[.15,preset.hairStyle==='wavy'?.21:.15,.043],.5);for(const side of [-1,1]){const lock=shape(face,preset.hairColor,[side*.142,.09,-.027],[.029,preset.hairStyle==='wavy'?.15:.10,.07],.5);lock.rotation.z=side*.1;}}
 if(preset.hasGlasses){for(const x of [-.057,.057]){const rim=new Mesh(new TorusGeometry(.036,.003,6,24),material(preset.glassesColor,.4));rim.position.set(x,.14,.157);rim.scale.y=.85;face.add(rim);}shape(face,preset.glassesColor,[0,.145,.157],[.02,.003,.003],.4);}
}
