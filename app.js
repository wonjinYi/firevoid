// import
import init from "./init.js";
import { updateFireCoord, updateGameInfo } from "./update.js";
import createFire from "./createFire.js";
import { addClassList, removeClassList } from "./classListManager.js";

// Predifined Constants
const INIT_VALUE = {
  gameboardSize: {
    width: 30,
    height: 3,
  },
  personCoord: [
    {
      x: 10, // 10th
      y: 1, // 2nd
    },
    {
      x: 19, // 20th
      y: 1, // 2nd
    },
  ],
  gameinfo: {
    stage: 0,
    life: 5,
    score: 0,
  },
  fire: {
    lefe: [],
    right: [],
  },
  gamespeed: {
    stageupFlag: true,
    stageInterval: 10,
    create: {
      initial: 1200, // initail speed (ms)
      subtractPerStage: 70, // The number subtracted from the speed per stage (ms)
      current: 1200, // current speed (ms)
      lowest: 430,
    },
    move: {
      initial: 200,
      subtractPerStage: 12,
      current: 200,
      lowest: 80,
    },
  },
};

// variables
let gameboardSize = {};
let gameboard = [];
let personCoord = [];
let gamespeed = {};
let fire = {};
let gameinfo = {};
let loopArr = [];
let isPaused = false;

let sfx = {
  stageup: new Audio(),
  gameover: new Audio(),
};
sfx.stageup.src = "./sound/mixkit-winning-chimes-2015.wav";
sfx.gameover.src = "./sound/mixkit-arcade-fast-game-over-233.wav";

// elements
const $modal = {
  container: document.getElementById("modal"),
  background: document.getElementById("background"),
  gamestart: document.getElementById("modal-gamestart"),
  pause: document.getElementById("modal-pause"),
  pauseBackToTitleBtn: document.getElementById("modal-pause-backtotitle-btn"),
  gameover: document.getElementById("modal-gameover"),
  gameoverScore: document.getElementById("gameover-score"),
  gameoverRestartBtn: document.getElementById("gameover-restart-btn"),
};
const $gameinfoBoard = {
  stage: document.getElementById("gameinfo-stage"),
  life: document.getElementById("gameinfo-life"),
  score: document.getElementById("gameinfo-score"),
};

//////////////////////////////////////////

function handleKeydown(e) {
  personCoord.forEach(({ x, y }) => {
    gameboard[y][x].classList.remove("person");
    gameboard[y][x].textContent = "";
  });

  if ((e.key === "f" || e.key === "F") && personCoord[0].y != 0)
    personCoord[0].y--;
  else if ((e.key === "v" || e.key === "V") && personCoord[0].y != 2)
    personCoord[0].y++;
  else if ((e.key === "j" || e.key === "J") && personCoord[1].y != 0)
    personCoord[1].y--;
  else if ((e.key === "n" || e.key === "N") && personCoord[1].y != 2)
    personCoord[1].y++;
  else if (e.key === "Escape" || e.key === "P" || e.key === "p") pauseLoop();

  personCoord.forEach(({ x, y }) => {
    gameboard[y][x].classList.add("person");
  });
}

function handleTouchkeyDown(e) {
  const rawKey = e.target.textContent;
  if (rawKey == "J" || rawKey == "N" || rawKey == "F" || rawKey == "V") {
    const key = rawKey.toLowerCase();
    handleKeydown({ key });
  } else if (rawKey === "PAUSE (ESC/P)") {
    handleKeydown({ key: "P" });
  }
}

