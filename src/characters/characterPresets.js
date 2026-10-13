export const CHARACTER_PRESETS = [
  {
    id: 'maya',
    name: 'Amina',
    title: 'Amina',
    subtitle: 'The welcoming explorer · Lilac overalls',
    gender: 'female',
    hairStyle: 'wavy',
    hairColor: '#522f1d',
    hasGlasses: true,
    glassesColor: '#202020',
    skinColor: '#fad5be',
    jacketColor: '#6975CD', // warm mustard cardigan
    innerColor: '#b85033',  // terracotta inner top
    pantsColor: '#324866',  // classic indigo jeans
    shoeColor: '#c45b34',   // terracotta sneakers with white accents
    backpackColor: '#ea8c26', // warm amber canvas backpack
    bookColor: '#254568',   // navy study textbook
    avatarAsset: '/avatars/maya.svg',
  },
  {
    id: 'noor',
    name: 'Noor',
    title: 'Noor',
    subtitle: 'The curious reader · Teal scarf',
    gender: 'female',
    hairStyle: 'bob',
    hairColor: '#2a1d17',
    hasGlasses: false,
    glassesColor: '#202020',
    skinColor: '#fde0ce',
    jacketColor: '#329E95', // sky-blue college windbreaker
    innerColor: '#f5ebd5',  // cream inner top
    pantsColor: '#b5623b',  // terracotta chinos
    shoeColor: '#e06336',   // bright orange sneakers
    backpackColor: '#d1582a', // rust orange backpack
    bookColor: '#3a6b52',   // forest green study notebook
    avatarAsset: '/avatars/noor.svg',
  },
  {
    id: 'zain',
    name: 'Zain',
    title: 'Zain',
    subtitle: 'Casual student · Quaternius 3D',
    gender: 'male',
    hairStyle: 'short',
    hairColor: '#221813',
    hasGlasses: true,
    glassesColor: '#1a1a1a',
    skinColor: '#ecd0b8',
    jacketColor: '#DA8063', // light heather grey hoodie
    innerColor: '#ffffff',  // white inner
    pantsColor: '#365373',  // blue denim jeans
    shoeColor: '#f2f2f2',   // fresh white sneakers
    backpackColor: '#e5a832', // golden yellow backpack
    bookColor: '#e07a2a',   // orange study volume
    avatarAsset: '/avatars/zain-quaternius.png',
  },
];

export const DEFAULT_CHARACTER_ID = 'maya';

export function getCharacterPreset(id) {
  return CHARACTER_PRESETS.find(c => c.id === id) || CHARACTER_PRESETS[0];
}

const STORAGE_KEY = 'lugaish_chosen_character';

export function normalizeCharacterId(id) {
  return CHARACTER_PRESETS.some(p=>p.id===id)?id:DEFAULT_CHARACTER_ID;
}
export function getStoredCharacterId() {
  if (typeof window === 'undefined') return DEFAULT_CHARACTER_ID;
  try { return normalizeCharacterId(localStorage.getItem(STORAGE_KEY)); }
  catch { return DEFAULT_CHARACTER_ID; }
}
export function setStoredCharacterId(id) {
  if (!CHARACTER_PRESETS.some(p=>p.id===id)) throw new Error('Choose one of the available avatars.');
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, id); }
  catch { throw new Error('Your browser could not save this avatar. Enable browser storage and try again.'); }
  window.dispatchEvent(new CustomEvent('lugaish-character-changed', { detail: { characterId: id } }));
}
