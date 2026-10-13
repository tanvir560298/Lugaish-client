import { CanvasTexture, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace, TextureLoader, Vector2 } from 'three';
// Original, deterministic, small procedural surfaces. Shared for the lifetime
// of the campus, just like cached geometry; local CC0 maps load once, never per frame.
const textures=new Map(),materials=new Map();
const photographed={};let started=false;
function loadPhotographedWood(){
 if(started)return;started=true;
 const loader=new TextureLoader();
 for(const [channel,file]of [['map','wood-color.jpg'],...(!window.matchMedia('(max-width:760px)').matches?[['normalMap','wood-normal.jpg'],['roughnessMap','wood-roughness.jpg']]:[])])loader.load('/textures/campus/'+file,source=>{
  if(channel==='map')source.colorSpace=SRGBColorSpace;
  source.wrapS=source.wrapT=RepeatWrapping;source.anisotropy=4;
  for(const kind of ['floor','oak']){
   const t=kind==='floor'?source:source.clone();t.repeat.set(kind==='floor'?16:1,kind==='floor'?18:1);t.needsUpdate=true;
   photographed[kind+channel]=t;
   for(const [key,material]of materials)if(key.startsWith(kind)){material[channel]=t;material.normalScale=new Vector2(.18,.18);material.needsUpdate=true;}
  }
 },undefined,()=>console.warn('Campus wood texture unavailable; retaining procedural surface.'));
}
function texture(kind){
 if(textures.has(kind))return textures.get(kind);
 const c=document.createElement('canvas');c.width=512;c.height=512;const g=c.getContext('2d');
 let seed=37;const random=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
 if(kind==='oak'||kind==='floor'){
  g.fillStyle=kind==='floor'?'#e3d8c3':'#f2e6d0';g.fillRect(0,0,512,512);
  for(let row=0;row<8;row++){
   const y=row*64;g.fillStyle=`rgba(110,76,39,${random()*.07})`;g.fillRect(0,y,512,64);
   if(kind==='floor'){g.fillStyle='#806e5045';g.fillRect(0,y,512,1);g.fillRect(row%2?160:340,y,1,64);}
   for(let n=0;n<16;n++){g.strokeStyle=`rgba(111,79,40,${.015+random()*.07})`;g.lineWidth=.5+random();g.beginPath();for(let x=0;x<=512;x+=8){const yy=y+n*4+Math.sin(x*.012+row+n)*1.4;if(!x)g.moveTo(x,yy);else g.lineTo(x,yy);}g.stroke();}
  }
 }else{
  g.fillStyle='#ffffff';g.fillRect(0,0,512,512);
  for(let i=0;i<6000;i++){g.fillStyle=`rgba(45,48,40,${random()*.07})`;g.fillRect(random()*512,random()*512,kind==='fabric'?1:2,kind==='fabric'?3:1);}
 }
 const t=new CanvasTexture(c);t.colorSpace=SRGBColorSpace;t.wrapS=t.wrapT=RepeatWrapping;t.repeat.set(kind==='floor'?5:kind==='fabric'?2:1,kind==='floor'?7:1);t.anisotropy=4;textures.set(kind,t);return t;
}
export function campusMaterial(kind='wall',color='#ffffff'){
 if(kind==='floor'||kind==='oak')loadPhotographedWood();
 const key=kind+color;
 if(!materials.has(key)){
  const material=new MeshStandardMaterial({color,...(kind==='lamp'?{emissive:'#ffdeb0',emissiveIntensity:.8}:{map:texture(kind)}),roughness:kind==='fabric'?.98:kind==='oak'||kind==='floor'?.72:.92,metalness:0});
  if(kind==='floor'||kind==='oak')for(const channel of ['map','normalMap','roughnessMap'])if(photographed[kind+channel])material[channel]=photographed[kind+channel];
  material.normalScale=new Vector2(.18,.18);materials.set(key,material);
 }
 return materials.get(key);
}
