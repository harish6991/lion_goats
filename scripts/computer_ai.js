import { movementMap, tigerJumps, tigerIsCaught } from "./board_rules.js";

const SEARCH_DEPTH = 8;
const PROGRESS = [0, 1, 0, 3, 4, 4, 6, 5, 5, 2];

let repetition = new Map();

export function resetComputerMemory() {
  repetition = new Map();
}

export function readBoard(gameSection) {
  let tiger = -1;
  const sheep = [];
  gameSection.forEach((section, index) => {
    if (section.querySelector(".tiger")) tiger = index;
    if (section.querySelector(".sheeps")) sheep.push(index);
  });
  return { tiger, sheep };
}

export function rememberPosition(state) {
  const key = positionKey(state);
  repetition.set(key, (repetition.get(key) || 0) + 1);
}

export function noteBoard(gameSection) {
  rememberPosition(readBoard(gameSection));
}

export function chooseComputerMove(state, side, rand = Math.random) {
  const normalized = normalize(state);
  const moves = side === "TIGER" ? tigerMoveList(normalized) : sheepMoveList(normalized);
  if (moves.length === 0) return null;
  if (moves.length === 1) return moves[0];

  for (const move of moves) {
    const next = applyState(normalized, move);
    if (side === "TIGER" && next.sheep.length <= 1) return move;
    if (side === "SHEEPS" && tigerIsCaught(next.tiger, next.sheep)) return move;
  }

  const tigerToMove = side === "TIGER";
  let bestScore = tigerToMove ? -Infinity : Infinity;
  let bestMoves = [];

  for (const move of moves) {
    const next = applyState(normalized, move);
    let score = minimax(next, SEARCH_DEPTH - 1, -Infinity, Infinity, !tigerToMove);
    const repeats = repetition.get(positionKey(next)) || 0;
    score += tigerToMove ? -repeats * 90 : repeats * 90;

    if (score === bestScore) {
      bestMoves.push(move);
    } else if (tigerToMove ? score > bestScore : score < bestScore) {
      bestScore = score;
      bestMoves = [move];
    }
  }

  return bestMoves[Math.floor(rand() * bestMoves.length)];
}

export function applyState(state, move) {
  if (move.side === "TIGER") {
    const sheep = move.capture == null
      ? state.sheep.slice()
      : state.sheep.filter((pos) => pos !== move.capture);
    return { tiger: move.to, sheep };
  }

  const sheep = state.sheep.filter((pos) => pos !== move.from);
  sheep.push(move.to);
  sheep.sort((a, b) => a - b);
  return { tiger: state.tiger, sheep };
}

export function takeComputerTurn(gameSection, side) {
  const move = chooseComputerMove(readBoard(gameSection), side);
  if (!move) return false;
  return applyComputerMove(gameSection, move, side);
}

function applyComputerMove(gameSection, move, side) {
  const from = gameSection[move.from];
  const to = gameSection[move.to];
  if (!from || !to) return false;

  const piece = from.querySelector(side === "TIGER" ? ".tiger" : ".sheeps");
  if (!piece || to.querySelector(".icon_wrapper")) return false;

  if (move.capture != null) {
    const captured = gameSection[move.capture]?.querySelector(".sheeps");
    if (!captured) return false;
    captured.remove();
  }

  if (side === "SHEEPS") {
    gameSection.forEach((section) => {
      const sheep = section.querySelector(".sheeps");
      if (sheep) sheep.style.backgroundColor = "rgba(77, 81, 82, 0.8)";
    });
  }

  to.appendChild(piece);
  piece.style.backgroundColor = side === "TIGER" ? "rgba(247, 149, 52, 0.8)" : "blue";
  return true;
}

function normalize(state) {
  return {
    tiger: state.tiger,
    sheep: [...state.sheep].sort((a, b) => a - b),
  };
}

function positionKey(state) {
  return `${state.tiger}:${[...state.sheep].sort((a, b) => a - b).join(",")}`;
}

function occupiedSet(state) {
  const occupied = new Set(state.sheep);
  occupied.add(state.tiger);
  return occupied;
}

