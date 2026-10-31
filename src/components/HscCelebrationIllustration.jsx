import React from 'react';

/**
 * Custom vector illustration of 5 celebrating student cartoon characters for Lugaish
 * Built with pure SVG + CSS animations
 */
export function HscCelebrationIllustration({ className = '', animated = true }) {
  return (
    <svg
      className={`hsc-svg-canvas ${className}`}
      viewBox="0 0 800 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Five joyful cartoon students celebrating their graduation and HSC milestone"
    >
      <defs>
        {/* Glow filters */}
        <filter id="hscCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="hscGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Gradients */}
        <linearGradient id="robeGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0b1120" />
        </linearGradient>
        <linearGradient id="robeGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#090d1a" />
        </linearGradient>
        <linearGradient id="laptopScreenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0284c7" />
          <stop offset="50%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="goldStoleGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="cyanStoleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="emeraldStoleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="purpleStoleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* Ground Shadows */}
      <ellipse cx="110" cy="392" rx="38" ry="9" fill="#000000" fillOpacity="0.5" />
      <ellipse cx="245" cy="392" rx="40" ry="9" fill="#000000" fillOpacity="0.5" />
      <ellipse cx="400" cy="394" rx="48" ry="10" fill="#000000" fillOpacity="0.6" />
      <ellipse cx="555" cy="392" rx="40" ry="9" fill="#000000" fillOpacity="0.5" />
      <ellipse cx="690" cy="392" rx="38" ry="9" fill="#000000" fillOpacity="0.5" />

      {/* Floating Confetti & Sparkles */}
      <g className={animated ? "sparkle-elem" : ""}>
        <path d="M 60 70 L 64 82 L 76 86 L 64 90 L 60 102 L 56 90 L 44 86 L 56 82 Z" fill="#fbbf24" opacity="0.9" filter="url(#hscGoldGlow)" />
        <path d="M 310 40 L 313 49 L 322 52 L 313 55 L 310 64 L 307 55 L 298 52 L 307 49 Z" fill="#38bdf8" opacity="0.85" filter="url(#hscCyanGlow)" />
        <path d="M 480 50 L 484 60 L 494 64 L 484 68 L 480 78 L 476 68 L 466 64 L 476 60 Z" fill="#34d399" opacity="0.85" />
        <path d="M 730 65 L 733 74 L 742 77 L 733 80 L 730 89 L 727 80 L 718 77 L 727 74 Z" fill="#c084fc" opacity="0.85" />
        <circle cx="210" cy="75" r="3.5" fill="#f43f5e" opacity="0.8" />
        <circle cx="630" cy="85" r="4" fill="#fbbf24" opacity="0.8" />
        <rect x="365" y="60" width="7" height="7" rx="1.5" transform="rotate(25 368 63)" fill="#38bdf8" opacity="0.75" />
        <rect x="580" y="45" width="8" height="6" rx="1.5" transform="rotate(-30 584 48)" fill="#f59e0b" opacity="0.75" />
        <path d="M 180 90 Q 195 105 185 120 T 195 150" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeDasharray="4 3" opacity="0.6" />
        <path d="M 640 100 Q 625 115 635 130 T 625 160" stroke="#f472b6" strokeWidth="2.5" fill="none" strokeDasharray="4 3" opacity="0.6" />
      </g>

      {/* ========================================================
          STUDENT 1 (Girl Tossing Cap) - Left (x ≈ 110)
         ======================================================== */}
      <g className={animated ? "student-bounce-1" : ""} id="student-1">
        {/* Legs & Shoes */}
        <path d="M 103 345 L 101 382 M 119 345 L 121 382" stroke="#fed7aa" strokeWidth="6.5" strokeLinecap="round" />
        <ellipse cx="98" cy="384" rx="10" ry="5.5" fill="#0f172a" />
        <ellipse cx="124" cy="384" rx="10" ry="5.5" fill="#0f172a" />

        {/* Robe Body */}
        <path d="M 88 226 L 74 348 C 74 353 146 353 146 348 L 132 226 Z" fill="url(#robeGrad1)" />
        <path d="M 102 228 L 96 340 L 105 340 L 108 228 Z" fill="url(#cyanStoleGrad)" />
        <path d="M 118 228 L 115 340 L 124 340 L 122 228 Z" fill="url(#cyanStoleGrad)" />

        {/* Arms */}
        <path d="M 84 234 Q 66 265 78 288" stroke="url(#robeGrad1)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <ellipse cx="78" cy="288" rx="5.5" ry="5.5" fill="#fed7aa" />
        <path d="M 126 234 Q 144 195 150 156" stroke="url(#robeGrad1)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <circle cx="150" cy="152" r="5.5" fill="#fed7aa" />
        <path d="M 150 152 L 154 138" stroke="#fed7aa" strokeWidth="3.5" strokeLinecap="round" />

        {/* Hair Back */}
        <path d="M 84 185 C 76 220 78 255 90 270 C 96 245 93 210 94 190 Z" fill="#18181b" />
        <path d="M 136 185 C 144 220 142 255 130 270 C 124 245 127 210 126 190 Z" fill="#18181b" />

        {/* Head & Face */}
        <path d="M 105 210 L 105 226 L 115 226 L 115 210 Z" fill="#fed7aa" />
        <circle cx="110" cy="192" r="19" fill="#fed7aa" />
        <path d="M 91 186 C 96 170 124 170 129 186 C 120 178 100 178 91 186 Z" fill="#18181b" />
        <path d="M 100 188 Q 105 183 110 188" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <path d="M 114 188 Q 119 183 124 188" stroke="#18181b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        <circle cx="97" cy="195" r="3.5" fill="#f472b6" opacity="0.6" />
        <circle cx="123" cy="195" r="3.5" fill="#f472b6" opacity="0.6" />
        <path d="M 104 198 Q 112 206 120 198" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Flying Cap Trajectory & Toss Animation */}
        <path d="M 124 135 Q 138 105 144 75" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" opacity="0.6" fill="none" />
        <g className={animated ? "cap-toss-elem" : ""} transform="translate(5, 5)">
          <polygon points="144,38 184,52 144,66 104,52" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
          <path d="M 124 59 Q 144 70 164 59 L 164 68 Q 144 79 124 68 Z" fill="#312e81" />
          <circle cx="144" cy="52" r="3" fill="#fbbf24" />
          <path d="M 144 52 Q 168 60 175 78" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <polygon points="172,78 178,78 176,86 173,86" fill="#f59e0b" />
        </g>
      </g>

      {/* ========================================================
          STUDENT 2 (Boy with Certificate) - Center-Left (x ≈ 245)
         ======================================================== */}
      <g className={animated ? "student-bounce-2" : ""} id="student-2">
        <path d="M 238 345 L 236 382 M 254 345 L 256 382" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" />
        <ellipse cx="234" cy="384" rx="10" ry="5.5" fill="#090d16" />
        <ellipse cx="258" cy="384" rx="10" ry="5.5" fill="#090d16" />

        <path d="M 224 225 L 208 348 C 208 353 282 353 282 348 L 266 225 Z" fill="url(#robeGrad1)" />
        <path d="M 235 226 L 228 340 L 237 340 L 241 226 Z" fill="url(#emeraldStoleGrad)" />
        <path d="M 255 226 L 251 340 L 260 340 L 261 226 Z" fill="url(#emeraldStoleGrad)" />

        <path d="M 220 234 Q 210 265 234 274" stroke="url(#robeGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />
        <path d="M 270 234 Q 280 265 256 274" stroke="url(#robeGrad1)" strokeWidth="14" strokeLinecap="round" fill="none" />

        {/* Diploma Scroll */}
        <rect x="220" y="262" width="50" height="20" rx="4" fill="#fef3c7" stroke="#fbbf24" strokeWidth="1.3" />
        <rect x="241" y="261" width="9" height="22" fill="#2563eb" />
        <circle cx="245" cy="272" r="5.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <path d="M 243 277 L 238 290 L 243 286 L 248 290 Z" fill="#2563eb" />
        <circle cx="220" cy="272" r="5" fill="#fed7aa" />
        <circle cx="270" cy="272" r="5" fill="#fed7aa" />

        {/* Head & Glasses */}
        <path d="M 240 206 L 240 224 L 250 224 L 250 206 Z" fill="#fed7aa" />
        <circle cx="245" cy="192" r="18" fill="#fed7aa" />
        <path d="M 227 186 C 230 178 260 178 263 186 Z" fill="#18181b" />
        <circle cx="238" cy="191" r="6" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
        <circle cx="252" cy="191" r="6" stroke="#38bdf8" strokeWidth="1.5" fill="none" />
        <line x1="244" y1="191" x2="246" y2="191" stroke="#38bdf8" strokeWidth="1.5" />
        <circle cx="238" cy="191" r="1.8" fill="#18181b" />
        <circle cx="252" cy="191" r="1.8" fill="#18181b" />
        <path d="M 239 200 Q 245 208 251 200 Z" fill="#ef4444" stroke="#ef4444" strokeWidth="1" />

        {/* Graduation Cap on Head */}
        <polygon points="245,158 284,171 245,184 206,171" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
        <path d="M 226 177 Q 245 186 264 177 L 264 182 Q 245 191 226 182 Z" fill="#1e293b" />
        <circle cx="245" cy="171" r="2.8" fill="#fbbf24" />
        <path d="M 245 171 Q 268 178 274 195" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <polygon points="271,195 277,195 275,203 272,203" fill="#f59e0b" />
      </g>

      {/* ========================================================
          STUDENT 3 (CENTER HERO - TECH STUDENT) - Center (x ≈ 400)
         ======================================================== */}
      <g className={animated ? "student-bounce-3" : ""} id="student-3">
        <path d="M 390 345 L 388 382 M 410 345 L 412 382" stroke="#0f172a" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="385" cy="384" rx="12" ry="6" fill="#2563eb" />
        <ellipse cx="415" cy="384" rx="12" ry="6" fill="#2563eb" />
        <ellipse cx="385" cy="387" rx="11" ry="2.2" fill="#38bdf8" />
        <ellipse cx="415" cy="387" rx="11" ry="2.2" fill="#38bdf8" />

        <path d="M 374 218 L 354 350 C 354 355 446 355 446 350 L 426 218 Z" fill="url(#robeGrad2)" />
        <path d="M 388 220 L 378 342 L 392 342 L 397 220 Z" fill="url(#cyanStoleGrad)" />
        <path d="M 412 220 L 406 342 L 420 342 L 421 220 Z" fill="url(#goldStoleGrad)" />

        {/* Upward Glow from Laptop */}
        <ellipse cx="400" cy="248" rx="42" ry="24" fill="#38bdf8" fillOpacity="0.22" filter="url(#hscCyanGlow)" />

        {/* Laptop in Hands */}
        <polygon points="360,238 440,238 446,286 354,286" fill="url(#laptopScreenGrad)" stroke="#bae6fd" strokeWidth="1.8" />
        <text x="400" y="258" fontFamily="monospace" fontSize="9" fontWeight="900" fill="#ffffff" textAnchor="middle">&lt;HSC PASSED /&gt;</text>
        <text x="400" y="274" fontFamily="monospace" fontSize="7.5" fontWeight="bold" fill="#a7f3d0" textAnchor="middle">NEXT: CODE THE FUTURE</text>
        <circle cx="366" cy="244" r="1.8" fill="#f43f5e" />
        <circle cx="372" cy="244" r="1.8" fill="#fbbf24" />
        <circle cx="378" cy="244" r="1.8" fill="#10b981" />
        <polygon points="350,286 450,286 442,300 358,300" fill="#334155" stroke="#475569" strokeWidth="1.2" />
        <rect x="393" y="290" width="14" height="6" rx="1" fill="#1e293b" />
        <circle cx="351" cy="286" r="5.5" fill="#fed7aa" />
        <circle cx="449" cy="286" r="5.5" fill="#fed7aa" />

        <path d="M 368 228 Q 348 260 353 286" stroke="url(#robeGrad2)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d="M 432 228 Q 452 260 447 286" stroke="url(#robeGrad2)" strokeWidth="15" strokeLinecap="round" fill="none" />

        {/* Head & Sparkling Face */}
        <path d="M 395 200 L 395 218 L 405 218 L 405 200 Z" fill="#fed7aa" />
        <circle cx="400" cy="186" r="19.5" fill="#fed7aa" />
        <path d="M 381 180 C 385 168 415 168 419 180 Z" fill="#0f172a" />
        <circle cx="393" cy="184" r="2.6" fill="#0f172a" />
        <circle cx="407" cy="184" r="2.6" fill="#0f172a" />
        <circle cx="394.5" cy="182.5" r="0.9" fill="#ffffff" />
        <circle cx="408.5" cy="182.5" r="0.9" fill="#ffffff" />
        <circle cx="388" cy="190" r="3.8" fill="#f472b6" opacity="0.55" />
        <circle cx="412" cy="190" r="3.8" fill="#f472b6" opacity="0.55" />
        <path d="M 394 192 Q 400 201 406 192 Z" fill="#ef4444" stroke="#ef4444" strokeWidth="1" />
        <rect x="396" y="192" width="8" height="2.5" rx="0.5" fill="#ffffff" />

        {/* Stylish Cap on Head */}
        <g transform="rotate(3 400 152)">
          <polygon points="400,150 442,164 400,178 358,164" fill="#0a0f1d" stroke="#38bdf8" strokeWidth="1.8" filter="url(#hscCyanGlow)" />
          <path d="M 379 171 Q 400 180 421 171 L 421 177 Q 400 186 379 177 Z" fill="#1e293b" />
          <circle cx="400" cy="164" r="3" fill="#fbbf24" />
          <path d="M 400 164 Q 426 172 434 192" stroke="#fbbf24" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <polygon points="431,192 437,192 435,200 432,200" fill="#f59e0b" />
        </g>
      </g>

      {/* ========================================================
          STUDENT 4 (Boy Cheering with Arms Raised) - (x ≈ 555)
         ======================================================== */}
      <g className={animated ? "student-bounce-1" : ""} id="student-4">
        <path d="M 548 345 L 546 382 M 564 345 L 566 382" stroke="#1e293b" strokeWidth="6.5" strokeLinecap="round" />
        <ellipse cx="544" cy="384" rx="10" ry="5.5" fill="#090d16" />
        <ellipse cx="568" cy="384" rx="10" ry="5.5" fill="#090d16" />

        <path d="M 534 225 L 518 348 C 518 353 592 353 592 348 L 576 225 Z" fill="url(#robeGrad1)" />
        <path d="M 546 226 L 537 340 L 547 340 L 551 226 Z" fill="url(#goldStoleGrad)" />
        <path d="M 564 226 L 557 340 L 567 340 L 569 226 Z" fill="url(#goldStoleGrad)" />

        {/* Arms raised in celebration */}
        <path d="M 528 230 Q 512 185 498 142" stroke="url(#robeGrad1)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <circle cx="496" cy="138" r="6" fill="#fed7aa" />
        <path d="M 582 230 Q 598 185 612 142" stroke="url(#robeGrad1)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <circle cx="614" cy="138" r="6" fill="#fed7aa" />

        <path d="M 550 205 L 550 224 L 560 224 L 560 205 Z" fill="#fed7aa" />
        <circle cx="555" cy="191" r="18" fill="#fed7aa" />
        <path d="M 537 185 C 540 176 570 176 573 185 Z" fill="#18181b" />
        <path d="M 547 186 Q 551 180 555 186" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M 559 186 Q 563 180 567 186" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="544" cy="193" r="3.8" fill="#f472b6" opacity="0.6" />
        <circle cx="568" cy="193" r="3.8" fill="#f472b6" opacity="0.6" />
        <path d="M 547 195 Q 557 209 567 195 Z" fill="#b91c1c" stroke="#b91c1c" strokeWidth="1" />
        <path d="M 551 204 Q 557 209 563 204 Z" fill="#f43f5e" />

        <polygon points="555,158 594,171 555,184 516,171" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
        <path d="M 536 177 Q 555 186 574 177 L 574 182 Q 555 191 536 182 Z" fill="#1e293b" />
        <circle cx="555" cy="171" r="2.8" fill="#fbbf24" />
        <path d="M 555 171 Q 576 178 582 195" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <polygon points="579,195 585,195 583,203 580,203" fill="#f59e0b" />
      </g>

      {/* ========================================================
          STUDENT 5 (Girl with Headphones & Thumbs Up) - Right (x ≈ 690)
         ======================================================== */}
      <g className={animated ? "student-bounce-2" : ""} id="student-5">
        <path d="M 682 345 L 680 382 M 698 345 L 700 382" stroke="#fed7aa" strokeWidth="6.5" strokeLinecap="round" />
        <ellipse cx="678" cy="384" rx="10" ry="5.5" fill="#1e1b4b" />
        <ellipse cx="702" cy="384" rx="10" ry="5.5" fill="#1e1b4b" />

        <path d="M 670 226 L 654 348 C 654 353 726 353 726 348 L 710 226 Z" fill="url(#robeGrad2)" />
        <path d="M 682 228 L 675 340 L 684 340 L 687 228 Z" fill="url(#purpleStoleGrad)" />
        <path d="M 698 228 L 692 340 L 701 340 L 700 228 Z" fill="url(#purpleStoleGrad)" />

        {/* Headphones */}
        <path d="M 675 218 C 675 235 705 235 705 218" stroke="#334155" strokeWidth="6" fill="none" strokeLinecap="round" />
        <rect x="668" y="212" width="9" height="16" rx="4.5" fill="#38bdf8" />
        <rect x="703" y="212" width="9" height="16" rx="4.5" fill="#38bdf8" />

        {/* Thumbs up */}
        <path d="M 664 234 Q 644 260 652 278" stroke="url(#robeGrad2)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <g transform="translate(645, 271)">
          <circle cx="6" cy="10" r="5" fill="#fed7aa" />
          <path d="M 5 6 L 5 0 Q 5 -2 7.5 -2 Q 10 -2 10 0 L 10 6 Z" fill="#fed7aa" stroke="#fcd34d" strokeWidth="0.9" />
        </g>

        {/* Tablet */}
        <path d="M 716 234 Q 732 260 724 282" stroke="url(#robeGrad2)" strokeWidth="15" strokeLinecap="round" fill="none" />
        <rect x="715" y="271" width="18" height="26" rx="3" fill="#1e293b" stroke="#c084fc" strokeWidth="1.4" transform="rotate(-12 724 284)" />
        <circle cx="722" cy="284" r="5" fill="#fed7aa" />

        {/* Head & Hair */}
        <path d="M 685 208 L 685 224 L 695 224 L 695 208 Z" fill="#fed7aa" />
        <path d="M 669 184 C 665 212 671 232 677 238 C 681 218 677 195 679 186 Z" fill="#312e81" />
        <path d="M 711 184 C 715 212 709 232 703 238 C 699 218 703 195 701 186 Z" fill="#312e81" />
        <circle cx="690" cy="192" r="18" fill="#fed7aa" />
        <path d="M 672 186 C 677 175 703 175 708 186 Z" fill="#312e81" />
        <circle cx="684" cy="190" r="2.4" fill="#18181b" />
        <circle cx="685" cy="189" r="0.8" fill="#ffffff" />
        <path d="M 693 190 Q 697 185 701 190" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <circle cx="678" cy="195" r="3.2" fill="#f472b6" opacity="0.6" />
        <circle cx="702" cy="195" r="3.2" fill="#f472b6" opacity="0.6" />
        <path d="M 684 198 Q 691 205 698 198" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* Cap on Head */}
        <polygon points="690,158 729,171 690,184 651,171" fill="#1e1b4b" stroke="#c084fc" strokeWidth="1.5" />
        <path d="M 671 177 Q 690 186 709 177 L 709 182 Q 690 191 671 182 Z" fill="#312e81" />
        <circle cx="690" cy="171" r="2.8" fill="#fbbf24" />
        <path d="M 690 171 Q 712 178 718 195" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <polygon points="715,195 721,195 719,203 716,203" fill="#f59e0b" />
      </g>
    </svg>
  );
}
