function addClassList({ elements, className }) {
  elements.forEach((el) => {
    el.classList.add(className);
  });
}
function removeClassList({ elements, className }) {
  elements.forEach((el) => {
    el.classList.remove(className);
  });
}

function ToggleClassList({ elements, className }) {
  elements.forEach((el) => {
    el.classList.toggle(className);
  });
}

export { addClassList, removeClassList, ToggleClassList };
