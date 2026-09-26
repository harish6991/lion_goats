export const movementMap = {
  0: [1],
  1: [0, 2, 3],
  2: [1],
  3: [4, 5],
  4: [3, 7],
  5: [3, 8],
  6: [7, 8, 9],
  7: [4, 6, 9],
  8: [5, 6, 9],
  9: [6, 7, 8],
};

export const tigerJumps = [
  { tiger: 9, sheep: 8, empty: 5 },
  { tiger: 9, sheep: 7, empty: 4 },
  { tiger: 7, sheep: 6, empty: 8 },
  { tiger: 8, sheep: 6, empty: 7 },
  { tiger: 4, sheep: 3, empty: 5 },
  { tiger: 5, sheep: 3, empty: 4 },
  { tiger: 5, sheep: 8, empty: 9 },
  { tiger: 4, sheep: 7, empty: 9 },
];

export function tigerIsCaught(tigerPos, sheepPositions) {
  const hasSheep = (pos) => sheepPositions.includes(pos);
  if (tigerPos === 3 && hasSheep(4) && hasSheep(5)) return true;
  if (tigerPos === 6 && hasSheep(7) && hasSheep(8) && hasSheep(9)) return true;
  return false;
}
