import { useEffect, useRef, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { TanuComingSoonMessage } from '../tanu/TanuComingSoon.jsx';

export function NovyraPanel() {
  const dialog = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
  }, [open]);
  return <>
    <button type="button" onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full on-solid bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 group" title="Open Tanu AI Companion" aria-haspopup="dialog" aria-controls="tanu-coming-dialog" aria-expanded={open}>
      <Sparkles className="w-5 h-5"/><span className="text-xs font-bold tracking-wide pr-1">Tanu AI</span>
    </button>
    <dialog ref={dialog} id="tanu-coming-dialog" className="tanu-coming-dialog" aria-labelledby="tanu-dialog-title" aria-describedby="tanu-dialog-description" onClose={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) dialog.current.close(); }}>
      <button type="button" className="tanu-coming-close" onClick={() => dialog.current.close()} aria-label="Close Tanu AI message"><X size={19}/></button>
      <TanuComingSoonMessage idPrefix="tanu-dialog" compact/>
      <button type="button" className="campus-button campus-button-primary tanu-coming-dismiss" onClick={() => dialog.current.close()}>ঠিক আছে, অপেক্ষায় থাকব <span aria-hidden="true">↗</span></button>
    </dialog>
  </>;
}
