import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  Download, 
  Share2, 
  X, 
  CheckCircle2, 
  Code2, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { HscCelebrationIllustration } from './HscCelebrationIllustration.jsx';
import './hsc-celebration.css';

/**
 * Returns the complete standalone 1200x1200 SVG markup
 * for high-resolution PNG poster export
 */
export function getHscPosterSvgString() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" width="1200" height="1200">
  <defs>
    <filter id="hscCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <filter id="hscGoldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#080e22"/>
      <stop offset="45%" stop-color="#060915"/>
      <stop offset="100%" stop-color="#0a172e"/>
    </linearGradient>
    <radialGradient id="glowTop" cx="50%" cy="16%" r="48%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowCenter" cx="50%" cy="62%" r="52%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="30%" stop-color="#bae6fd"/>
      <stop offset="70%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#60a5fa"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="50%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f59e0b"/>
    </linearGradient>
    <linearGradient id="robeGrad1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0b1120"/>
    </linearGradient>
    <linearGradient id="robeGrad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#090d1a"/>
    </linearGradient>
    <linearGradient id="laptopScreenGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="60%" stop-color="#0ea5e9"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
    <linearGradient id="goldStoleGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#fde047"/>
      <stop offset="60%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="cyanStoleGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="emeraldStoleGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="purpleStoleGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#c084fc"/>
      <stop offset="100%" stop-color="#7c3aed"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="1200" fill="url(#bgGrad)"/>
  <rect width="1200" height="1200" fill="url(#glowTop)"/>
  <rect width="1200" height="1200" fill="url(#glowCenter)"/>

  <!-- Border & Frame -->
  <rect x="24" y="24" width="1152" height="1152" rx="32" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.35"/>
  <rect x="36" y="36" width="1128" height="1128" rx="24" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.08"/>

  <!-- Top Brand Header -->
  <g transform="translate(70, 75)">
    <rect width="48" height="48" rx="12" fill="#2563eb" fill-opacity="0.3" stroke="#38bdf8" stroke-width="1.5"/>
    <text x="24" y="33" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="24" fill="#38bdf8" text-anchor="middle">L</text>
    <text x="62" y="30" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="24" fill="#ffffff" letter-spacing="1">LUGAISH<tspan fill="#38bdf8">.</tspan></text>
    <text x="62" y="46" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="11" fill="#94a3b8" letter-spacing="2">LEARN. BUILD. GROW.</text>
  </g>

  <g transform="translate(900, 78)">
    <rect width="230" height="42" rx="21" fill="#38bdf8" fill-opacity="0.12" stroke="#38bdf8" stroke-width="1.2"/>
    <circle cx="22" cy="21" r="5" fill="#38bdf8"/>
    <text x="36" y="26" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="13" fill="#38bdf8" letter-spacing="1.5">HSC 2026 EDITION</text>
  </g>

  <!-- Typography Header -->
  <g transform="translate(600, 205)" text-anchor="middle">
    <text y="0" font-family="Georgia, serif" font-style="italic" font-size="34" fill="url(#goldGrad)" letter-spacing="1">✨ Warmest Congratulations to All Students ✨</text>
    <text y="78" font-family="system-ui, -apple-system, sans-serif" font-weight="900" font-size="78" fill="url(#titleGrad)" letter-spacing="3">YOUR HSC RESULT</text>
    <text y="130" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="22" fill="#cbd5e1" letter-spacing="0.5">Celebrate your achievement today — the world of tech &amp; building</text>
    <text y="162" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="22" fill="#38bdf8" letter-spacing="0.5">is waiting for your next big step!</text>
  </g>

  <!-- Festive Confetti Flakes -->
  <g opacity="0.8">
    <path d="M 140 180 L 145 195 L 160 200 L 145 205 L 140 220 L 135 205 L 120 200 L 135 195 Z" fill="#fbbf24" filter="url(#hscGoldGlow)"/>
    <path d="M 1060 200 L 1064 212 L 1076 216 L 1064 220 L 1060 232 L 1056 220 L 1044 216 L 1056 212 Z" fill="#38bdf8" filter="url(#hscCyanGlow)"/>
    <path d="M 980 430 L 984 442 L 996 446 L 984 450 L 980 462 L 976 450 L 964 446 L 976 442 Z" fill="#34d399"/>
    <path d="M 180 450 L 183 460 L 193 463 L 183 466 L 180 476 L 177 466 L 167 463 L 177 460 Z" fill="#f43f5e"/>
    <circle cx="280" cy="360" r="4" fill="#fbbf24"/>
    <circle cx="920" cy="380" r="4.5" fill="#38bdf8"/>
    <circle cx="530" cy="410" r="3.5" fill="#c084fc"/>
    <circle cx="670" cy="400" r="3" fill="#34d399"/>
    <rect x="220" y="390" width="8" height="8" rx="2" transform="rotate(35 224 394)" fill="#38bdf8"/>
    <rect x="1000" y="370" width="9" height="7" rx="2" transform="rotate(-25 1004 373)" fill="#f59e0b"/>
  </g>

  <!-- Student Characters Group -->
  <g transform="translate(68, 410) scale(1.33)">
    <!-- Ground Shadows -->
    <ellipse cx="110" cy="392" rx="38" ry="9" fill="#000000" fill-opacity="0.55" />
    <ellipse cx="245" cy="392" rx="40" ry="9" fill="#000000" fill-opacity="0.55" />
    <ellipse cx="400" cy="394" rx="48" ry="10" fill="#000000" fill-opacity="0.65" />
    <ellipse cx="555" cy="392" rx="40" ry="9" fill="#000000" fill-opacity="0.55" />
    <ellipse cx="690" cy="392" rx="38" ry="9" fill="#000000" fill-opacity="0.55" />

    <!-- STUDENT 1: Girl Tossing Cap (Left) -->
    <g id="char-1">
      <path d="M 103 345 L 101 382 M 119 345 L 121 382" stroke="#fed7aa" stroke-width="6.5" stroke-linecap="round" />
      <ellipse cx="98" cy="384" rx="10" ry="5.5" fill="#0f172a" />
      <ellipse cx="124" cy="384" rx="10" ry="5.5" fill="#0f172a" />
      <path d="M 88 226 L 74 348 C 74 353 146 353 146 348 L 132 226 Z" fill="url(#robeGrad1)" />
      <path d="M 102 228 L 96 340 L 105 340 L 108 228 Z" fill="url(#cyanStoleGrad)" />
      <path d="M 118 228 L 115 340 L 124 340 L 122 228 Z" fill="url(#cyanStoleGrad)" />
      <path d="M 84 234 Q 66 265 78 288" stroke="url(#robeGrad1)" stroke-width="15" stroke-linecap="round" fill="none" />
      <ellipse cx="78" cy="288" rx="5.5" ry="5.5" fill="#fed7aa" />
      <path d="M 126 234 Q 144 195 150 156" stroke="url(#robeGrad1)" stroke-width="15" stroke-linecap="round" fill="none" />
      <circle cx="150" cy="152" r="5.5" fill="#fed7aa" />
      <path d="M 150 152 L 154 138" stroke="#fed7aa" stroke-width="3.5" stroke-linecap="round" />
      <path d="M 84 185 C 76 220 78 255 90 270 C 96 245 93 210 94 190 Z" fill="#18181b" />
      <path d="M 136 185 C 144 220 142 255 130 270 C 124 245 127 210 126 190 Z" fill="#18181b" />
      <path d="M 105 210 L 105 226 L 115 226 L 115 210 Z" fill="#fed7aa" />
      <circle cx="110" cy="192" r="19" fill="#fed7aa" />
      <path d="M 91 186 C 96 170 124 170 129 186 C 120 178 100 178 91 186 Z" fill="#18181b" />
      <path d="M 100 188 Q 105 183 110 188" stroke="#18181b" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <path d="M 114 188 Q 119 183 124 188" stroke="#18181b" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <circle cx="97" cy="195" r="3.5" fill="#f472b6" opacity="0.6" />
      <circle cx="123" cy="195" r="3.5" fill="#f472b6" opacity="0.6" />
      <path d="M 104 198 Q 112 206 120 198" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <path d="M 124 135 Q 138 105 144 75" stroke="#38bdf8" stroke-width="1.8" stroke-dasharray="3 3" opacity="0.6" fill="none" />
      <g transform="translate(5, 5)">
        <polygon points="144,38 184,52 144,66 104,52" fill="#1e1b4b" stroke="#38bdf8" stroke-width="1.5" />
        <path d="M 124 59 Q 144 70 164 59 L 164 68 Q 144 79 124 68 Z" fill="#312e81" />
        <circle cx="144" cy="52" r="3" fill="#fbbf24" />
        <path d="M 144 52 Q 168 60 175 78" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" />
        <polygon points="172,78 178,78 176,86 173,86" fill="#f59e0b" />
      </g>
    </g>

    <!-- STUDENT 2: Boy with Certificate -->
    <g id="char-2">
      <path d="M 238 345 L 236 382 M 254 345 L 256 382" stroke="#1e293b" stroke-width="6.5" stroke-linecap="round" />
      <ellipse cx="234" cy="384" rx="10" ry="5.5" fill="#090d16" />
      <ellipse cx="258" cy="384" rx="10" ry="5.5" fill="#090d16" />
      <path d="M 224 225 L 208 348 C 208 353 282 353 282 348 L 266 225 Z" fill="url(#robeGrad1)" />
      <path d="M 235 226 L 228 340 L 237 340 L 241 226 Z" fill="url(#emeraldStoleGrad)" />
      <path d="M 255 226 L 251 340 L 260 340 L 261 226 Z" fill="url(#emeraldStoleGrad)" />
      <path d="M 220 234 Q 210 265 234 274" stroke="url(#robeGrad1)" stroke-width="14" stroke-linecap="round" fill="none" />
      <path d="M 270 234 Q 280 265 256 274" stroke="url(#robeGrad1)" stroke-width="14" stroke-linecap="round" fill="none" />
      <rect x="220" y="262" width="50" height="20" rx="4" fill="#fef3c7" stroke="#fbbf24" stroke-width="1.3" />
      <rect x="241" y="261" width="9" height="22" fill="#2563eb" />
      <circle cx="245" cy="272" r="5.5" fill="#fbbf24" stroke="#d97706" stroke-width="1" />
      <path d="M 243 277 L 238 290 L 243 286 L 248 290 Z" fill="#2563eb" />
      <circle cx="220" cy="272" r="5" fill="#fed7aa" />
      <circle cx="270" cy="272" r="5" fill="#fed7aa" />
      <path d="M 240 206 L 240 224 L 250 224 L 250 206 Z" fill="#fed7aa" />
      <circle cx="245" cy="192" r="18" fill="#fed7aa" />
      <path d="M 227 186 C 230 178 260 178 263 186 Z" fill="#18181b" />
      <circle cx="238" cy="191" r="6" stroke="#38bdf8" stroke-width="1.5" fill="none" />
      <circle cx="252" cy="191" r="6" stroke="#38bdf8" stroke-width="1.5" fill="none" />
      <line x1="244" y1="191" x2="246" y2="191" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="238" cy="191" r="1.8" fill="#18181b" />
      <circle cx="252" cy="191" r="1.8" fill="#18181b" />
      <path d="M 239 200 Q 245 208 251 200 Z" fill="#ef4444" stroke="#ef4444" stroke-width="1" />
      <polygon points="245,158 284,171 245,184 206,171" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
      <path d="M 226 177 Q 245 186 264 177 L 264 182 Q 245 191 226 182 Z" fill="#1e293b" />
      <circle cx="245" cy="171" r="2.8" fill="#fbbf24" />
      <path d="M 245 171 Q 268 178 274 195" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <polygon points="271,195 277,195 275,203 272,203" fill="#f59e0b" />
    </g>

    <!-- STUDENT 3: Center Tech Hero -->
    <g id="char-3">
      <path d="M 390 345 L 388 382 M 410 345 L 412 382" stroke="#0f172a" stroke-width="7.5" stroke-linecap="round" />
      <ellipse cx="385" cy="384" rx="12" ry="6" fill="#2563eb" />
      <ellipse cx="415" cy="384" rx="12" ry="6" fill="#2563eb" />
      <ellipse cx="385" cy="387" rx="11" ry="2.2" fill="#38bdf8" />
      <ellipse cx="415" cy="387" rx="11" ry="2.2" fill="#38bdf8" />
      <path d="M 374 218 L 354 350 C 354 355 446 355 446 350 L 426 218 Z" fill="url(#robeGrad2)" />
      <path d="M 388 220 L 378 342 L 392 342 L 397 220 Z" fill="url(#cyanStoleGrad)" />
      <path d="M 412 220 L 406 342 L 420 342 L 421 220 Z" fill="url(#goldStoleGrad)" />
      <ellipse cx="400" cy="248" rx="42" ry="24" fill="#38bdf8" fill-opacity="0.22" filter="url(#hscCyanGlow)" />
      <polygon points="360,238 440,238 446,286 354,286" fill="url(#laptopScreenGrad)" stroke="#bae6fd" stroke-width="1.8" />
      <text x="400" y="258" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">&lt;HSC PASSED /&gt;</text>
      <text x="400" y="274" font-family="monospace" font-size="7.5" font-weight="bold" fill="#a7f3d0" text-anchor="middle">NEXT: CODE THE FUTURE</text>
      <circle cx="366" cy="244" r="1.8" fill="#f43f5e" />
      <circle cx="372" cy="244" r="1.8" fill="#fbbf24" />
      <circle cx="378" cy="244" r="1.8" fill="#10b981" />
      <polygon points="350,286 450,286 442,300 358,300" fill="#334155" stroke="#475569" stroke-width="1.2" />
      <rect x="393" y="290" width="14" height="6" rx="1" fill="#1e293b" />
      <circle cx="351" cy="286" r="5.5" fill="#fed7aa" />
      <circle cx="449" cy="286" r="5.5" fill="#fed7aa" />
      <path d="M 368 228 Q 348 260 353 286" stroke="url(#robeGrad2)" stroke-width="15" stroke-linecap="round" fill="none" />
      <path d="M 432 228 Q 452 260 447 286" stroke="url(#robeGrad2)" stroke-width="15" stroke-linecap="round" fill="none" />
      <path d="M 395 200 L 395 218 L 405 218 L 405 200 Z" fill="#fed7aa" />
      <circle cx="400" cy="186" r="19.5" fill="#fed7aa" />
      <path d="M 381 180 C 385 168 415 168 419 180 Z" fill="#0f172a" />
      <circle cx="393" cy="184" r="2.6" fill="#0f172a" />
      <circle cx="407" cy="184" r="2.6" fill="#0f172a" />
      <circle cx="394.5" cy="182.5" r="0.9" fill="#ffffff" />
      <circle cx="408.5" cy="182.5" r="0.9" fill="#ffffff" />
      <circle cx="388" cy="190" r="3.8" fill="#f472b6" opacity="0.55" />
      <circle cx="412" cy="190" r="3.8" fill="#f472b6" opacity="0.55" />
      <path d="M 394 192 Q 400 201 406 192 Z" fill="#ef4444" stroke="#ef4444" stroke-width="1" />
      <rect x="396" y="192" width="8" height="2.5" rx="0.5" fill="#ffffff" />
      <g transform="rotate(3 400 152)">
        <polygon points="400,150 442,164 400,178 358,164" fill="#0a0f1d" stroke="#38bdf8" stroke-width="1.8" filter="url(#hscCyanGlow)" />
        <path d="M 379 171 Q 400 180 421 171 L 421 177 Q 400 186 379 177 Z" fill="#1e293b" />
        <circle cx="400" cy="164" r="3" fill="#fbbf24" />
        <path d="M 400 164 Q 426 172 434 192" stroke="#fbbf24" stroke-width="2.6" fill="none" stroke-linecap="round" />
        <polygon points="431,192 437,192 435,200 432,200" fill="#f59e0b" />
      </g>
    </g>

    <!-- STUDENT 4: Boy Cheering with Both Hands Raised -->
    <g id="char-4">
      <path d="M 548 345 L 546 382 M 564 345 L 566 382" stroke="#1e293b" stroke-width="6.5" stroke-linecap="round" />
      <ellipse cx="544" cy="384" rx="10" ry="5.5" fill="#090d16" />
      <ellipse cx="568" cy="384" rx="10" ry="5.5" fill="#090d16" />
      <path d="M 534 225 L 518 348 C 518 353 592 353 592 348 L 576 225 Z" fill="url(#robeGrad1)" />
      <path d="M 546 226 L 537 340 L 547 340 L 551 226 Z" fill="url(#goldStoleGrad)" />
      <path d="M 564 226 L 557 340 L 567 340 L 569 226 Z" fill="url(#goldStoleGrad)" />
      <path d="M 528 230 Q 512 185 498 142" stroke="url(#robeGrad1)" stroke-width="15" stroke-linecap="round" fill="none" />
      <circle cx="496" cy="138" r="6" fill="#fed7aa" />
      <path d="M 582 230 Q 598 185 612 142" stroke="url(#robeGrad1)" stroke-width="15" stroke-linecap="round" fill="none" />
      <circle cx="614" cy="138" r="6" fill="#fed7aa" />
      <path d="M 550 205 L 550 224 L 560 224 L 560 205 Z" fill="#fed7aa" />
      <circle cx="555" cy="191" r="18" fill="#fed7aa" />
      <path d="M 537 185 C 540 176 570 176 573 185 Z" fill="#18181b" />
      <path d="M 547 186 Q 551 180 555 186" stroke="#18181b" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <path d="M 559 186 Q 563 180 567 186" stroke="#18181b" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <circle cx="544" cy="193" r="3.8" fill="#f472b6" opacity="0.6" />
      <circle cx="568" cy="193" r="3.8" fill="#f472b6" opacity="0.6" />
      <path d="M 547 195 Q 557 209 567 195 Z" fill="#b91c1c" stroke="#b91c1c" stroke-width="1" />
      <path d="M 551 204 Q 557 209 563 204 Z" fill="#f43f5e" />
      <polygon points="555,158 594,171 555,184 516,171" fill="#0f172a" stroke="#f59e0b" stroke-width="1.5" />
      <path d="M 536 177 Q 555 186 574 177 L 574 182 Q 555 191 536 182 Z" fill="#1e293b" />
      <circle cx="555" cy="171" r="2.8" fill="#fbbf24" />
      <path d="M 555 171 Q 576 178 582 195" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <polygon points="579,195 585,195 583,203 580,203" fill="#f59e0b" />
    </g>

    <!-- STUDENT 5: Girl with Headphones & Thumbs Up -->
    <g id="char-5">
      <path d="M 682 345 L 680 382 M 698 345 L 700 382" stroke="#fed7aa" stroke-width="6.5" stroke-linecap="round" />
      <ellipse cx="678" cy="384" rx="10" ry="5.5" fill="#1e1b4b" />
      <ellipse cx="702" cy="384" rx="10" ry="5.5" fill="#1e1b4b" />
      <path d="M 670 226 L 654 348 C 654 353 726 353 726 348 L 710 226 Z" fill="url(#robeGrad2)" />
      <path d="M 682 228 L 675 340 L 684 340 L 687 228 Z" fill="url(#purpleStoleGrad)" />
      <path d="M 698 228 L 692 340 L 701 340 L 700 228 Z" fill="url(#purpleStoleGrad)" />
      <path d="M 675 218 C 675 235 705 235 705 218" stroke="#334155" stroke-width="6" fill="none" stroke-linecap="round" />
      <rect x="668" y="212" width="9" height="16" rx="4.5" fill="#38bdf8" />
      <rect x="703" y="212" width="9" height="16" rx="4.5" fill="#38bdf8" />
      <path d="M 664 234 Q 644 260 652 278" stroke="url(#robeGrad2)" stroke-width="15" stroke-linecap="round" fill="none" />
      <g transform="translate(645, 271)">
        <circle cx="6" cy="10" r="5" fill="#fed7aa" />
        <path d="M 5 6 L 5 0 Q 5 -2 7.5 -2 Q 10 -2 10 0 L 10 6 Z" fill="#fed7aa" stroke="#fcd34d" stroke-width="0.9" />
      </g>
      <path d="M 716 234 Q 732 260 724 282" stroke="url(#robeGrad2)" stroke-width="15" stroke-linecap="round" fill="none" />
      <rect x="715" y="271" width="18" height="26" rx="3" fill="#1e293b" stroke="#c084fc" stroke-width="1.4" transform="rotate(-12 724 284)" />
      <circle cx="722" cy="284" r="5" fill="#fed7aa" />
      <path d="M 685 208 L 685 224 L 695 224 L 695 208 Z" fill="#fed7aa" />
      <path d="M 669 184 C 665 212 671 232 677 238 C 681 218 677 195 679 186 Z" fill="#312e81" />
      <path d="M 711 184 C 715 212 709 232 703 238 C 699 218 703 195 701 186 Z" fill="#312e81" />
      <circle cx="690" cy="192" r="18" fill="#fed7aa" />
      <path d="M 672 186 C 677 175 703 175 708 186 Z" fill="#312e81" />
      <circle cx="684" cy="190" r="2.4" fill="#18181b" />
      <circle cx="685" cy="189" r="0.8" fill="#ffffff" />
      <path d="M 693 190 Q 697 185 701 190" stroke="#18181b" stroke-width="2.5" stroke-linecap="round" fill="none" />
      <circle cx="678" cy="195" r="3.2" fill="#f472b6" opacity="0.6" />
      <circle cx="702" cy="195" r="3.2" fill="#f472b6" opacity="0.6" />
      <path d="M 684 198 Q 691 205 698 198" stroke="#ef4444" stroke-width="2.2" stroke-linecap="round" fill="none" />
      <polygon points="690,158 729,171 690,184 651,171" fill="#1e1b4b" stroke="#c084fc" stroke-width="1.5" />
      <path d="M 671 177 Q 690 186 709 177 L 709 182 Q 690 191 671 182 Z" fill="#312e81" />
      <circle cx="690" cy="171" r="2.8" fill="#fbbf24" />
      <path d="M 690 171 Q 712 178 718 195" stroke="#fbbf24" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <polygon points="715,195 721,195 719,203 716,203" fill="#f59e0b" />
    </g>
  </g>

  <!-- Bottom Feature Badges Bar -->
  <g transform="translate(180, 1025)">
    <rect width="250" height="44" rx="22" fill="#0f172a" fill-opacity="0.9" stroke="#38bdf8" stroke-width="1.2"/>
    <circle cx="28" cy="22" r="4.5" fill="#38bdf8"/>
    <text x="44" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14.5" fill="#f1f5f9">Web Development</text>
  </g>
  <g transform="translate(475, 1025)">
    <rect width="250" height="44" rx="22" fill="#0f172a" fill-opacity="0.9" stroke="#34d399" stroke-width="1.2"/>
    <circle cx="28" cy="22" r="4.5" fill="#34d399"/>
    <text x="44" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14.5" fill="#f1f5f9">C Programming Lab</text>
  </g>
  <g transform="translate(770, 1025)">
    <rect width="250" height="44" rx="22" fill="#0f172a" fill-opacity="0.9" stroke="#fbbf24" stroke-width="1.2"/>
    <circle cx="28" cy="22" r="4.5" fill="#fbbf24"/>
    <text x="44" y="27" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="14.5" fill="#f1f5f9">100% Free Platform</text>
  </g>

  <!-- Bottom Footer Bar -->
  <g transform="translate(600, 1125)" text-anchor="middle">
    <text font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="15" fill="#94a3b8" letter-spacing="2">
      VISIT: <tspan fill="#38bdf8" font-weight="700">lugaish.com</tspan>  •  FACEBOOK: <tspan fill="#38bdf8" font-weight="700">facebook.com/lugaish</tspan>  •  LEARN. BUILD. GROW.
    </text>
  </g>
