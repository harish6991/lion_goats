import { calculateGoatMove, calculateTigerMove, checkTigerIsCaught } from './helping_function.js';

let selectedSheep = null;
let selectedTiger = null;

export function playerTurn(turn, game_section) {
    removeEventListeners(game_section);
    updateTurnDisplay(turn);
    checkGameOverConditions(game_section);
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
    turnElement.innerHTML = turn;
    document.querySelector("#total-sheeps").innerHTML = document.querySelectorAll(".sheeps").length;
}

function checkGameOverConditions(game_section) {
    if (checkTigerIsCaught(game_section)) {
        setTimeout(() => {
            if (confirm("Goats have won! Do you want to play again?")) {
                location.reload();
            }
        }, 500);
    }
    if (document.querySelectorAll(".sheeps").length === 1) {
        if (confirm("Lions have won! Do you want to play again?")) {
            location.reload();
        }
    }
}

function assignTurnActions(turn, game_section) {
    if (turn === "SHEEPS") {
        handleSheepTurn(game_section);
    } else {
        handleTigerTurn(game_section);
    } checkGameOverConditions
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
            calculateTigerMove(this.parentNode, game_section, "TIGERS");
        });
    });
}
