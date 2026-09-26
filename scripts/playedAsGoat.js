import { takeComputerTurn } from "./computer_ai.js";

export function playingAsGoat(gameSection) {
  return takeComputerTurn(gameSection, "SHEEPS");
}