function tigerMoveList(state) {
  const occupied = occupiedSet(state);
  const moves = [];

  for (const to of movementMap[state.tiger] || []) {
    if (!occupied.has(to)) {
      moves.push({ from: state.tiger, to, capture: null, side: "TIGER" });
    }
  }

  for (const jump of tigerJumps) {
    if (jump.tiger !== state.tiger) continue;
    if (!state.sheep.includes(jump.sheep)) continue;
    if (occupied.has(jump.empty)) continue;
    moves.push({ from: state.tiger, to: jump.empty, capture: jump.sheep, side: "TIGER" });
  }

  return moves;
}

function sheepMoveList(state) {
  const occupied = occupiedSet(state);
  const moves = [];

  for (const from of state.sheep) {
    for (const to of movementMap[from] || []) {
      if (!occupied.has(to)) {
        moves.push({ from, to, capture: null, side: "SHEEPS" });
      }
    }
  }

  return moves;
}

function minimax(state, depth, alpha, beta, tigerToMove) {
  if (state.sheep.length <= 1) return 100000 + depth;
  if (tigerIsCaught(state.tiger, state.sheep)) return -100000 - depth;
  if (depth === 0) return quiescence(state, tigerToMove);

  const moves = tigerToMove ? tigerMoveList(state) : sheepMoveList(state);
  if (moves.length === 0) return tigerToMove ? -90000 - depth : 60000 + depth;

  if (tigerToMove) {
    let best = -Infinity;
    for (const move of movesWithCapturesFirst(moves)) {
      const score = minimax(applyState(state, move), depth - 1, alpha, beta, false);
      if (score > best) best = score;
      if (score > alpha) alpha = score;
      if (alpha >= beta) break;
    }
    return best;
  }

  let best = Infinity;
  for (const move of moves) {
    const score = minimax(applyState(state, move), depth - 1, alpha, beta, true);
    if (score < best) best = score;
    if (score < beta) beta = score;
    if (alpha >= beta) break;
  }
  return best;
}

function movesWithCapturesFirst(moves) {
  return moves.slice().sort((a, b) => (b.capture != null) - (a.capture != null));
}

function quiescence(state, tigerToMove) {
  let score = evaluate(state);
  if (!tigerToMove) return score;
  for (const move of tigerMoveList(state)) {
    if (move.capture == null) continue;
    const afterCapture = evaluate(applyState(state, move));
    if (afterCapture > score) score = afterCapture;
  }
  return score;
}

function evaluate(state) {
  const tigerMoves = tigerMoveList(state);
  let score = (3 - state.sheep.length) * 1000;
  score += tigerMoves.length * 8;
  score += tigerMoves.filter((move) => move.capture != null).length * 220;
  if (tigerMoves.length === 0) score -= 5000;
  score += jumpSetup(state) * 70;
  score -= nearestSheepDistance(state) * 16;
  score -= sheepTrapScore(state);
  return score;
}

function jumpSetup(state) {
  let setups = 0;
  for (const jump of tigerJumps) {
    if (jump.tiger !== state.tiger) continue;
    if (state.sheep.includes(jump.empty) || state.sheep.includes(jump.sheep)) continue;
    const sheepCanStepIn = state.sheep.some((pos) => (movementMap[pos] || []).includes(jump.sheep));
    if (sheepCanStepIn) setups += 1;
  }
  return setups;
}

function nearestSheepDistance(state) {
  let nearest = 8;
  for (const sheep of state.sheep) {
    nearest = Math.min(nearest, directedDistance(state.tiger, sheep));
  }
  return nearest;
}

function directedDistance(from, to) {
  if (from === to) return 0;
  const queue = [from];
  const dist = new Map([[from, 0]]);
  while (queue.length) {
    const pos = queue.shift();
    const soFar = dist.get(pos);
    for (const next of movementMap[pos] || []) {
      if (dist.has(next)) continue;
      if (next === to) return soFar + 1;
      dist.set(next, soFar + 1);
      queue.push(next);
    }
  }
  return 8;
}

function sheepTrapScore(state) {
  let score = 0;
  for (const pos of state.sheep) score += PROGRESS[pos] * 16;
  if (state.sheep.includes(4)) score += 28;
  if (state.sheep.includes(5)) score += 28;
  if (state.tiger === 3) {
    if (state.sheep.includes(4)) score += 140;
    if (state.sheep.includes(5)) score += 140;
  }
  if (state.tiger === 6) {
    if (state.sheep.includes(7)) score += 90;
    if (state.sheep.includes(8)) score += 90;
    if (state.sheep.includes(9)) score += 90;
  }
  return score;
}
