export async function consumeChatStream(response,onDelta){
 const type=response.headers.get('Content-Type')||'';
 if(!response.ok){let data;try{data=await response.json();}catch{}throw Error(data?.error||'Tanu could not connect. Please retry.');}
 // Compatibility during rolling server deployments. Never retry a POST.
 if(!type.includes('text/event-stream'))return response.json();
 const reader=response.body.getReader(),decoder=new TextDecoder();let pending='',result;
 try{while(true){const{done,value}=await reader.read();pending+=done?decoder.decode():decoder.decode(value,{stream:true});pending=pending.replace(/\r\n/g,'\n');let split;
 while((split=pending.indexOf('\n\n'))>=0){const block=pending.slice(0,split);pending=pending.slice(split+2);const lines=block.split('\n'),event=lines.find(l=>l.startsWith('event:'))?.slice(6).trim(),raw=lines.filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trimStart()).join('\n');if(!raw)continue;const data=JSON.parse(raw);if(event==='error')throw Error(data.error||'Reply interrupted. Please retry.');if(event==='delta'&&typeof data.text==='string')onDelta?.(data.text);if(event==='done')result=data;}
 if(pending.length>1024*1024)throw Error('Reply too large.');if(done)break;
 }if(!result?.message)throw Error('The reply was interrupted. Please retry.');return result;
 }finally{await reader.cancel().catch(()=>{});reader.releaseLock();}
}
