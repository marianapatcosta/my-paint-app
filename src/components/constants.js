export const baseColors = [
  '#000000',
  '#6C757D',
  '#FFFFFF',
  '#B21F35',
  '#D82735',
  '#FF7435',
  '#FFA135',
  '#FFCB35',
  '#FFF735',
  '#00753A',
  '#009E47',
  '#16DD36',
  '#0052A5',
  '#0079E7',
  '#06A9FC',
  '#681E7E',
  '#7D3CB5',
  '#BD7AF6',
  '#DE216D',
  '#EC88A9'
];

export const thickness = [2, 3, 4, 5, 10];

export const drawTypes = {
  FILL: 'fill',
  STROKE: 'stroke'
};

export const shapes = {
  FREE: 'free',
  LINE: 'line',
  RECTANGLE: 'rectangle',
  CIRCLE: 'circle',
  ELLIPSE: 'ellipse',
  TRIANGLE: 'triangle',
  ERASER: 'eraser',
  TEXT: 'text',
  IMAGE: 'image'
};

export const fontFamilies = [
  'arial',
  'comic sans',
  'fantasy',
  'monospace',
  'raleway',
  'times'
];

export const fontSizes = [
  '8px',
  '10px',
  '12px',
  '14px',
  '16px',
  '22px',
  '32px'
];

export const defaultTextOptions = {
  fontFamily: fontFamilies[0],
  fontSize: fontSizes[1],
  isItalic: false,
  isBold: false
};

export const operations = {
  RESIZE: 'resize',
  SAVE: 'save',
  RESET: 'reset',
  UNDO: 'undo',
  REDO: 'redo'
  /* rotate: 'rotate', */
};
