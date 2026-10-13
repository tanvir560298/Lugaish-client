import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { visit, evaluate, send, close } from './browserClient.mjs';
const rows=[];
try {
  for (const width of [390,768,1440]) {
    await visit('http://127.0.0.1:4174/speaking-preview',width);
    if(width===390) await send('Emulation.setDeviceMetricsOverride',{width,height:844,deviceScaleFactor:1,mobile:false});
    const english=await evaluate(`(()=>{const studio=document.querySelector('.speaking-studio'),select=document.querySelector('.platform-page-heading select'); return {correctInstructions:studio.textContent.includes('Open your notes'),noMisleadingReference:!studio.textContent.includes('Hear reference')&&!studio.textContent.includes('Choose a supplied phrase')&&!studio.textContent.includes('Change language in My Classes'),languageLabel:select.labels[0].textContent.includes('Reading language'),targetHeight:select.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth>innerWidth+1}})()`);
    assert.ok(english.correctInstructions&&english.noMisleadingReference&&english.languageLabel);
    assert.ok(english.targetHeight>=44&&!english.overflow);
    const screen=await send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false});
    await writeFile(`docs/visual-checks/phase12-speaking-preview-${width}.png`,Buffer.from(screen.data,'base64'));
    await evaluate(`(()=>{const s=document.querySelector('.platform-page-heading select'); s.focus(); s.value='arabic'; s.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    await new Promise(r=>setTimeout(r,150));
    const arabic=await evaluate(`(()=>{const h=document.querySelector('.voice-panel h3');return {language:h.lang,direction:h.dir,text:h.textContent,focusRetained:document.activeElement===document.querySelector('.platform-page-heading select'),overflow:document.documentElement.scrollWidth>innerWidth+1}})()`);
    assert.equal(arabic.language,'ar');assert.equal(arabic.direction,'auto');assert.ok(arabic.text.includes('اقرأ')&&arabic.focusRetained&&!arabic.overflow);
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    const reducedMotion=await evaluate(`getComputedStyle(document.querySelector('.voice-orb')).animationName==='none'`);
    assert.ok(reducedMotion);
    await send('Emulation.setEmulatedMedia',{features:[]});
    const minimumTextContrast=await evaluate(`(()=>{const luminance=c=>{const a=c.match(/[\\d.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return a[0]*.2126+a[1]*.7152+a[2]*.0722};return Math.min(...[...document.querySelectorAll('.speaking-studio p')].filter(p=>p.getBoundingClientRect().height).map(p=>{let e=p,bg;while(e){bg=getComputedStyle(e).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)'&&bg!=='transparent')break;e=e.parentElement}const a=luminance(getComputedStyle(p).color),b=luminance(bg);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)}))})()`);
    assert.ok(minimumTextContrast>=4.5,`Studio paragraph contrast ${minimumTextContrast}`);
    rows.push({width,english,arabic,reducedMotion,minimumTextContrast,physicalDevice:false,screenReaderTested:false});
  }
  await writeFile('docs/visual-checks/phase12-speaking-ux.json',JSON.stringify(rows,null,2));
  console.log('Personal reading instructions, reference removal, labelled 44px language control, Arabic, focus retention and reduced motion passed at three widths.');
} finally {close();}
