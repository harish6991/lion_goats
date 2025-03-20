import { calculateGoatMove, calculateTigerMove } from './helping_function.js';

let selectedSheep = null;
let selectedTiger = null;


export function playerTurn(turn,game_section) {
  // Selection of players
    // Select all sheeps and tigers
    removeEventListeners(game_section);
    let sheeps = document.querySelectorAll(".sheeps");
    let tigers = document.querySelectorAll(".tiger");
    let turnElement = document.querySelector("#current-turn");
    turnElement.classList.remove("sheep-turn", "tiger-turn");
    document.querySelector("#total-sheeps").innerHTML = sheeps.length

    turnElement.innerHTML = turn;

    if(sheeps.length === 1){ console.log("Lions has win") }

    if (turn === "SHEEPS") {
        const randomIndex = Math.floor(Math.random() * sheeps.length);
        sheeps[randomIndex].style.backgroundColor = "blue"
        turnElement.classList.add("sheep-turn");
        sheepTurns(sheeps,game_section,turn)
        // console.log("Sheeps Turn");
    } else {
        tigers[0].style.backgroundColor = "rgba(247, 149, 52, 0.8)"
        turnElement.classList.add("tiger-turn");
        tigerTurn(tigers,game_section,turn)
        // console.log("Other Turn");
    }
}



function removeEventListeners(game_sections) {
    game_sections.forEach((section, index) => {
        // Remove all elements with class "green_dot"
        section.querySelectorAll(".green_dot").forEach((dot) => dot.remove());

        // Clone the section to remove existing event listeners
        let newSection = section.cloneNode(true);
        section.replaceWith(newSection);
        game_sections[index] = newSection; // Update reference in the array
    });
}


// Handling sheep selection

function sheepTurns(sheeps,game_section,turn){
  sheeps.forEach((sheep) => {
    sheep.addEventListener("click", function () {

      // Prevent re-running if the same sheep is clicked
      if (selectedSheep === this) return;

      // Reset previous sheep selections
      sheeps.forEach((s) => (s.style.backgroundColor = `rgba(77, 81, 82, 0.8)`));

      // Select new sheep
      selectedSheep = this;
      selectedTiger = null; // Deselect tiger if a sheep is selected
      this.style.backgroundColor = "blue";
      calculateGoatMove(this.parentNode,game_section,turn);
    });

  });

}
function tigerTurn(tigers,game_section,turn){
  // Handling tiger selection
  tigers.forEach((tiger) => {
    tiger.addEventListener("click", function () {
      // Prevent re-running if the same tiger is clicked
      if (selectedTiger === this) return;

      // Reset previous tiger selections
      tigers.forEach((t) => (t.style.backgroundColor = ""));

      // Select new tiger
      selectedTiger = this;
      selectedSheep = null; // Deselect sheep if a tiger is selected
      this.style.backgroundColor = `rgba(247, 149, 52, 0.8)`;
      calculateTigerMove(this.parentNode,game_section,turn);
    });
  });


}
