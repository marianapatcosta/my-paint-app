import {
  ColorPallete,
  Header,
  Shapes,
  TextConfigs,
  Thickness
} from './components';
import {
  baseColors,
  canvasModes,
  defaultTextOptions,
  drawTypes,
  operations,
  shapes,
  thickness
} from './constants';
import { findSelectedElement } from './utils/checkSelection';
import {
  drawCircle,
  drawEllipse,
  drawImage,
  drawLine,
  drawRectangle,
  drawText,
  drawTriangle,
  erase,
  freeDraw
} from './utils/draw';
import { isElectron, getCanvasDimensions } from './utils/utils';

export default {
  name: 'App',
  computed: {
    hasFill() {
      return this.drawType === drawTypes.FILL;
    },
    selectedColor() {
      return this.hasFill ? this.selectedFillColor : this.selectedStrokeColor;
    }
  },
  data() {
    return {
      context: null,
      contextPreview: null,
      boundings: null,
      width: 900,
      height: 620,
      mouseX: 0,
      mouseY: 0,
      initialMouseX: 0,
      initialMouseY: 0,
      isDrawing: false,
      isDragging: false,
      isResizing: false,
      isPreview: false,
      drawType: drawTypes.STROKE,
      drawTypes,
      textOptions: defaultTextOptions,
      showTextOptions: false,
      uploadedImages: [],
      previewColor: '#aaaaaa',
      selectedStrokeColor: baseColors[0],
      selectedFillColor: baseColors[0],
      selectedThickness: thickness[0],
      selectedShape: shapes.FREE,
      drawWithoutPreview: [shapes.FREE, shapes.ERASER, shapes.TEXT],
      drawShape: {
        free: freeDraw,
        rectangle: drawRectangle,
        line: drawLine,
        circle: drawCircle,
        ellipse: drawEllipse,
        triangle: drawTriangle,
        eraser: erase,
        text: drawText,
        image: drawImage
      },
      operations,
      operationMethods: {
        undo: this.onUndo,
        redo: this.onRedo,
        resize: this.onCanvasResize,
        save: this.onSave,
        reset: this.onReset,
        select: this.onSelect,
        duplicate: this.onDuplicate,
        rotate_clockwise: this.onRotateClockwise,
        rotate_counterclockwise: this.onRotateCounterclockwise
      },
      resizeCanvas: false,
      stackHistory: [],
      nrOfStackSteps: null,
      canvasMode: canvasModes.DRAW,
      selectedElementIndex: null
    };
  },
  components: {
    'app-color-pallete': ColorPallete,
    'app-header': Header,
    'app-shapes': Shapes,
    'app-text-configs': TextConfigs,
    'app-thickness': Thickness
  },
  mounted() {
    this.getCanvas();
  },
  methods: {
    getCanvas() {
      const canvas = this.$refs.canvas;
      const canvasPreview = this.$refs.canvasPreview;
      const context = canvas.getContext('2d');
      const contextPreview = canvasPreview.getContext('2d');
      this.context = context;
      this.contextPreview = contextPreview;
      this.boundings = canvas.getBoundingClientRect();
      const { width, height } = getCanvasDimensions();
      this.width = width;
      this.height = height;
    },
    clearCanvas(context) {
      context.clearRect(0, 0, this.width, this.height);
    },
    isOperationButtonDisabled(operation) {
      if (operation === operations.DUPLICATE) {
        return (
          this.canvasMode !== canvasModes.EDIT ||
          this.selectedElementIndex === null
        );
      }
      if (
        operation === operations.ROTATE_CLOCKWISE ||
        operation === operations.ROTATE_COUNTERCLOCKWISE
      ) {
        const shape = this.selectedElementIndex
          ? this.stackHistory[this.stackHistory.length - 1][
              this.selectedElementIndex
            ].selectedShape
          : '';
        return (
          this.canvasMode !== canvasModes.EDIT ||
          this.selectedElementIndex === null ||
          (shape !== shapes.RECTANGLE && shape !== shapes.IMAGE)
        );
      }
      if (operation === operations.UNDO) {
        if (!this.stackHistory.length) return true;
        if (this.nrOfStackSteps === null) return false;
        return this.nrOfStackSteps <= 0;
      }
      if (operation === operations.REDO) {
        if (!this.stackHistory.length || this.nrOfStackSteps === null)
          return true;
        return this.nrOfStackSteps >= this.stackHistory.length;
      }

      return false;
    },
    initialSetup(context) {
      this.isPreview && this.clearCanvas(this.contextPreview);
      context.beginPath();
      context.lineWidth = this.selectedThickness;
      context.strokeStyle = this.isPreview
        ? this.previewColor
        : this.selectedStrokeColor;
      context.fillStyle = this.selectedFillColor;
    },
    onMouseDown(event) {
      // eliminates undone stack, if exists, when the user clicks on canvas
      if (
        this.nrOfStackSteps &&
        this.nrOfStackSteps < this.stackHistory.length
      ) {
        this.stackHistory = this.stackHistory.slice(0, this.nrOfStackSteps);
      }
      this.nrOfStackSteps = null;
      this.setMouseCoordinates(event);
      this.setInitialMouseCoordinates(event);

      if (this.canvasMode === canvasModes.DRAW) {
        this.isDrawing = true;
        this.isPreview = !this.drawWithoutPreview.includes(this.selectedShape);
        this.showTextOptions = this.selectedShape === shapes.TEXT;
        return;
      }
      if (this.canvasMode === canvasModes.DRAG) {
        this.isDragging = true;
      }
      if (this.canvasMode === canvasModes.EDIT) {
        this.isResizing = true;
      }
      findSelectedElement(event, this);
      this.selectedElementIndex !== null &&
        this.copyAndAddLastStateToStackHistory();
    },
    onMouseMove(event) {
      switch (this.canvasMode) {
        case canvasModes.DRAW:
          return this.isPreview ? this.drawPreview(event) : this.draw(event);
        case canvasModes.DRAG:
          return this.drag(event);
        case canvasModes.EDIT:
          return this.resize(event);
        default:
          return;
      }
    },
    onMouseUp() {
      this.isDrawing = false;
      this.isPreview = false;
      this.isDragging = false;
      this.isResizing = false;

      if (this.canvasMode === canvasModes.DRAW) {
        this.saveConfigsInStack();
      }

      if (
        !this.drawWithoutPreview.includes(
          this.selectedShape && this.canvasMode === canvasModes.DRAW
        )
      ) {
        this.clearCanvas(this.contextPreview);
        this.initialSetup(this.context);
        this.selectedShape &&
          this.drawShape[this.selectedShape](this.context, this);
      }
    },
    drawText(canvasText) {
      drawText(canvasText, this);
    },
    draw() {
      if (!this.isDrawing || this.isPreview) return;
      this.initialSetup(this.context);
      if (this.selectedShape && this.selectedShape !== shapes.TEXT) {
        this.drawShape[this.selectedShape](this.context, this);
      }
    },
    drawPreview(event) {
      if (!this.isDrawing || !this.isPreview) return;
      this.setMouseCoordinates(event);
      this.initialSetup(this.contextPreview);
      this.selectedShape &&
        this.drawShape[this.selectedShape](this.contextPreview, this);
    },
    drag(event) {
      if (
        this.canvasMode !== canvasModes.DRAG ||
        !this.isDragging ||
        this.selectedElementIndex === null
      )
        return;

      this.setMouseCoordinates(event);
      const selectedElement = this.stackHistory[this.stackHistory.length - 1][
        this.selectedElementIndex
      ];
      const xDiff = Math.abs(
        selectedElement.mouseX - selectedElement.initialMouseX
      );
      const yDiff = Math.abs(
        selectedElement.mouseY - selectedElement.initialMouseY
      );

      this.updateItemState('initialMouseX', this.mouseX);
      this.updateItemState('initialMouseY', this.mouseY);
      this.updateItemState('mouseX', this.mouseX + xDiff);
      this.updateItemState('mouseY', this.mouseY + yDiff);
      this.redraw();
    },
    resize(event) {
      if (
        this.canvasMode !== canvasModes.EDIT ||
        !this.isResizing ||
        this.selectedElementIndex === null
      )
        return;
      console.log('resize', this.selectedElementIndex, this.stackHistory);
      this.setMouseCoordinates(event);
      this.updateItemState('mouseX', this.mouseX);
      this.updateItemState('mouseY', this.mouseY);
      this.redraw();
    },
    updateItemState(fieldToUpdate, newValue) {
      // changes in the current stack items (last item of stackHistory) the selected element state
      this.stackHistory[this.stackHistory.length - 1][
        this.selectedElementIndex
      ][fieldToUpdate] = newValue;
    },
    copyAndAddLastStateToStackHistory(newConfigs) {
      const itemToAdd = newConfigs
        ? [...this.stackHistory[this.stackHistory.length - 1], newConfigs]
        : this.stackHistory[this.stackHistory.length - 1];
      this.stackHistory.push([...JSON.parse(JSON.stringify(itemToAdd))]);
    },
    saveConfigsInStack(canvasText) {
      const configs = {
        initialMouseX: this.initialMouseX,
        initialMouseY: this.initialMouseY,
        mouseX: this.mouseX,
        mouseY: this.mouseY,
        selectedShape: this.selectedShape,
        selectedThickness: this.selectedThickness,
        selectedFillColor: this.selectedFillColor,
        selectedStrokeColor: this.selectedStrokeColor,
        hasFill: this.hasFill,
        rotation: 0
      };

      if (this.selectedShape === shapes.TEXT) {
        configs.textOptions = this.textOptions;
        configs.canvasText = canvasText;
      }

      if (this.selectedShape === shapes.IMAGE) {
        configs.uploadedImageIndex = this.uploadedImages.length - 1;
      }

      this.stackHistory.length
        ? this.copyAndAddLastStateToStackHistory(configs)
        : this.stackHistory.push([configs]);
    },
    redraw() {
      if (!this.stackHistory.length) return;
      this.clearCanvas(this.context);
      this.isDrawing = true;
      let currentStackItems;
      if (this.nrOfStackSteps === null) {
        currentStackItems = this.stackHistory[this.stackHistory.length - 1];
      } else if (this.nrOfStackSteps === 0) {
        currentStackItems = [];
      } else {
        currentStackItems = this.stackHistory[this.nrOfStackSteps - 1];
      }

      currentStackItems.forEach(configs => {
        this.context.beginPath();
        this.context.lineWidth = configs.selectedThickness;
        this.context.strokeStyle = configs.selectedStrokeColor;
        this.context.fillStyle = configs.selectedFillColor;
        this.drawShape[configs.selectedShape](this.context, this, configs);
      });
      this.isDrawing = false;
    },
    setMouseCoordinates(event) {
      this.mouseX = event.clientX - this.boundings.left;
      this.mouseY = event.clientY - this.boundings.top;
    },
    setInitialMouseCoordinates(event) {
      this.initialMouseX = event.clientX - this.boundings.left;
      this.initialMouseY = event.clientY - this.boundings.top;
    },
    onColorSelect(color) {
      if (
        this.canvasMode === canvasModes.EDIT &&
        this.selectedElementIndex !== null
      ) {
        this.copyAndAddLastStateToStackHistory();

        if (this.hasFill) {
          this.updateItemState('selectedFillColor', color);
          this.updateItemState('hasFill', this.hasFill);
          return this.redraw();
        }
        this.updateItemState('selectedStrokeColor', color);
        this.redraw();
      }

      if (this.hasFill) {
        return (this.selectedFillColor = color);
      }
      this.selectedStrokeColor = color;
    },
    onThicknessSelect(thickness) {
      if (
        this.canvasMode === canvasModes.EDIT &&
        this.selectedElementIndex !== null
      ) {
        this.copyAndAddLastStateToStackHistory();
        this.updateItemState('selectedThickness', thickness);
        this.redraw();
      }
      this.selectedThickness = thickness;
    },
    onShapeSelect(shape) {
      this.selectedShape = shape;
      this.canvasMode = canvasModes.DRAW;
      this.selectedElementIndex = null;
      if (shape === shapes.FREE || shape === shapes.LINE) {
        this.drawType = drawTypes.STROKE;
      }
      if (shapes !== shapes.TEXT) {
        this.showTextOptions = false;
      }
    },
    onImageUpload(imageUrl) {
      this.uploadedImages = [...this.uploadedImages, imageUrl];
    },
    onTextOptionsUpdate(value, field) {
      this.textOptions = { ...this.textOptions, [field]: value };
    },
    onReset() {
      this.clearCanvas(this.context);
      this.clearCanvas(this.contextPreview);
      this.stackHistory = [];
      this.nrOfStackSteps = null;
    },
    onSave() {
      const fileName = !isElectron() && prompt('Please enter the file name');
      const canvas = this.$refs.canvas;
      const canvasDataUrl = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = canvasDataUrl;
      a.download = fileName || 'my-paint-app-draw';
      a.click();
    },
    onCanvasResize() {
      this.resizeCanvas = !this.resizeCanvas;
    },
    onSelect() {
      this.selectedShape = null;
      this.showTextOptions = false;
      this.canvasMode = canvasModes.DRAG;
    },
    onUndo() {
      this.isDrawing = false;
      this.nrOfStackSteps = this.getCurrentStackIndex();
      this.nrOfStackSteps -= 1;
      if (this.nrOfStackSteps < 0) {
        return (this.nrOfStackSteps = null);
      }
      this.redraw();
    },
    onRedo() {
      this.isDrawing = false;
      this.nrOfStackSteps = this.getCurrentStackIndex();
      this.nrOfStackSteps += 1;
      if (this.nrOfStackSteps > this.stackHistory.length) {
        return (this.nrOfStackSteps = null);
      }
      this.redraw();
    },
    onDuplicate() {
      if (
        this.canvasMode === canvasModes.EDIT &&
        this.selectedElementIndex !== null
      ) {
        const duplicateElement = this.stackHistory[
          this.stackHistory.length - 1
        ][this.selectedElementIndex];
        this.copyAndAddLastStateToStackHistory(duplicateElement);
        this.redraw();
      }
    },
    onRotateClockwise() {
      this.onRotate();
    },
    onRotateCounterclockwise() {
      this.onRotate(false);
    },
    onRotate(isRotationClockwise = true) {
      if (
        this.canvasMode === canvasModes.EDIT &&
        this.selectedElementIndex !== null
      ) {
        const currentRotation = this.stackHistory[this.stackHistory.length - 1][
          this.selectedElementIndex
        ].rotation;
        const ROTATION_UPDATE = isRotationClockwise ? 10 : -10;
        console.log({ currentRotation });
        this.copyAndAddLastStateToStackHistory();
        const newRotation =
          currentRotation + ROTATION_UPDATE <= 360
            ? currentRotation + ROTATION_UPDATE
            : 0;
        this.updateItemState('rotation', newRotation);
        this.redraw();
      }
    },
    setEditMode() {
      this.canvasMode = canvasModes.EDIT;
    },
    setDragMode() {
      this.canvasMode = canvasModes.DRAG;
    },
    getCurrentStackIndex() {
      return this.nrOfStackSteps !== null
        ? this.nrOfStackSteps
        : this.stackHistory.length || 0;
    }
  }
};
