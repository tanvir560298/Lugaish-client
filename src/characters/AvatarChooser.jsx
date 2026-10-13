import { lazy, Suspense, useRef, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { CharacterSelector } from './CharacterSelector.jsx';
import { useCharacter } from './useCharacter.js';
import { getCharacterPreset } from './characterPresets.js';
const CharacterPreview=lazy(()=>import('./CharacterPreview.jsx'));
export function AvatarChooser() {
 const {preset,characterId,selectCharacter}=useCharacter();
 const dialog=useRef(null),trigger=useRef(null);
 const [open,setOpen]=useState(false),[draft,setDraft]=useState(characterId),[error,setError]=useState('');
 const close=()=>dialog.current.close();
 const save=()=>{try{selectCharacter(draft);close();}catch(e){setError(e.message);}};
 return <><button ref={trigger} className="campus-avatar-button" aria-haspopup="dialog" aria-expanded={open} onClick={()=>{setDraft(characterId);setError('');dialog.current.showModal();setOpen(true);}}><img src={preset.avatarAsset} alt=""/><span>Customize Avatar<small>{preset.name}</small></span><ChevronDown size={16}/></button>
 <dialog className="campus-avatar-dialog avatar-editor" ref={dialog} onClose={()=>{setOpen(false);setError('');trigger.current?.focus();}} onClick={e=>{if(e.target===dialog.current)close();}} aria-labelledby="avatar-dialog-title">
  <div className="campus-dialog-heading"><div><span className="ls-eyebrow">YOUR CAMPUS IDENTITY</span><h2 id="avatar-dialog-title">Choose your avatar</h2></div><button className="ls-button" aria-label="Cancel avatar changes" onClick={close}><X size={18}/></button></div>
  <p className="avatar-editor-intro">Preview a character, then save your choice for Classroom and Study Library.</p>
  <div className="avatar-editor-body"><div className="avatar-editor-selection"><CharacterSelector compact value={draft} onChange={id=>{setDraft(id);setError('');}}/><p className="sr-caption">Three complete character styles. Individual hair and clothing controls are not available.</p></div><div>{open&&<Suspense fallback={<p role="status">Opening 3D preview…</p>}><CharacterPreview characterId={draft}/></Suspense>}</div></div>
  <footer className="avatar-editor-footer"><span role="status">{getCharacterPreset(draft).name}{draft!==characterId?' · Unsaved preview':' · Current avatar'}</span>{error&&<p role="alert">{error}</p>}<div><button className="ls-button" onClick={close}>Cancel</button><button className="ls-button ls-primary" onClick={save}>Save avatar</button></div></footer>
 </dialog></>;
}
