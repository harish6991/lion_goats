import { playerTurn } from "./game_logic.js";

export function playingAsTiger(game_section,turn){
  let section_containing_tiger = game_section.filter((item) =>item.querySelector(".tiger") !== null);
  makeATigerMove(game_section[8],section_containing_tiger[0],turn,game_section)
}


function makeATigerMove(nextBox, previousBox,turn,game_section) {
       console.log("test",nextBox, previousBox)
      let childElement = previousBox.querySelector(".icon_wrapper");

      previousBox.removeChild(childElement);
      nextBox.appendChild(childElement);
      // nextBox.removeChild(greenDot)
      nextBox.firstChild.style.backgroundColor = `rgba(77, 81, 82, 0.8)`
      turn === "SHEEPS"?(turn = 'TIGER'):(turn='SHEEPS')

      findBestMoveForTiger()
      playerTurn(turn,game_section)

}

function findBestMoveForTiger(board){

}
