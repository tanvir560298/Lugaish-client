import { useEffect, useState } from 'react';
import { normalizeCharacterId, getCharacterPreset, getStoredCharacterId, setStoredCharacterId } from './characterPresets.js';

export function useCharacter() {
  const [characterId, setCharacterId] = useState(() => getStoredCharacterId());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.characterId) {
        setCharacterId(normalizeCharacterId(e.detail.characterId));
      }
    };
    const storage=e=>{if(e.key==='lugaish_chosen_character'||e.key===null)setCharacterId(getStoredCharacterId());};
    window.addEventListener('storage',storage);
    window.addEventListener('lugaish-character-changed', handleUpdate);
    return () => {window.removeEventListener('storage',storage);window.removeEventListener('lugaish-character-changed', handleUpdate);};
  }, []);

  const selectCharacter = (newId) => {
    setStoredCharacterId(newId);
    setCharacterId(newId);
  };

  const preset = getCharacterPreset(characterId);

  return { characterId, selectCharacter, preset };
}
