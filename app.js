// import
import init from "./init.js";
import { updateFireCoord, updateGameInfo } from "./update.js";
import createFire from "./createFire.js";

// Predifined Constants
const INIT_VALUE = {
  gameboardSize: {
    width: 30,
    height: 3,
  },
  personCoord: [
    {
      x: 9, // 10th
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
      initial: 1000, // initail speed
      //increaseRatio: 0.95, // Number to be multiplied by speed per stage
      current: 1000,
    },
    move: {
      initial: 100,
      //increaseRatio: 0.95,
      current: 100,
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

const VARS = {
  gameboardSize,
  gameboard,
  personCoord,
  gamespeed,
  fire,
  gameinfo,
  loopArr,
};

// elements
const $modal = {
  container: document.getElementById("modal"),
  background: document.getElementById("background"),
  gamestart: document.getElementById("modal-gamestart"),
  pause: document.getElementById("modal-pause"),
  gameover: document.getElementById("modal-gameover"),
  gameoverScore: document.getElementById("gameover-score"),
  gameoverRestartBtn: document.getElementById("gameover-restart-btn"),
};
const $touchkey = {
  F: document.getElementById("touchkey-f"),
  V: document.getElementById("touchkey-v"),
  J: document.getElementById("touchkey-j"),
  N: document.getElementById("touchkey-n"),
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
  }
}

function activateLoop() {
  window.onkeydown = handleKeydown;
  window.onclick = handleTouchkeyDown;

  const updateLoop = setInterval(() => {
    updateFireCoord(gameboardSize, personCoord, gameboard, fire, gameinfo);
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
        $modal.container.classList.add("show");
        $modal.background.classList.add("show");
        $modal.gameover.classList.add("show");
        $modal.gameoverScore.textContent = gameinfo.score;
        $modal.gameoverRestartBtn.onclick = () => {
          window.onclick = null;
          window.onkeydown = null;
          $modal.gameover.classList.remove("show");

          $modal.background.classList.add("show");
          $modal.gamestart.classList.add("show");
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
          window.onmousedown = () => {
            window.onmousedown = null;
            window.onkeydown = null;
            $modal.container.classList.remove("show");
            $modal.background.classList.remove("show");
            $modal.gamestart.classList.remove("show");
            activateLoop();
          };
          window.onkeydown = () => {
            window.onmousedown = null;
            window.onkeydown = null;
            $modal.container.classList.remove("show");
            $modal.background.classList.remove("show");
            $modal.gamestart.classList.remove("show");
            activateLoop();
          };
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

      // const move = gamespeed.move;
      // move.current = parseInt(move.current * move.increaseRatio);
      const create = gamespeed.create;
      create.current > 400 && (create.current -= 50);

      deactivateLoop();
      activateLoop();
    } else if (gameinfo.score % 10 != 0) {
      gamespeed.stageupFlag = true;
    }
  }, 100);

  loopArr.push(updateLoop);
  loopArr.push(createLoop);
  loopArr.push(checkLoop);
}

function deactivateLoop() {
  window.onkeydown = null;
  window.onclick = null;
  loopArr.forEach((loop) => clearInterval(loop));
  loopArr = [];
}

function pauseLoop() {
  deactivateLoop(loopArr);
  $modal.container.classList.add("show");
  $modal.background.classList.add("show");
  $modal.pause.classList.add("show");

  window.onmousedown = () => {
    window.onmousedown = null;
    window.onkeydown = null;
    $modal.container.classList.remove("show");
    $modal.background.classList.remove("show");
    $modal.pause.classList.remove("show");
    activateLoop();
  };

  window.onkeydown = () => {
    window.onmousedown = null;
    window.onkeydown = null;
    $modal.container.classList.remove("show");
    $modal.background.classList.remove("show");
    $modal.pause.classList.remove("show");

    activateLoop();
  };
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

window.onmousedown = () => {
  window.onmousedown = null;
  window.onkeydown = null;
  $modal.container.classList.remove("show");
  $modal.background.classList.remove("show");
  $modal.gamestart.classList.remove("show");
  activateLoop();
};
window.onkeydown = () => {
  window.onmousedown = null;
  window.onkeydown = null;
  $modal.container.classList.remove("show");
  $modal.background.classList.remove("show");
  $modal.gamestart.classList.remove("show");
  activateLoop();
};
