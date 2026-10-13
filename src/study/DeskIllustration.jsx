import { useId } from 'react';

export function DeskIllustration({ seat = 'window', variant = 'study' }) {
  const id = useId().replace(/:/g, '');
  return <svg viewBox="0 0 720 440" className="ls-desk-art" role="img" aria-label={variant === 'classroom' ? 'A quiet classroom with a projector and rows of desks' : variant === 'speaking' ? 'A microphone on a desk, ready for speaking practice' : 'A sunlit study desk with a notebook, lamp, and plant'}>
    <defs>
      <linearGradient id={`${id}-wall`} x2="0" y2="1"><stop stopColor={seat === 'window' ? '#dbe4d8' : '#cbc9b8'} /><stop offset="1" stopColor="#ece9d9" /></linearGradient>
      <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#b6d0cd" /><stop offset="1" stopColor="#e7eedc" /></linearGradient>
    </defs>
    <rect width="720" height="440" fill={`url(#${id}-wall)`} />
    <path d="M0 350H720V440H0Z" fill="#b7b6a3" />
    <path d="M0 351H720" stroke="#839085" strokeWidth="6" />
    <rect x="45" y="28" width="238" height="232" fill="#6d8980" rx="2" />
    <rect x="54" y="36" width="220" height="214" fill={`url(#${id}-sky)`} />
    <path d="M54 199Q110 146 172 181T274 162V250H54Z" fill="#91aa92" />
    <path d="M54 223Q121 173 194 213T274 206V250H54Z" fill="#738e7b" />
    <path d="M164 36V250M54 143H274" stroke="#70877d" strokeWidth="8" />
    <rect x="36" y="251" width="256" height="13" rx="2" fill="#edeedc" />
    <path d="M278 151L499 351H299L172 259Z" fill="#fff7c8" opacity=".23" />
    {variant === 'classroom' ? <>
      <rect x="357" y="50" width="299" height="168" rx="4" fill="#3c5146" />
      <rect x="367" y="60" width="279" height="148" fill="#204e44" />
      <path d="M486 99L486 166L541 132Z" fill="#dcc491" />
      {[0, 1].flatMap(row => [0, 1, 2].map(col => <g key={`${row}-${col}`} transform={`translate(${66 + col * 217}, ${272 + row * 85})`}>
        <path d="M0 0H159L172 21H-13Z" fill="#b89365" /><path d="M-13 21H172V28H-13Z" fill="#93744f" />
        <path d="M0 28V70M158 28V70" stroke="#53635a" strokeWidth="7" /><rect x="52" y="37" width="52" height="37" rx="6" fill="#426c5b" />
      </g>))}
    </> : <>
      <rect x="474" y="64" width="133" height="87" rx="3" fill="#9eaa91" />
      <rect x="482" y="72" width="117" height="71" fill="#f1ecd7" />
      <path d="M500 92H581M500 106H570M500 120H552" stroke="#b0b49d" strokeWidth="3" />
      <path d="M88 288H636L678 343H46Z" fill="#b99a72" />
      <path d="M46 343H678V356H46Z" fill="#8f7353" />
      <path d="M78 356V440M645 356V440" stroke="#455c50" strokeWidth="13" />
      <ellipse cx="349" cy="389" rx="115" ry="24" fill="#6a7d6838" />
      <path d="M266 395Q266 364 292 364H405Q431 364 431 395V440H266Z" fill="#3d6353" />
      <path d="M260 440V410Q260 391 280 391H417Q437 391 437 410V440" fill="#4f7863" />
      <ellipse cx="152" cy="304" rx="43" ry="12" fill="#647b64" />
      <path d="M152 300V200L200 160" fill="none" stroke="#536c59" strokeWidth="10" strokeLinejoin="round" />
      <path d="M174 146Q204 132 222 157L232 184L178 189Z" fill="#446852" />
      <path d="M181 191L119 281L277 301L228 191Z" fill="#fff0b9" opacity=".3" />
      {variant === 'speaking' ? <g>
        <ellipse cx="370" cy="307" rx="44" ry="10" fill="#7d8e79" />
        <path d="M370 300V254M337 207V230Q337 263 370 263Q403 263 403 230V207" fill="none" stroke="#456856" strokeWidth="8" />
        <rect x="350" y="161" width="40" height="87" rx="20" fill="#294e43" />
        <path d="M357 185H383M357 197H383M357 209H383M357 221H383" stroke="#8ea597" strokeWidth="3" />
        <path d="M314 170Q292 203 315 229M426 170Q449 203 426 229" stroke="#a1b7a0" strokeWidth="4" fill="none" />
      </g> : <g>
        <path d="M291 282L360 269L435 284L447 321L369 309L282 324Z" fill="#f6f0d9" />
        <path d="M360 271L369 309" stroke="#c8bea5" strokeWidth="2" />
        <path d="M306 289L346 281M304 297L348 289M302 305L350 297M380 284L418 291M382 293L423 300" stroke="#adb69e" strokeWidth="2" />
        <path d="M466 286L498 315" stroke="#395e4b" strokeWidth="5" strokeLinecap="round" />
      </g>}
      <path d="M548 276H591L585 308H554Z" fill="#bf9170" />
      <path d="M569 278V231M569 256Q538 252 540 223Q568 224 569 256M570 243Q602 236 597 211Q570 216 570 243" fill="#5c805b" stroke="#577654" strokeWidth="3" />
    </>}
  </svg>;
}
