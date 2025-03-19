// function to calculate the distance between two point
import { playerTurn } from "./game_logic.js";
// possible goat moves
const movementMap = {
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


let activeLines = [];
let activeDots = []; //
let activeCross = [];

export function drawLineBetweenDivs(div1, div2, color = "red") {
  let rect1 = div1.getBoundingClientRect(); // Get div1 position
  let rect2 = div2.getBoundingClientRect(); // Get div2 position

  // Calculate center points
  let x1 = rect1.left + rect1.width / 2;
  let y1 = rect1.top + rect1.height / 2;
  let x2 = rect2.left + rect2.width / 2;
  let y2 = rect2.top + rect2.height / 2;

  // Calculate distance & angle
  let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI); // Convert radians to degrees

  // Create line element
  let line = document.createElement("div");
  line.style.position = "absolute";
  line.style.width = `${distance}px`;
  line.style.height = "4px"; // Line thickness
  line.style.transformOrigin = "left center";
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.boxShadow = `0px 0px 10px ${color}`;
  line.style.animation = "glow 1s infinite alternate"
  document.body.appendChild(line);
  return line;
}

export function drawLineForCuttingSheep(lionsDiv, sheepDiv, targetDiv, color = "red") {
  let lionRect = lionsDiv.getBoundingClientRect();
  let sheepRect = sheepDiv.getBoundingClientRect();
  let targetRect = targetDiv.getBoundingClientRect();

  // Calculate center points
  let x1 = lionRect.left + lionRect.width / 2;
  let y1 = lionRect.top + lionRect.height / 2;
  let x2 = targetRect.left + targetRect.width / 2;
  let y2 = targetRect.top + targetRect.height / 2;
  let sx = sheepRect.left + sheepRect.width / 2;
  let sy = sheepRect.top + sheepRect.height / 2;

  // Calculate distance & angle
  let distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  let angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  // Create line
  let line = document.createElement("div");
  line.style.position = "absolute";
  line.style.width = `${distance}px`;
  line.style.height = "4px";
  line.style.transformOrigin = "left center";
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  line.style.boxShadow = `0px 0px 10px ${color}`;
  line.style.animation = "glow 1s infinite alternate";
  document.body.appendChild(line);

  // Create cross mark at sheepDiv
  let cross = document.createElement("div");
  cross.style.position = "absolute";
  cross.style.width = "20px";
  cross.style.height = "20px";
  cross.style.left = `${sx - 10}px`; // Centering the cross
  cross.style.top = `${sy - 10}px`;
  cross.style.borderRadius = "50%";
  cross.style.border = `2px solid red`;
  cross.style.display = "flex";
  cross.style.alignItems = "center";
  cross.style.justifyContent = "center";
  cross.style.zIndex = "9000";


  // Create 'X' inside the circle
  let crossLine1 = document.createElement("div");
  let crossLine2 = document.createElement("div");
  [crossLine1, crossLine2].forEach(line => {
    line.style.position = "absolute";
    line.style.width = "16px";
    line.style.height = "2px";
    line.style.backgroundColor = "red";
  });
  crossLine1.style.transform = "rotate(45deg)";
  crossLine2.style.transform = "rotate(-45deg)";

  cross.appendChild(crossLine1);
  cross.appendChild(crossLine2);
  document.body.appendChild(cross);

  return { line, cross };
}



// goat move
export function calculateGoatMove(selectedDiv,game_section,turn) {
    let selectedIndex = game_section.indexOf(selectedDiv);
    let selectedSheep = game_section[selectedIndex];

    if (!movementMap[selectedIndex]) return;

    movementMap[selectedIndex].forEach((targetIndex) => {
        let targetDiv = game_section[targetIndex];
        if (!targetDiv.querySelector(".icon_wrapper.sheeps") && !targetDiv.querySelector(".icon_wrapper.tiger")) {
            let activeLine = drawLineBetweenDivs(selectedSheep, targetDiv);
            makeAMove(targetDiv, selectedSheep, activeLine,turn,game_section);
        }
    });
}

// lion move


function makeAMove(boxClicked, previousBox, line,turn,game_section) {
  let greenDot = greenDotFunction()
  boxClicked.appendChild(greenDot);
  // boxClicked.style.backgroundColor = "#8ae78c";
  activeDots.push(greenDot)
  activeCross.push()
  // console.log(activeDots)

  greenDot.addEventListener("click", function(event) {
    let childElement = previousBox.querySelector(".icon_wrapper") || event.target.closest(".icon_wrapper");
    if (childElement) {
      previousBox.removeChild(childElement);
      boxClicked.appendChild(childElement);
      boxClicked.removeChild(greenDot)
      boxClicked.firstChild.style.backgroundColor = `rgba(77, 81, 82, 0.8)`
      turn === "SHEEPS"?(turn = 'TIGER'):(turn='SHEEPS')
      playerTurn(turn,game_section)


    }


    // remove all cross
    activeCross.forEach((cross)=> cross.remove())
    activeCross = []

    // Remove all active lines
    activeLines.forEach((ln) => ln.remove());
    activeLines = []; // Clear the array after removing lines
    // remove all dots
    activeDots.forEach((dot)=> dot.remove())
    activeDots = []

  }, { once: true });

  // Store the newly drawn line
  if (line) activeLines.push(line);
}


