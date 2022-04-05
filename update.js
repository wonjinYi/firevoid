const collisionSFX = new Audio();
collisionSFX.src = "./sound/mixkit-arcade-video-game-explosion-2810.wav";

function updateGameInfo(gameinfo, $gameinfoBoard) {
  $gameinfoBoard.stage.textContent = gameinfo.stage;
  $gameinfoBoard.life.textContent = `${gameinfo.life}  ${"❤️".repeat(
    gameinfo.life
  )}`;
  $gameinfoBoard.score.textContent = gameinfo.score;
}

function updateFireCoord(
  GAMEBOARD_INIT_SIZE,
  personCoord,
  gameboard,
  fire,
  gameinfo,
  $modal
) {
  const w = GAMEBOARD_INIT_SIZE.width;
  const h = GAMEBOARD_INIT_SIZE.height;
  const lx = personCoord[0].x; // left Person X
  const ly = personCoord[0].y; // left Person Y
  const rx = personCoord[1].x; // right Person X
  const ry = personCoord[1].y; // right Person Y

  // remove outdated fire on gameboard
  fire.left.forEach(({ x, y }) => {
    gameboard[y][x].classList.remove("fire-from-left");
  });
  fire.right.forEach(({ x, y }) => {
    gameboard[y][x].classList.remove("fire-from-right");
  });

  // updatde coords.
  fire.left.forEach((el) => el.x++);
  fire.right.forEach((el) => el.x--);

  // remove fire object that is outside the gameboard
  fire.left.forEach(({ x, y }, index) => {
    if (x >= w) {
      fire.left.splice(index, 1);
      gameinfo.score++;
    }
  });
  fire.right.forEach(({ x, y }, index) => {
    if (x < 0) {
      fire.right.splice(index, 1);
      gameinfo.score++;
    }
  });

  // remove fire object that is collided with a person.
  fire.left.forEach(({ x, y }, index) => {
    if ((x == lx && y == ly) || (x == rx && y == ry)) {
      fire.left.splice(index, 1);
      gameinfo.life--;
      $modal.container.classList.add("show");
      $modal.background.classList.add("show");
      $modal.background.classList.add("collide-from-left");
      collisionSFX.currentTime = 0;
      collisionSFX.play();
      setTimeout(() => {
        $modal.container.classList.remove("show");
        $modal.background.classList.remove("show");
        $modal.background.classList.remove("collide-from-left");
      }, 100);
    }
  });
  fire.right.forEach(({ x, y }, index) => {
    if ((x == lx && y == ly) || (x == rx && y == ry)) {
      fire.right.splice(index, 1);
      gameinfo.life--;
      $modal.container.classList.add("show");
      $modal.background.classList.add("show");
      $modal.background.classList.add("collide-from-right");
      collisionSFX.currentTime = 0;
      collisionSFX.play();
      setTimeout(() => {
        $modal.container.classList.remove("show");
        $modal.background.classList.remove("show");
        $modal.background.classList.remove("collide-from-right");
      }, 100);
    }
  });

  // create fire on gameboard visually
  fire.left.forEach(({ x, y }) => {
    gameboard[y][x].classList.add("fire-from-left");
  });
  fire.right.forEach(({ x, y }) => {
    gameboard[y][x].classList.add("fire-from-right");
  });
}

export { updateGameInfo, updateFireCoord };
