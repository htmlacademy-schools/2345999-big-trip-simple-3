const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

function createElement(template) {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
}

async function render(component, container, place = RenderPosition.BEFOREEND) {
  await container.insertAdjacentElement(place, component.element);
}

export {RenderPosition, createElement, render};