function activateLoop() {
  window.onkeydown = handleKeydown;
  window.onmousedown = handleTouchkeyDown;
  window.ontouchstart = handleTouchkeyDown;

  const updateLoop = setInterval(() => {
    updateFireCoord(
      gameboardSize,
      personCoord,
      gameboard,
      fire,
      gameinfo,
      $modal
    );
    updateGameInfo(gameinfo, $gameinfoBoard);
  }, gamespeed.move.current);

  const createLoop = setInterval(() => {
    createFire(gameboardSize, gameboard, fire);
  }, gamespeed.create.current);

  const checkLoop = setInterval(() => {
    // gameover
    if (gameinfo.life <= 0) {
      deactivateLoop();
      setTimeout(() => {
        addClassList({
          elements: [$modal.container, $modal.background, $modal.gameover],
          className: "show",
        });
        $modal.gameoverScore.textContent = gameinfo.score;
        sfx.gameover.play();
        $modal.gameoverRestartBtn.onclick = () => {
          window.onmousedown = null;
          window.ontouchstart = null;
          window.onkeydown = null;
          removeClassList({ elements: [$modal.gameover], className: "show" });
          addClassList({
            elements: [$modal.background, $modal.gamestart],
            className: "show",
          });
          init(
            INIT_VALUE,
            gameboardSize,
            gameboard,
            personCoord,
            gamespeed,
            fire,
            gameinfo,
            loopArr
          );

          function restartGame() {
            window.onmousedown = null;
            window.onkeydown = null;
            removeClassList({
              elements: [$modal.container, $modal.background, $modal.gamestart],
              className: "show",
            });
            activateLoop();
          }
          window.onmousedown = restartGame;
          window.ontouchstart = restartGame;
          window.onkeydown = restartGame;
        };
      }, 1000);
    }

    // next stage
    if (
      gameinfo.score % gamespeed.stageInterval == 0 &&
      gamespeed.stageupFlag
    ) {
      gamespeed.stageupFlag = false;
      gameinfo.stage++;

      const move = gamespeed.move;
      move.current >= move.lowest &&
        (move.current = move.initial - move.subtractPerStage * gameinfo.stage);
      const create = gamespeed.create;
      create.current >= create.lowest &&
        (create.current =
          create.initial - create.subtractPerStage * gameinfo.stage);
      console.log(gameinfo.stage, move.current, create.current);

      deactivateLoop();
      addClassList({ elements: [$gameinfoBoard.stage], className: "stageup" });
      window.onkeydown = handleKeydown;
      window.onmousedown = handleTouchkeyDown;
      window.ontouchstart = handleTouchkeyDown;

      sfx.stageup.play();
      setTimeout(() => {
        removeClassList({
          elements: [$gameinfoBoard.stage],
          className: "stageup",
        });
        !isPaused && activateLoop();
      }, 1000);
    } else if (gameinfo.score % gamespeed.stageInterval != 0) {
      gamespeed.stageupFlag = true;
    }
  }, 100);

  loopArr.push(updateLoop);
  loopArr.push(createLoop);
  loopArr.push(checkLoop);
}

function deactivateLoop() {
  window.onkeydown = null;
  window.onmousedown = null;
  window.ontouchstart = null;
  loopArr.forEach((loop) => clearInterval(loop));
  loopArr = [];
}

function pauseLoop() {
  isPaused = true;
  deactivateLoop(loopArr);
  addClassList({
    elements: [$modal.container, $modal.background, $modal.pause],
    className: "show",
  });

  function continueGame() {
    isPaused = false;
    window.onmousedown = null;
    window.ontouchstart = null;
    window.onkeydown = null;
    removeClassList({
      elements: [$modal.container, $modal.background, $modal.pause],
      className: "show",
    });
    activateLoop();
  }
  window.onmousedown = (e) => {
    if (e.target != $modal.pauseBackToTitleBtn) continueGame();
  };
  window.ontouchstart = (e) => {
    if (e.target != $modal.pauseBackToTitleBtn) continueGame();
  };
  window.onkeydown = continueGame;
}

/////////////////////////////////////////////////

init(
  INIT_VALUE,
  gameboardSize,
  gameboard,
  personCoord,
  gamespeed,
  fire,
  gameinfo,
  loopArr
);

function startGame() {
  window.onclick = null;
  window.ontouchstart = null;
  window.onkeydown = null;

  removeClassList({
    elements: [$modal.container, $modal.background, $modal.gamestart],
    className: "show",
  });
  activateLoop();
}
window.onmousedown = startGame;
window.ontouchstart = startGame;
window.onkeydown = startGame;
