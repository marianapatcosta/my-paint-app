import { shapes } from '../constants';

export const findSelectedElement = (event, thisContext) => {
  thisContext.setInitialMouseCoordinates(event);
  const currentStackItems =
    thisContext.stackHistory[thisContext.stackHistory.length - 1];
  const selectedElementIndex = currentStackItems.findIndex(element => {
    switch (element.selectedShape) {
      case shapes.CIRCLE:
        return isACircleSelected(element, thisContext);
      case shapes.ELLIPSE:
        return isACircleSelected(element, thisContext);
      case shapes.RECTANGLE:
        return isARectangleSelected(element, thisContext);
      case shapes.IMAGE:
        return isARectangleSelected(element, thisContext);
      case shapes.LINE:
        return isALineSelected(element, thisContext);
      case shapes.TRIANGLE:
        return isATriangleSelected(element, thisContext);
      default:
        return;
    }
  });
  thisContext.selectedElementIndex =
    selectedElementIndex !== -1 ? selectedElementIndex : null;
};

const isACircleSelected = (configs, thisContext) => {
  const radius = getDistance(
    configs.initialMouseX,
    configs.initialMouseY,
    configs.mouseX,
    configs.mouseY
  );
  return (
    getDistance(
      thisContext.initialMouseX,
      thisContext.initialMouseY,
      configs.initialMouseX,
      configs.initialMouseY
    ) <= radius
  );
};

const isARectangleSelected = (configs, thisContext) => {
  const width = Math.abs(configs.mouseX - configs.initialMouseX);
  const height = Math.abs(configs.mouseY - configs.initialMouseY);
  const top =
    configs.mouseY < configs.initialMouseY
      ? configs.mouseY
      : configs.initialMouseY;
  const left =
    configs.mouseX < configs.initialMouseX
      ? configs.mouseX
      : configs.initialMouseX;
  return (
    thisContext.initialMouseY >= top &&
    thisContext.initialMouseY <= top + height &&
    thisContext.initialMouseX >= left &&
    thisContext.initialMouseX <= left + width
  );
};

const isALineSelected = (configs, thisContext) =>
  (thisContext.initialMouseX - configs.initialMouseX) /
    (configs.mouseX - configs.initialMouseX) ===
  (thisContext.initialMouseY - configs.initialMouseY) /
    (configs.mouseY - configs.initialMouseY);

const isATriangleSelected = (configs, thisContext) => {
  const triangleLength = Math.abs(configs.initialMouseX - configs.mouseX);
  const x3 = triangleLength / 2 + configs.initialMouseX;
  const height = (triangleLength * Math.sqrt(3, 2)) / 2;
  const y3 = configs.initialMouseY - height;
  const totalArea = getTriangleArea(
    configs.initialMouseX,
    configs.initialMouseY,
    configs.mouseX,
    configs.initialMouseY,
    x3,
    y3
  );
  const area1 = getTriangleArea(
    thisContext.initialMouseX,
    thisContext.initialMouseY,
    configs.initialMouseX,
    configs.initialMouseY,
    x3,
    y3
  );
  const area2 = getTriangleArea(
    thisContext.initialMouseX,
    thisContext.initialMouseY,
    configs.mouseX,
    configs.initialMouseY,
    x3,
    y3
  );
  const area3 = getTriangleArea(
    thisContext.initialMouseX,
    thisContext.initialMouseY,
    configs.initialMouseX,
    configs.initialMouseY,
    configs.mouseX,
    configs.initialMouseY
  );
  return area1 + area2 + area3 <= totalArea;
};

const getTriangleArea = (x1, y1, x2, y2, x3, y3) => {
  return (x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3);
};

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
