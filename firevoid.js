// import
import init from "./init.js";
import { getRandInt, pickRandOne } from "./random.js";
import { updateFireCoord, updateGameInfo } from "./update.js";

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
const $modal = {
  background: document.getElementById("background"),
};
const $gameinfoBoard = {
  life: document.getElementById("gameinfo-life"),
  score: document.getElementById("gameinfo-score"),
};

const gameboard = [];
const personCoord = [];
const fire = {
  left: [], // from left to right ---->
  right: [], // from right to left  <----
};
const gameinfo = {
  life: 5,
  score: 0,
};
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

function createFire(GAMEBOARD_INIT_SIZE, gameboard, fire) {
  const w = GAMEBOARD_INIT_SIZE.width;
  const h = GAMEBOARD_INIT_SIZE.height;

  const from = pickRandOne(["left", "right"]);

  const coord = { x: 0, y: 0 };
  let isExist = true;
  coord.x = from === "left" ? 0 : w - 1;
  while (isExist) {
    coord.y = getRandInt(0, h - 1);
    console.log(coord.x, coord.y, h);
    gameboard[coord.y][coord.x].classList.length == 0 && (isExist = false);
  }

  fire[from].push(coord);
}

init(GAMEBOARD_INIT_SIZE, PERSON_INIT_COORD, gameboard, personCoord);
window.onkeydown = handleKeydown;

const updateLoop = setInterval(() => {
  updateFireCoord(GAMEBOARD_INIT_SIZE, personCoord, gameboard, fire, gameinfo);
  updateGameInfo(gameinfo, $gameinfoBoard);
}, 100);

const createLoop = setInterval(() => {
  createFire(GAMEBOARD_INIT_SIZE, gameboard, fire);
}, 700);

const checkLoop = setInterval(() => {
  // gameover
  if (gameinfo.life <= 0) {
    clearInterval(updateLoop);
    clearInterval(createLoop);
    clearInterval(checkLoop);
    alert("gameover. do refresh to restart.");
  }

  // next stage
}, 100);