</svg>`;
}

export function HscCelebrationBanner() {
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Trigger celebration confetti on initial view
  useEffect(() => {
    try {
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.35 },
          colors: ['#38bdf8', '#34d399', '#fbbf24', '#c084fc', '#ffffff']
        });
      }, 500);
      return () => clearTimeout(timer);
    } catch {
      // ignore
    }
  }, []);

  const triggerConfetti = (e) => {
    e?.stopPropagation();
    try {
      confetti({
        particleCount: 85,
        spread: 100,
        origin: { y: 0.45 },
        colors: ['#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#818cf8', '#ffffff']
      });
    } catch {
      // ignore
    }
  };

  const downloadPosterPng = () => {
    setDownloading(true);
    try {
      const svgMarkup = getHscPosterSvgString();
      const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 1200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1200, 1200);
          URL.revokeObjectURL(url);
          const link = document.createElement('a');
          link.download = 'Lugaish-HSC-Congratulations-2026.png';
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setDownloading(false);
      };

      img.onerror = () => {
        setDownloading(false);
      };

      img.src = url;
    } catch (err) {
      console.error('Failed to export poster:', err);
      setDownloading(false);
    }
  };

  if (collapsed) {
    return (
      <div 
        className="hsc-collapsed-bar" 
        onClick={() => setCollapsed(false)}
        role="button"
        tabIndex={0}
        aria-label="Expand HSC Celebration Banner"
      >
        <div className="hsc-collapsed-left">
          <span>🎓</span>
          <span><strong>HSC 2026 Special:</strong> Warmest congratulations to all students! Celebrate your milestone.</span>
        </div>
        <button 
          className="hsc-btn-ghost" 
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(false);
          }}
        >
          View Banner <ChevronDown size={14} />
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="hsc-banner-wrapper" aria-label="HSC Results Celebration Announcement">
        {/* Ambient Glows */}
        <div className="hsc-ambient-glow hsc-glow-1" aria-hidden="true" />
        <div className="hsc-ambient-glow hsc-glow-2" aria-hidden="true" />
        <div className="hsc-ambient-glow hsc-glow-3" aria-hidden="true" />
        <div className="hsc-confetti-bg" aria-hidden="true" />

        <div className="hsc-banner-inner">
          {/* Top Bar */}
          <div className="hsc-top-bar">
            <div className="hsc-badge">
              <span className="hsc-pulse-dot" />
              <span>HSC RESULT CELEBRATION · PROUD OF YOU</span>
            </div>

            <div className="hsc-top-actions">
              <button 
                className="hsc-btn-ghost" 
                onClick={() => setShowModal(true)}
                title="Preview full square poster"
              >
                <Share2 size={13} /> Social Poster
              </button>
              <button 
                className="hsc-btn-ghost" 
                onClick={() => setCollapsed(true)}
                title="Minimize banner"
                aria-label="Minimize banner"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Main Grid: Copy on Left, Animated Cartoon on Right */}
          <div className="hsc-main-layout">
            <div className="hsc-copy-side">
              <p className="hsc-kicker">
                <Sparkles size={18} /> Warmest Congratulations to All Students
              </p>

              <h2 className="hsc-main-title">
                <span className="hsc-title-gradient">YOUR HSC RESULT</span>
              </h2>

              <p className="hsc-tagline">
                Celebrate your achievement today! <strong>The tech world is waiting for your next step.</strong> Go from your academic milestone to building real websites, mastering programming in Bangla &amp; English, and shaping your own career.
              </p>

              {/* Action Buttons */}
              <div className="hsc-action-row">
                <Link to="/learn/web-development/html" className="hsc-btn-primary">
                  Start Your Tech Journey <ArrowRight size={17} />
                </Link>

                <button 
                  className="hsc-btn-secondary" 
                  onClick={() => setShowModal(true)}
                >
                  <Download size={16} /> Save / Share Poster
                </button>

                <button 
                  className="hsc-btn-celebrate" 
                  onClick={triggerConfetti}
                  title="Fire more celebratory confetti!"
                >
                  <Sparkles size={16} /> Celebrate 🎉
                </button>
              </div>

              {/* Perks / Highlights */}
              <div className="hsc-perks">
                <span className="hsc-perk-item">
                  <CheckCircle2 size={15} /> 100% Free Access
                </span>
                <span className="hsc-perk-item">
                  <CheckCircle2 size={15} /> Web Development &amp; C Programming
                </span>
                <span className="hsc-perk-item">
                  <CheckCircle2 size={15} /> Sequential Practice Labs
                </span>
              </div>
            </div>

            {/* Cartoon Artwork Side */}
            <div className="hsc-artwork-side">
              <HscCelebrationIllustration animated={true} />
            </div>
          </div>
        </div>
      </section>

      {/* Social Poster Export Modal */}
      {showModal && (
        <div className="hsc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="hsc-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="hsc-modal-header">
              <h3>
                <Sparkles size={20} color="#fbbf24" /> HSC Celebration Social Poster
              </h3>
              <button 
                className="hsc-modal-close" 
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            <div className="hsc-poster-frame">
              {/* Live Render of 1200x1200 Poster SVG inside the frame */}
              <div 
                dangerouslySetInnerHTML={{ __html: getHscPosterSvgString() }} 
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            <div className="hsc-modal-footer">
              <div className="hsc-modal-info">
                <span>Square (1:1) format · Perfect for <strong>Facebook</strong>, <strong>Instagram</strong> &amp; <strong>WhatsApp</strong></span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  className="hsc-btn-primary" 
                  onClick={downloadPosterPng}
                  disabled={downloading}
                >
                  <Download size={17} />
                  {downloading ? 'Generating PNG...' : 'Download High-Res PNG (1200×1200)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
