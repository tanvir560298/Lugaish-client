// Chor Babu Police Dakat Game Engine
// Supports 4-player and 5-player modes with traditional Bangladeshi rules

export const ROLES_4 = [
  { id: 'babu', name: 'বাবু', points: 1000, reveals: true, icon: '👑', badge: 'রাজকীয়' },
  { id: 'police', name: 'পুলিশ', points: 800, guesser: true, icon: '👮‍♂️', badge: 'তদন্তকারী' },
  { id: 'dakat', name: 'ডাকাত', points: 500, suspect: true, icon: '🦹‍♂️', badge: 'সন্দেহভাজন' },
  { id: 'chor', name: 'চোর', points: 0, suspect: true, icon: '🕵️‍♂️', badge: 'সন্দেহভাজন' },
];

export const ROLES_5 = [
  { id: 'babu', name: 'বাবু', points: 1000, reveals: true, icon: '👑', badge: 'রাজকীয়' },
  { id: 'rani', name: 'রানী', points: 900, reveals: true, icon: '👸', badge: 'মহীয়সী' },
  { id: 'police', name: 'পুলিশ', points: 800, guesser: true, icon: '👮‍♂️', badge: 'তদন্তকারী' },
  { id: 'dakat', name: 'ডাকাত', points: 500, suspect: true, icon: '🦹‍♂️', badge: 'সন্দেহভাজন' },
  { id: 'chor', name: 'চোর', points: 0, suspect: true, icon: '🕵️‍♂️', badge: 'সন্দেহভাজন' },
];

export const DEFAULT_CAMPUS_PLAYERS = [
  { id: 'player-me', name: 'আপনি (You)', isHuman: true, avatar: '/models/student/preview.png', color: '#6366f1' },
  { id: 'player-zain', name: 'জাইন (Zain)', isHuman: false, avatar: '/models/student/zain.png', color: '#10b981' },
  { id: 'player-noor', name: 'নূর (Noor)', isHuman: false, avatar: '/models/student/noor.png', color: '#f59e0b' },
  { id: 'player-maya', name: 'মায়া (Maya)', isHuman: false, avatar: '/models/student/maya.png', color: '#ec4899' },
  { id: 'player-tariq', name: 'তারিক (Tariq)', isHuman: false, avatar: '/models/student/tariq.png', color: '#8b5cf6' },
];

export const SUSPECT_BLUFFS = [
  "ভাই কসম, আমাকে দেইখা কি চোর মনে হয়? আমি সাধারণ ডাকাত!",
  "পুলিশ ভাই, আমার চোখের দিকে তাকান—আমি একদম নির্দোষ!",
  "চোরের চেহারা দেখলেই তো বোঝা যায়, পাশের জনের দিকে তাকান!",
  "আমি তো একটু আগে লাইব্রেরিতে পড়ছিলাম, আমি চোর হইতে যামু কেন?",
  "ভুল করলে কিন্তু পয়েন্ট সব চোরের পকেটে যাবে, সাবধানে বাছেন!",
  "বাবু মশাই, পুলিশ ভুল লোককে সন্দেহ করতেছে!",
  "আমি তো ভালো মানুষ ভাই, অপরাধজগতে আমি নতুন!",
];

export const POLICE_THINKING_LINES = [
  "হুউম... দুজনের একজন নির্দোষ ডাকাত, আরেকজন পাক্কা চোর...",
  "চোখের চাহনি দেখে তো কাউকেই ভালো মনে হচ্ছে না!",
  "দাঁড়ান, একজন বেশি কথা বলতেছে... চোরেরা বেশি কথা বলে!",
  "বাবু মশাইয়ের হুকুম! আজ চোর আমি ধরবই ধরব!",
];

export function getRolesForCount(playerCount = 4) {
  return playerCount === 5 ? [...ROLES_5] : [...ROLES_4];
}

export function shuffleArray(arr, rng = Math.random) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createInitialGame({ playerCount = 4, targetRounds = 5, customPlayers = null, rng = Math.random } = {}) {
  const count = playerCount === 5 ? 5 : 4;
  const players = (customPlayers || DEFAULT_CAMPUS_PLAYERS).slice(0, count).map(p => ({
    ...p,
    totalScore: 0,
    roundScores: [],
  }));

  const game = {
    playerCount: count,
    targetRounds,
    currentRound: 1,
    isFinished: false,
    players,
    roundState: null,
  };

  return startNewRound(game, rng);
}

