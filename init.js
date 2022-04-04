export default function init(
  INIT_VALUE,
  gameboardSize,
  gameboard,
  personCoord,
  gamespeed,
  fire,
  gameinfo,
  loopArr
) {
  // initilize variables
  gameboardSize.width = INIT_VALUE.gameboardSize.width;
  gameboardSize.height = INIT_VALUE.gameboardSize.height;
  gamespeed.stageupFlag = INIT_VALUE.gamespeed.stageupFlag;
  gamespeed.stageInterval = INIT_VALUE.gamespeed.stageInterval;
  gamespeed.create = JSON.parse(JSON.stringify(INIT_VALUE.gamespeed.create));
  gamespeed.move = JSON.parse(JSON.stringify(INIT_VALUE.gamespeed.move));
  fire.left = [];
  fire.right = [];
  gameinfo.stage = INIT_VALUE.gameinfo.stage;
  gameinfo.life = INIT_VALUE.gameinfo.life;
  gameinfo.score = INIT_VALUE.gameinfo.score;
  loopArr.splice(0, loopArr.length);
  gameboard.splice(0, gameboard.length);
  personCoord.splice(0, personCoord.length);

  // create the gameboard element
  const $gameboardElement = document.getElementById("gameboard");
  $gameboardElement.innerHTML = "";

  const tr = document.createElement("tr");
  for (let i = 0; i < gameboardSize.width; i++)
    tr.appendChild(document.createElement("td"));
  for (let i = 0; i < gameboardSize.height; i++)
    $gameboardElement.appendChild(tr.cloneNode(true));

  // save $gameboardElemen's cells to gameboard[]
  const rows = $gameboardElement.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cols = rows[i].getElementsByTagName("td");
    gameboard.push(cols);
  }

  // create two persons
  INIT_VALUE.personCoord.forEach(({ x, y }) => {
    personCoord.push({ x, y });
    gameboard[y][x].classList.add("person");
  });
}