function greenDotFunction(){
  let greenDot = document.createElement("div");
   greenDot.classList.add("green_dot")
   greenDot.style.width = "30px"; // Adjust size
   greenDot.style.height = "30px";
   greenDot.style.borderRadius = "50%"; // Make it circular
   greenDot.style.backgroundColor = "green";
   greenDot.style.position = "absolute";
   greenDot.style.top = "50%";
   greenDot.style.left = "50%";
   greenDot.style.zIndex = "5000";
   greenDot.style.transform = "translate(-50%, -50%)"; // Center the dot
   return greenDot;
}

// lions move

export function calculateTigerMove(selectedDiv,game_section,turn) {
//filter out the
let selectedIndex = game_section.indexOf(selectedDiv);
let selectedTiger = game_section[selectedIndex];
// let weak_point_sheep = vulnerable_point.map((item_idx) => game_section[item_idx]).filter((element) => element.querySelector(".icon_wrapper.sheeps"));



if (game_section[9].querySelector(".icon_wrapper.tiger")) {
    // if 8 contains the sheep & 5 is empty
    if (game_section[8].querySelector(".icon_wrapper.sheeps") && !game_section[5].querySelector(".icon_wrapper.sheeps")) {
        let activeLine = drawLineForCuttingSheep(selectedDiv, game_section[8], game_section[5]);
        makeAMoveEliminate(game_section[5], selectedDiv, activeLine, game_section[8],game_section,turn);

    }
    // if 7 contains the sheep & 4 is empty
    if (game_section[7].querySelector(".icon_wrapper.sheeps") && !game_section[4].querySelector(".icon_wrapper.sheeps")) {
        let activeLine = drawLineForCuttingSheep(selectedDiv, game_section[7], game_section[4]);
        makeAMoveEliminate(game_section[4], selectedDiv, activeLine, game_section[7],game_section,turn);
    }
}

if (game_section[7].querySelector(".icon_wrapper.tiger")) {
    // if 6 contains the sheep & 8 is empty
    if (game_section[6].querySelector(".icon_wrapper.sheeps") && !game_section[8].querySelector(".icon_wrapper.sheeps")) {
        let activeLine = drawLineForCuttingSheep(selectedDiv, game_section[6], game_section[8]);
        makeAMoveEliminate(game_section[8], selectedDiv, activeLine, game_section[6],game_section,turn);
    }
}

if (game_section[8].querySelector(".icon_wrapper.tiger")) {
    // if 5 contains the sheep & 7 is empty
    if (game_section[6].querySelector(".icon_wrapper.sheeps") && !game_section[7].querySelector(".icon_wrapper.sheeps")) {
        let activeLine = drawLineForCuttingSheep(selectedDiv, game_section[6], game_section[7]);
        makeAMoveEliminate(game_section[7], selectedDiv, activeLine, game_section[8],game_section,turn);
    }
}

if (game_section[4].querySelector(".icon_wrapper.tiger")) {
    // if 3 contains the sheep & 5 is empty
    if (game_section[3].querySelector(".icon_wrapper.sheeps") && !game_section[5].querySelector(".icon_wrapper.sheeps")) {
        let activeLine = drawLineForCuttingSheep(selectedDiv, game_section[3], game_section[5]);
        makeAMoveEliminate(game_section[5], selectedDiv, activeLine, game_section[3],game_section,turn);
    }
}

if (game_section[5].querySelector(".icon_wrapper.tiger")) {
    // if 3 contains the sheep & 4 is empty
    if (game_section[3].querySelector(".icon_wrapper.sheeps") && !game_section[4].querySelector(".icon_wrapper.sheeps")) {
        let activeLine = drawLineForCuttingSheep(selectedDiv, game_section[3], game_section[4]);
        makeAMoveEliminate(game_section[4], selectedDiv, activeLine, game_section[3],game_section,turn);
    }
}

    // if (!movementMap[selectedIndex]) return;
    movementMap[selectedIndex].forEach((targetIndex) => {
      let targetDiv = game_section[targetIndex];
      if (!targetDiv.querySelector(".icon_wrapper.sheeps")) {
          let activeLine = drawLineBetweenDivs(selectedTiger, targetDiv);
          makeAMove(targetDiv, selectedTiger, activeLine,turn,game_section)

      }
    });
}


function makeAMoveEliminate(boxClicked, previousBox, line,sheep_found,game_section,turn) {

  let greenDot = greenDotFunction()

  // remove all cross
  activeCross.push(line.cross)

  boxClicked.appendChild(greenDot);
  // boxClicked.style.backgroundColor = "#8ae78c";
  activeDots.push(greenDot)
  // console.log(activeDots)

  greenDot.addEventListener("click", function(event) {
    let childElement = previousBox.querySelector(".icon_wrapper") || event.target.closest(".icon_wrapper");
    if (childElement) {
      previousBox.removeChild(childElement);
      boxClicked.appendChild(childElement);
      boxClicked.removeChild(greenDot)
      sheep_found.firstChild.remove()
      turn === "SHEEPS"?(turn = 'TIGER'):(turn='SHEEPS')
      boxClicked.firstChild.style.backgroundColor = `rgba(77, 81, 82, 0.8)`
      playerTurn(turn,game_section)

    }

    // removing all cross
    activeCross.forEach((cross)=> cross.remove())
    activeCross = []
    // Remove all active lines
    activeLines.forEach((ln) => ln.remove());
    activeLines = []; // Clear the array after removing lines
    // remove all dots
    console.log(activeDots)
    activeDots.forEach((dot)=> dot.remove())
    activeDots = [];

  }, { once: true });

  // Store the newly drawn line
  if (line.line) activeLines.push(line.line);
}
