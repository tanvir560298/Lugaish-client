import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
const source=await readFile(new URL('../src/novyra/TanuMessage.jsx',import.meta.url),'utf8');
const {code}=await transform(source,{loader:'jsx',jsx:'automatic',format:'esm'});
const resolved=code.replaceAll('"react/jsx-runtime"',JSON.stringify(import.meta.resolve('react/jsx-runtime')));
const {TanuMessage}=await import('data:text/javascript;base64,'+Buffer.from(resolved).toString('base64'));
const render=content=>renderToStaticMarkup(createElement(TanuMessage,{content}));

test('Tanu displays readable headings, emphasis and fenced code',()=>{
  const html=render('### A small example\nUse **headings**.\n```html\n<h1>Hello</h1>\n```');
  assert.match(html,/<h4>A small example<\/h4>/);
  assert.match(html,/<strong>headings<\/strong>/);
  assert.match(html,/<pre><code>&lt;h1&gt;Hello&lt;\/h1&gt;/);
  assert.doesNotMatch(html,/<h1>/);
});

test('Tanu treats HTML and Markdown links as text instead of executable markup',()=>{
  const html=render('<img src=x onerror="alert(1)">\n[click](javascript:alert(1))\n<script>alert(1)</script>');
  assert.doesNotMatch(html,/<img|<script|href=/);
  assert.match(html,/&lt;img/);
});

test('Tanu keeps an unfinished code fence readable while handling empty replies',()=>{
  assert.match(render('```html\n<p>Try this</p>'),/<pre><code>&lt;p&gt;Try this&lt;\/p&gt;<\/code><\/pre>/);
  assert.doesNotThrow(()=>render(null));
});
