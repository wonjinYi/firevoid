export default function init(
  GAMEBOARD_INIT_SIZE,
  PERSON_INIT_COORD,
  gameboard,
  personCoord
) {
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
