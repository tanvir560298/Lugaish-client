// DOM lifecycle kept separate so fullscreen events and cleanup can be checked.
export function lockViewport(doc) {
  const nodes=[doc.documentElement,doc.body];
  const previous=nodes.map(node=>node.style.overflow);
  nodes.forEach(node=>{node.style.overflow='hidden';});
  return ()=>nodes.forEach((node,i)=>{node.style.overflow=previous[i];});
}
export function createFullscreenController(root,doc,{onChange,onError}) {
  const supported=Boolean(root?.requestFullscreen&&doc.exitFullscreen&&doc.fullscreenEnabled!==false);
  let disposed=false;
  const sync=()=>{if(!disposed)onChange(doc.fullscreenElement===root);};
  doc.addEventListener('fullscreenchange',sync);sync();
  return {
    supported,
    async toggle(){
      if(!supported){onError('Browser fullscreen is unavailable. The classroom still fills your viewport.');return;}
      try{if(doc.fullscreenElement===root)await doc.exitFullscreen();else await root.requestFullscreen();}
      catch{if(!disposed)onError('Fullscreen was blocked. Try again using the fullscreen button.');}
      sync();
    },
    dispose(){disposed=true;doc.removeEventListener('fullscreenchange',sync);if(doc.fullscreenElement===root){try{Promise.resolve(doc.exitFullscreen()).catch(()=>{});}catch{ /* Browser may exit when the root is removed. */ }}},
  };
}
export function typingTarget(element){return Boolean(element?.isContentEditable||element?.closest?.('[role="dialog"],dialog[open]')||/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(element?.tagName||''));}
