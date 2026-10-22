import test from 'node:test';
import assert from 'node:assert/strict';
import {consumeChatStream} from '../src/novyra/chatStream.js';
function response(text){const bytes=new TextEncoder().encode(text);return new Response(new ReadableStream({start(c){for(const b of bytes)c.enqueue(new Uint8Array([b]));c.close();}}),{headers:{'Content-Type':'text/event-stream'}});}
test('chat streams UTF-8 deltas before the final saved message',async()=>{
 const chunks=[];const result=await consumeChatStream(response(': ping\n\nevent: delta\ndata: {"text":"বাংলা"}\n\nevent: delta\ndata: {"text":" reply"}\n\nevent: done\ndata: {"message":{"content":"বাংলা reply"}}\n\n'),s=>chunks.push(s));
 assert.equal(chunks.join(''),'বাংলা reply');assert.equal(result.message.content,'বাংলা reply');
});
test('interrupted, rejected and errored streams never look like completed answers',async()=>{
 await assert.rejects(consumeChatStream(response('event: delta\ndata: {"text":"partial"}\n\n'),()=>{}),/interrupted/);
 await assert.rejects(consumeChatStream(response('event: error\ndata: {"error":"Busy"}\n\n'),()=>{}),/Busy/);
 await assert.rejects(consumeChatStream(new Response('{"error":"Quota reached"}',{status:429}),()=>{}),/Quota reached/);
});
test('chat accepts JSON replies while server and client deployments roll out independently',async()=>{
 const result=await consumeChatStream(Response.json({message:{content:'Built-in guide'}}),()=>assert.fail('No fake streaming'));
 assert.equal(result.message.content,'Built-in guide');
});
