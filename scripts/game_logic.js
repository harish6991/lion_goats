import { calculateGoatMove, calculateTigerMove, checkTigerIsCaught } from './helping_function.js';
import { playingAsTiger } from './playAsTiger.js';
import { playingAsGoat } from './playedAsGoat.js';
import { noteBoard, resetComputerMemory } from './computer_ai.js';

let computerPlayer = null;
let gameFinished = false;
var selectedSheep = null;
var selectedTiger = null;

export function setComputerPlayer(side) {
    computerPlayer = side;
    gameFinished = false;
    resetComputerMemory();
}

export function playerTurn(turn, game_section) {
    selectedSheep = null;
    selectedTiger = null;
    removeEventListeners(game_section);
    updateTurnDisplay(turn);
    noteBoard(game_section);
    if (isGameOver(game_section)) return;
    assignTurnActions(turn, game_section);
}

function removeEventListeners(game_sections) {
    game_sections.forEach((section, index) => {
        section.querySelectorAll(".green_dot").forEach((dot) => dot.remove());
        let newSection = section.cloneNode(true);
        section.replaceWith(newSection);
        game_sections[index] = newSection;
    });
}

function updateTurnDisplay(turn) {
    let turnElement = document.querySelector("#current-turn");
    turnElement.classList.remove("sheep-turn", "tiger-turn");
    turnElement.classList.add(turn === "SHEEPS" ? "sheep-turn" : "tiger-turn");
    turnElement.innerHTML = computerPlayer === turn ? `${turn} · Computer` : turn;
    document.querySelector("#total-sheeps").innerHTML = document.querySelectorAll(".sheeps").length;
}

function isGameOver(game_section) {
    if (gameFinished) return true;
    if (checkTigerIsCaught(game_section)) {
        gameFinished = true;
        announce("Goats have won! Do you want to play again?");
        return true;
    }
    if (document.querySelectorAll(".sheeps").length === 1) {
        gameFinished = true;
        announce("Lions have won! Do you want to play again?");
        return true;
    }
    return false;
}

function announce(message) {
    setTimeout(() => {
        if (confirm(message)) location.reload();
    }, 350);
}

function assignTurnActions(turn, game_section) {
    const board = document.querySelector("#game_board");
    if (computerPlayer === turn) {
        if (board) board.style.pointerEvents = "none";
        window.setTimeout(() => {
            if (gameFinished) return;
            const moved = turn === "TIGER"
                ? playingAsTiger(game_section)
                : playingAsGoat(game_section);
            if (!moved) {
                gameFinished = true;
                announce(turn === "TIGER"
                    ? "Goats have won! Do you want to play again?"
                    : "Lions have won! Do you want to play again?");
                return;
            }
            playerTurn(turn === "TIGER" ? "SHEEPS" : "TIGER", game_section);
        }, 500);
        return;
    }
    if (board) board.style.pointerEvents = "auto";
    if (turn === "SHEEPS") handleSheepTurn(game_section);
    else handleTigerTurn(game_section);
}

function handleSheepTurn(game_section) {
    let sheeps = document.querySelectorAll(".sheeps");
    if (sheeps.length === 0) return;
    sheeps[Math.floor(Math.random() * sheeps.length)].style.backgroundColor = "blue";
    document.querySelector("#current-turn").classList.add("sheep-turn");
    enableSheepSelection(sheeps, game_section);
}

function handleTigerTurn(game_section) {
    let tigers = document.querySelectorAll(".tiger");
    if (tigers.length === 0) return;
    tigers[0].style.backgroundColor = "rgba(247, 149, 52, 0.8)";
    document.querySelector("#current-turn").classList.add("tiger-turn");
    enableTigerSelection(tigers, game_section);
}

function enableSheepSelection(sheeps, game_section) {
    sheeps.forEach((sheep) => {
        sheep.addEventListener("click", function () {
            if (selectedSheep === this) return;
            sheeps.forEach((s) => (s.style.backgroundColor = "rgba(77, 81, 82, 0.8)"));
            selectedSheep = this;
            selectedTiger = null;
            this.style.backgroundColor = "blue";
            calculateGoatMove(this.parentNode, game_section, "SHEEPS");
        });
    });
}

function enableTigerSelection(tigers, game_section) {
    tigers.forEach((tiger) => {
        tiger.addEventListener("click", function () {
            if (selectedTiger === this) return;
            tigers.forEach((t) => (t.style.backgroundColor = ""));
            selectedTiger = this;
            selectedSheep = null;
            this.style.backgroundColor = "rgba(247, 149, 52, 0.8)";
            calculateTigerMove(this.parentNode, game_section, "TIGER");
        });
    });
}