export function startNewRound(game, rng = Math.random) {
  const roles = getRolesForCount(game.playerCount);
  const shuffledRoles = shuffleArray(roles, rng);

  // Assign roles to players
  const playerRoles = {};
  game.players.forEach((p, idx) => {
    playerRoles[p.id] = shuffledRoles[idx];
  });

  const babuPlayer = game.players.find(p => playerRoles[p.id].id === 'babu');
  const raniPlayer = game.playerCount === 5 ? game.players.find(p => playerRoles[p.id].id === 'rani') : null;
  const policePlayer = game.players.find(p => playerRoles[p.id].id === 'police');
  const chorPlayer = game.players.find(p => playerRoles[p.id].id === 'chor');
  const dakatPlayer = game.players.find(p => playerRoles[p.id].id === 'dakat');

  // Suspects list (those who Police must guess from: Chor and Dakat)
  const suspects = [chorPlayer, dakatPlayer].sort(() => (rng() > 0.5 ? 1 : -1));

  // Assign random bluffing dialogues to suspects
  const bubbles = {};
  suspects.forEach((suspect, idx) => {
    bubbles[suspect.id] = SUSPECT_BLUFFS[(Math.floor(rng() * SUSPECT_BLUFFS.length) + idx) % SUSPECT_BLUFFS.length];
  });

  // Babu speech
  bubbles[babuPlayer.id] = "আমি বাবু! পুলিশ মশাই, চোর ডাকাত খুঁজে বের করো!";
  if (raniPlayer) {
    bubbles[raniPlayer.id] = "আমি রানী! চোর যেন কোনোভাবেই পালাতে না পারে!";
  }

  return {
    ...game,
    roundState: {
      phase: 'chits_ready', // 'chits_ready' -> 'chits_opened' -> 'guessing' -> 'result'
      playerRoles,
      revealedPlayerIds: [], // Babus reveal automatically
      bubbles,
      babuId: babuPlayer.id,
      raniId: raniPlayer ? raniPlayer.id : null,
      policeId: policePlayer.id,
      chorId: chorPlayer.id,
      dakatId: dakatPlayer.id,
      suspectIds: suspects.map(s => s.id),
      guessResult: null,
    },
  };
}

export function openPlayerChits(game) {
  if (!game.roundState) return game;
  const { babuId, raniId } = game.roundState;
  const autoRevealed = [babuId];
  if (raniId) autoRevealed.push(raniId);

  return {
    ...game,
    roundState: {
      ...game.roundState,
      phase: 'guessing',
      revealedPlayerIds: autoRevealed,
    },
  };
}

export function makePoliceGuess(game, guessedPlayerId) {
  if (!game.roundState || game.roundState.phase !== 'guessing') {
    return game;
  }

  const { playerRoles, policeId, chorId, dakatId, babuId, raniId } = game.roundState;
  const isCorrect = guessedPlayerId === chorId;

  // Calculate round points
  const roundPoints = {};
  roundPoints[babuId] = playerRoles[babuId].points; // 1000
  if (raniId) {
    roundPoints[raniId] = playerRoles[raniId].points; // 900
  }
  roundPoints[dakatId] = playerRoles[dakatId].points; // 500

  if (isCorrect) {
    // Police wins! Gets full 800 pts. Chor gets 0.
    roundPoints[policeId] = playerRoles[policeId].points; // 800
    roundPoints[chorId] = 0;
  } else {
    // Police failed! Police gets 0, Chor steals Police's 800 pts!
    roundPoints[policeId] = 0;
    roundPoints[chorId] = playerRoles[policeId].points; // 800 stolen!
  }

  // Update total scores
  const updatedPlayers = game.players.map(p => {
    const pts = roundPoints[p.id] || 0;
    return {
      ...p,
      totalScore: p.totalScore + pts,
      roundScores: [...p.roundScores, pts],
    };
  });

  const updatedBubbles = { ...game.roundState.bubbles };
  if (isCorrect) {
    updatedBubbles[policeId] = "ধরে ফেলেছি! তুমিই আসল চোর!";
    updatedBubbles[chorId] = "ধুর ছাই! পুলিশ আমাকে চিনে ফেলল!";
    updatedBubbles[dakatId] = "যাক বাবা! আমি বাঁচলাম, আমি তো সাধারণ ডাকাত!";
  } else {
    updatedBubbles[policeId] = "হায় হায়! আমি ভুল লোককে চোর ভেবে ফেলেছি!";
    updatedBubbles[chorId] = "হাহাহা! আমি চোর, আর পুলিশের ৮০০ পয়েন্ট এখন আমার পকেটে!";
    updatedBubbles[dakatId] = "বলছিলাম না ভাই? আমি ডাকাত, চোর না!";
  }

  // Reveal all roles
  const allPlayerIds = game.players.map(p => p.id);

  const isFinished = game.currentRound >= game.targetRounds;

  return {
    ...game,
    players: updatedPlayers,
    isFinished,
    roundState: {
      ...game.roundState,
      phase: 'result',
      revealedPlayerIds: allPlayerIds,
      bubbles: updatedBubbles,
      guessResult: {
        isCorrect,
        guessedPlayerId,
        actualChorId: chorId,
        stolenPoints: isCorrect ? 0 : playerRoles[policeId].points,
        roundPoints,
      },
    },
  };
}

export function nextRoundOrFinish(game, rng = Math.random) {
  if (game.currentRound >= game.targetRounds) {
    return {
      ...game,
      isFinished: true,
    };
  }

  return startNewRound({
    ...game,
    currentRound: game.currentRound + 1,
  }, rng);
}
