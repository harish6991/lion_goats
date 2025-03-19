import { playerTurn } from "./game_logic.js";

let game_board = document.querySelector("#game_board")
let game_section = [];
let turnInit  = "SHEEPS";

function vsComputerMode(){
    alert("will be avilable soon working on it")
}

function startGame(mode) {
      document.querySelector('.game-container').style.display ="none";
      document.querySelector('.container').classList.toggle('game_box');
      initGame()
      playerTurn(turnInit,game_section)


  }
function initGame(){
  // Append the dot to the body
  function drawLine(startX, startY, angleDeg, numDots, spacing, color, zIndex=500) {
    let angle = angleDeg * (Math.PI / 180); // Convert degrees to radians

    for (let i = 0; i < numDots; i++) {
        const dot = document.createElement("div");

        // Apply styles to make it a small dot
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.backgroundColor = color;
        dot.style.borderRadius = "50%";
        dot.style.position = "absolute";
        dot.style.zIndex = zIndex; // Use passed zIndex value

        // Calculate new position using trigonometry
        let x = startX + i * spacing * Math.cos(angle);
        let y = startY - i * spacing * Math.sin(angle); // Negative for correct Y direction

        // Move dot to the calculated position
        dot.style.transform = `translate(${x}px, ${y}px)`;

        if (i === numDots - 1 || i === 0) {
            dot.classList.add("intersection_point");
        }

        game_board.appendChild(dot);
    }
}


  // intializing the game board
  drawLine(5, 30, 239, 55, 7,'white'); // left line
  drawLine(5, 30, 299, 55, 7,'white'); // right line
  drawLine(183, 360, 180, 55, 7,'white'); // base line


  drawLine(180, 558, 180, 55, 7,'white');  // lower base line
  drawLine(5, 558, 90, 29, 7,'white'); // lower base  connector
  drawLine(5, 194, 90, 23, 7,'white',800); // upp connector
  drawLine(92, 200, 180, 28, 7,'white',600)// upp base line
  // drawLine(350, 558, 180, 25, 7,'white');  // lower base line



  let game_board_points = document.querySelectorAll(".intersection_point")
  const selectedIndices = [7, 8, 6, 9, 5, 4, 10, 13, 12, 11];
  // game section ponint
  function addPointsToGameSection(indices) {
      indices.forEach(index => {
          if (game_board_points[index]) {
              game_section.push(game_board_points[index]);
          }
      });
  }

  addPointsToGameSection(selectedIndices);

  // creating and placing the playrers
  //creating and  placing the sheeps
  for (let i = 0; i < 3; i++) {
    let sheep = document.createElement("button");
    sheep.classList.add("icon_wrapper", "sheeps");

      // Set background image using CSS
    sheep.style.backgroundImage = "url('./styles/head-of-goat-svgrepo-com.svg')";
    sheep.style.backgroundSize = "contain"; // Adjust size to fit
    sheep.style.backgroundRepeat = "no-repeat";
    sheep.style.backgroundPosition = "center";



    document.body.appendChild(sheep); // Append to body or desired parent


    // Ensure game_section is correctly selected
    if (game_section[i]) {
      game_section[i].appendChild(sheep); // Append a unique sheep to each section
    }
  }

  // creating and placing  the tiger

  let tiger = document.createElement("button");
  tiger.classList.add("icon_wrapper");
  tiger.classList.add("tiger");
  let tiger_image = document.createElement("img");
  tiger_image.classList.add("icon_image");
  tiger_image.src = "./styles/tiger-head-svgrepo-com.svg";
  tiger.appendChild(tiger_image)
  // game_section[3].appendChild(tiger)
  game_section[game_section.length -1].appendChild(tiger)

}

window.startGame = startGame;

// intit players turn
