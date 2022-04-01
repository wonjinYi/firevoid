// import

// Predifined Constants
const GAMEBOARD_INIT_SIZE = {
  width: 30,
  height: 3,
};

const PERSON_INIT_COORD = [
  {
    x: 9, // 10th
    y: 1, // 2nd
  },
  {
    x: 19, // 20th
    y: 1, // 2nd
  },
];

// elements
const $modalBackground = document.getElementById("modal-background");

const gameboard = [];
const personCoord = [];

// functions
function init(GAMEBOARD_INIT_SIZE, PERSON_INIT_COORD) {
  // create the gameboard element
  const $gameboardElement = document.getElementById("gameboard");
  const tr = document.createElement("tr");
  for (let i = 0; i < GAMEBOARD_INIT_SIZE.width; i++)
    tr.appendChild(document.createElement("td"));
  for (let i = 0; i < GAMEBOARD_INIT_SIZE.height; i++)
    $gameboardElement.appendChild(tr.cloneNode(true));

  // save $gameboardElemen's cells to gameboard[]
  const rows = $gameboardElement.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].getElementsByTagName("td");
    gameboard.push(cols);
  }

  // create two persons
  PERSON_INIT_COORD.forEach(({ x, y }) => {
    personCoord.push({ x, y });
    gameboard[y][x].classList.add("person");
  });
}

function handleKeydown(e) {
  personCoord.forEach(({ x, y }) => {
    gameboard[y][x].classList.remove("person");
  });

  if ((e.key === "f" || e.key === "F") && personCoord[0].y != 0)
    personCoord[0].y--;
  else if ((e.key === "v" || e.key === "V") && personCoord[0].y != 2)
    personCoord[0].y++;
  else if ((e.key === "j" || e.key === "J") && personCoord[1].y != 0)
    personCoord[1].y--;
  else if ((e.key === "n" || e.key === "N") && personCoord[1].y != 2)
    personCoord[1].y++;

  personCoord.forEach(({ x, y }) => {
    gameboard[y][x].classList.add("person");
  });
}

//
init(GAMEBOARD_INIT_SIZE, PERSON_INIT_COORD);
window.onkeydown = handleKeydown;
