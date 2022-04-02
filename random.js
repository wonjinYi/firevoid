function getRandInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandOne(arr) {
  return arr[getRandInt(0, arr.length - 1)];
}

export { getRandInt, pickRandOne };
