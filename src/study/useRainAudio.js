import {useEffect,useRef,useState} from 'react';
import {createRainPlayer} from './rainPlayer.js';
const key='lugaish-library-ambience';
function saved(){try{const value=JSON.parse(localStorage.getItem(key)||'{}');return {choice:value.choice==='rain'?'rain':'off',volume:Number.isFinite(value.volume)?Math.max(0,Math.min(100,value.volume)):18};}catch{return {choice:'off',volume:18};}}
export function useRainAudio(){
 const [preference]=useState(saved),[choice,setChoice]=useState(preference.choice),[volume,setVolume]=useState(preference.volume),[status,setStatus]=useState('paused'),[error,setError]=useState('');
 const player=useRef(null),alive=useRef(false);
 useEffect(()=>{alive.current=true;player.current=createRainPlayer({createContext:()=>{const Context=window.AudioContext||window.webkitAudioContext;if(!Context)throw new Error('Audio unavailable');return new Context();},fetchAudio:async url=>{const response=await fetch(url);if(!response.ok)throw new Error('Rain asset missing');return response.arrayBuffer();},onState:(next,message='')=>{if(alive.current){setStatus(next);setError(message);}}});player.current.setVolume(preference.volume);return()=>{alive.current=false;player.current.dispose();player.current=null;};},[]);
 useEffect(()=>{player.current?.setVolume(volume);try{localStorage.setItem(key,JSON.stringify({choice,volume}));}catch{}},[choice,volume]);
 const select=async value=>{setChoice(value);if(value==='off')player.current?.off();else await player.current?.play();};
 const toggle=async()=>{if(status==='playing')player.current?.pause();else{setChoice('rain');await player.current?.play();}};
 return {choice,select,enabled:status==='playing',status,volume,setVolume,error,toggle};
}
