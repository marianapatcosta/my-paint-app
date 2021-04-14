import { radian, defaultTextOptions } from '../constants';

export const freeDraw = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  canvasContext.moveTo(settings.mouseX, settings.mouseY);
  thisContext.setMouseCoordinates(event);
  canvasContext.lineTo(settings.mouseX, settings.mouseY);
  canvasContext.stroke();
};

export const drawLine = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  canvasContext.moveTo(settings.initialMouseX, settings.initialMouseY);
  canvasContext.lineTo(settings.mouseX, settings.mouseY);
  canvasContext.stroke();
};

export const drawRectangle = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  const width = settings.mouseX - settings.initialMouseX;
  const height = settings.mouseY - settings.initialMouseY;
  canvasContext.moveTo(settings.initialMouseX, settings.initialMouseY);
  if (configs && configs.rotation) {
    canvasContext.save();
    canvasContext.translate(settings.initialMouseX, settings.initialMouseY);
    canvasContext.translate(width / 2, height / 2);
    canvasContext.rotate(configs.rotation * radian);
    canvasContext.rect(-width / 2, -height / 2, width, height);
    drawShapeInCanvas(canvasContext, thisContext, settings.hasFill);
    return canvasContext.restore();
  }
  canvasContext.rect(
    settings.initialMouseX,
    settings.initialMouseY,
    width,
    height
  );
  drawShapeInCanvas(canvasContext, thisContext, settings.hasFill);
};

export const drawImage = (canvasContext, thisContext, configs) => {
  if (!thisContext.uploadedImages.length) return;
  const settings = configs ? configs : thisContext;
  const width = settings.mouseX - settings.initialMouseX;
  const height = settings.mouseY - settings.initialMouseY;
  const image = new Image();
  image.src = configs
    ? thisContext.uploadedImages[settings.uploadedImageIndex]
    : thisContext.uploadedImages[thisContext.uploadedImages.length - 1];
  canvasContext.moveTo(settings.initialMouseX, settings.initialMouseY);
  image.onload = () => {
    if (configs && configs.rotation) {
      canvasContext.save();
      canvasContext.translate(settings.initialMouseX, settings.initialMouseY);
      canvasContext.translate(width / 2, height / 2);
      canvasContext.rotate(configs.rotation * radian);
      canvasContext.drawImage(image, -width / 2, -height / 2, width, height);
      drawShapeInCanvas(canvasContext, thisContext, settings.hasFill);
      return canvasContext.restore();
    }
    canvasContext.drawImage(
      image,
      settings.initialMouseX,
      settings.initialMouseY,
      width,
      height
    );
  };
};

export const drawCircle = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  const radian = Math.PI / 180;
  const radius = getDistance(
    settings.initialMouseX,
    settings.initialMouseY,
    settings.mouseX,
    settings.mouseY
  );
  canvasContext.arc(
    settings.initialMouseX,
    settings.initialMouseY,
    radius,
    0 * radian,
    360 * radian
  );
  drawShapeInCanvas(canvasContext, thisContext, settings.hasFill);
};

export const drawEllipse = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  canvasContext.moveTo(
    settings.initialMouseX,
    settings.initialMouseY + (settings.mouseY - settings.initialMouseY) / 2
  );
  canvasContext.bezierCurveTo(
    settings.initialMouseX,
    settings.initialMouseY,
    settings.mouseX,
    settings.initialMouseY,
    settings.mouseX,
    settings.initialMouseY + (settings.mouseY - settings.initialMouseY) / 2
  );
  canvasContext.bezierCurveTo(
    settings.mouseX,
    settings.mouseY,
    settings.initialMouseX,
    settings.mouseY,
    settings.initialMouseX,
    settings.initialMouseY + (settings.mouseY - settings.initialMouseY) / 2
  );
  canvasContext.closePath();
  drawShapeInCanvas(canvasContext, thisContext, settings.hasFill);
};

export const drawText = (canvasText, thisContext, configs) => {
  const text = configs ? configs.canvasText : canvasText;
  if (!text) return;
  const settings = configs ? configs : thisContext;
  const { fontFamily, fontSize, isItalic, isBold } = settings.textOptions;
  thisContext.context.fillStyle = settings.selectedFillColor;
  thisContext.context.strokeStyle = settings.selectedStrokeColor;
  thisContext.context.font = `${isItalic ? 'italic' : 'normal'} ${
    isBold ? 700 : 400
  } ${fontSize} ${fontFamily}`;
  settings.hasFill
    ? thisContext.context.fillText(
        text,
        settings.initialMouseX,
        settings.initialMouseY
      )
    : thisContext.context.strokeText(
        text,
        settings.initialMouseX,
        settings.initialMouseY
      );

  !configs && thisContext.saveConfigsInStack(canvasText);
  thisContext.textOptions = defaultTextOptions;
  thisContext.isDrawing = false;
  thisContext.showTextOptions = false;
};

export const drawTriangle = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  canvasContext.moveTo(settings.initialMouseX, settings.initialMouseY);
  // size of a triangle size
  const triangleLength = Math.abs(settings.initialMouseX - settings.mouseX);

  // x3 is the point in the middle of the base line of equilateral triangle
  const x3 = triangleLength / 2 + settings.initialMouseX;

  // height = length * Math.cos(30) <=> length * Math.cos(Math.PI / 6)
  // const height = triangleLength * Math.cos(Math.PI / 6);
  const height = (triangleLength * Math.sqrt(3, 2)) / 2;
  canvasContext.lineTo(settings.mouseX, settings.initialMouseY);
  canvasContext.lineTo(x3, settings.initialMouseY - height);
  canvasContext.closePath();
  drawShapeInCanvas(canvasContext, thisContext, settings.hasFill);
};

export const erase = (canvasContext, thisContext, configs) => {
  const settings = configs ? configs : thisContext;
  canvasContext.moveTo(settings.mouseX, settings.mouseY);
  thisContext.setMouseCoordinates(event);
  canvasContext.clearRect(
    settings.mouseX,
    settings.mouseY,
    settings.selectedThickness,
    settings.selectedThickness
  );
};

const drawShapeInCanvas = (context, thisContext, hasFill) => {
  if (thisContext.isPreview) return context.stroke();
  context.stroke();
  hasFill && context.fill();
};

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
};
