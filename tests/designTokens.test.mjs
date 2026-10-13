import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const css=readFileSync(new URL('../src/styles/designTokens.css',import.meta.url),'utf8');
const values=block=>Object.fromEntries([...block.matchAll(/--(campus-[\w-]+):\s*(#[0-9a-f]{6})\s*;/gi)].map(m=>[m[1],m[2]]));
const blocks=css.split(":root[data-theme='light']");
const dark=values(blocks[0]),light={...dark,...values(blocks[1])};
const luminance=hex=>hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4).reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0);
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
for(const [name,tokens] of [['dark',dark],['light',light]])test(`${name} semantic text and actions meet AA normal-text contrast`,()=>{
 for(const foreground of ['text','secondary','muted','link','success','warning','danger'])for(const background of ['bg','surface','surface-raised'])assert.ok(contrast(tokens[`campus-${foreground}`],tokens[`campus-${background}`])>=4.5,`${foreground} on ${background}`);
 assert.ok(contrast(tokens['campus-on-action'],tokens['campus-action'])>=4.5);
 assert.ok(contrast(tokens['campus-on-action'],tokens['campus-action-hover'])>=4.5);
 for(const background of ['surface','surface-raised'])assert.ok(contrast(tokens['campus-control-border'],tokens[`campus-${background}`])>=3);
 for(const background of ['bg','surface'])assert.ok(contrast(tokens['campus-focus'],tokens[`campus-${background}`])>=3);
});
