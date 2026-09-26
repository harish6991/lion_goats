import { takeComputerTurn } from "./computer_ai.js";

export function playingAsTiger(gameSection) {
  return takeComputerTurn(gameSection, "TIGER");
}
