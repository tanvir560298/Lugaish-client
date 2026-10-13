import { useState } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { useCharacter } from './useCharacter.js';
import { CHARACTER_PRESETS, getCharacterPreset } from './characterPresets.js';
import './characterSelector.css';

export function CharacterSelector({ compact = false, value, onChange }) {
  const selected=useCharacter();
  const [error,setError]=useState('');
  const characterId=value??selected.characterId,selectCharacter=onChange??selected.selectCharacter,preset=getCharacterPreset(characterId);

  const choose=id=>{try{selectCharacter(id);setError('');}catch(e){setError(e.message||'Unable to save this character.');}};

  return (
    <div className={`ls-character-panel ${compact ? 'ls-character-compact' : ''}`}>
      <div className="ls-character-header">
        <div className="ls-character-heading">
          <Sparkles size={16} className="ls-sparkle-icon" />
          <span>Choose your character</span>
        </div>
        <span className="ls-active-avatar-badge"><img src={preset.avatarAsset} alt="" /> {preset.name} active</span>
      </div>
      {error&&<p role="alert">{error}</p>}
      <div className="ls-character-grid" role="radiogroup" aria-label="Choose your character">
        {CHARACTER_PRESETS.map((item) => {
          const isSelected = characterId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`ls-character-option ${isSelected ? 'ls-is-selected' : ''}`}
              role="radio"
              aria-label={`${item.name}: ${item.subtitle}`}
              aria-checked={isSelected}
              tabIndex={isSelected?0:-1}
              onKeyDown={event=>{const index=CHARACTER_PRESETS.findIndex(p=>p.id===characterId);const next=event.key==='Home'?0:event.key==='End'?CHARACTER_PRESETS.length-1:['ArrowRight','ArrowDown'].includes(event.key)?(index+1)%CHARACTER_PRESETS.length:['ArrowLeft','ArrowUp'].includes(event.key)?(index+CHARACTER_PRESETS.length-1)%CHARACTER_PRESETS.length:null;if(next!==null){event.preventDefault();choose(CHARACTER_PRESETS[next].id);event.currentTarget.parentElement.querySelectorAll('[role=radio]')[next].focus();}}}
              onClick={() => choose(item.id)}
            >
              <div className="ls-character-thumb">
                <img className="ls-character-illustration" src={item.avatarAsset} alt="" width="240" height="400" draggable="false" />
                <span
                  className="ls-character-color-dot"
                  style={{ backgroundColor: item.jacketColor }}
                  title={`${item.name}'s Outfit Color`}
                />
              </div>
              <div className="ls-character-meta">
                <div className="ls-character-name-row">
                  <strong>{item.name}</strong>
                  {isSelected && <span className="ls-check-badge"><Check size={12} /></span>}
                </div>
                <small>{item.subtitle}</small>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
