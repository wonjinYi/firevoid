import { getRandInt, pickRandOne } from "./random.js";

export default function createFire(GAMEBOARD_INIT_SIZE, gameboard, fire) {
  const w = GAMEBOARD_INIT_SIZE.width;
  const h = GAMEBOARD_INIT_SIZE.height;

  const from = pickRandOne(["left", "right"]);

  const coord = { x: 0, y: 0 };
  let isExist = true;
  coord.x = from === "left" ? 0 : w - 1;
  while (isExist) {
    coord.y = getRandInt(0, h - 1);
    gameboard[coord.y][coord.x].classList.length == 0 && (isExist = false);
  }

  fire[from].push(coord);
}
