// Render a small, safe Markdown subset as React text; never execute model HTML.
function Inline({text}) {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part,index) =>
    part.startsWith('**') && part.endsWith('**') ? <strong key={index}>{part.slice(2,-2)}</strong> :
    part.startsWith('`') && part.endsWith('`') ? <code key={index}>{part.slice(1,-1)}</code> : part);
}
export function TanuMessage({content}) {
  return <div className="tanu-message-text">{String(content || '').split(/(```[\s\S]*?(?:```|$))/g).map((block,index)=>{
    if(block.startsWith('```')) {
      const code=block.replace(/^```[^\n]*\n?/, '').replace(/```$/, '');
      return <pre key={index}><code>{code}</code></pre>;
    }
    return <div key={index}>{block.split('\n').map((line,i)=>{
      if(/^#{1,4}\s/.test(line))return <h4 key={i}><Inline text={line.replace(/^#{1,4}\s+/, '')}/></h4>;
      if(/^\s*[-*]\s/.test(line))return <p className="tanu-message-bullet" key={i}><span aria-hidden="true">•</span><span><Inline text={line.replace(/^\s*[-*]\s+/, '')}/></span></p>;
      return line.trim()?<p key={i}><Inline text={line}/></p>:<div className="tanu-message-gap" key={i}/>;
    })}</div>;
  })}</div>;
}
