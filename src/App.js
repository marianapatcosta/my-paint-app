import {
  ColorPallete,
  Header,
  Shapes,
  TextConfigs,
  Thickness
} from './components';
import {
  baseColors,
  defaultTextOptions,
  drawTypes,
  operations,
  shapes,
  thickness
} from './components/constants';

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
        free: this.freeDraw,
        rectangle: this.drawRectangle,
        line: this.drawLine,
        circle: this.drawCircle,
        ellipse: this.drawEllipse,
        triangle: this.drawTriangle,
        eraser: this.erase,
        text: this.drawText,
        image: this.drawImage
      },
      operations,
      operationMethods: {
        undo: this.onUndo,
        redo: this.onRedo,
        resize: this.onResize,
        save: this.onSave,
        reset: this.onReset
      },
      resizeCanvas: false,
      stackHistory: [],
      nrOfStackSteps: null
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
      const { width, height } = this.getCanvasDimensions();
      this.width = width;
      this.height = height;
    },
    getCanvasDimensions() {
      if (window.innerWidth > 1023) {
        return { width: 900, height: 620 };
      }
      if (window.innerWidth > 767) {
        return { width: 600, height: 620 };
      }
      if (window.innerWidth > 480) {
        return { width: 400, height: 580 };
      }
      return { width: 200, height: 580 };
    },
    clearCanvas(context) {
      context.clearRect(0, 0, this.width, this.height);
    },
    isOperationButtonDisabled(operation) {
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
    startDrawing(event) {
      if (
        this.nrOfStackSteps &&
        this.nrOfStackSteps < this.stackHistory.length
      ) {
        this.stackHistory = this.stackHistory.slice(0, this.nrOfStackSteps);
      }
      this.nrOfStackSteps = null;
      this.setMouseCoordinates(event);
      this.setInitialMouseCoordinates(event);
      this.isDrawing = true;
      this.isPreview = !this.drawWithoutPreview.includes(this.selectedShape);
      this.showTextOptions = this.selectedShape === shapes.TEXT;
    },
    finishDrawing() {
      this.isDrawing = false;
      this.isPreview = false;

      this.saveConfigsInStack();
      if (!this.drawWithoutPreview.includes(this.selectedShape)) {
        this.clearCanvas(this.contextPreview);
        this.initialSetup(this.context);
        this.selectedShape && this.drawShape[this.selectedShape](this.context);
      }
    },
    drawShapeInCanvas(context, hasFill) {
      if (this.isPreview) return context.stroke();
      context.stroke();
      hasFill && context.fill();
    },
    draw() {
      if (!this.isDrawing || this.isPreview) return;
      this.initialSetup(this.context);
      if (this.selectedShape && this.selectedShape !== 'text') {
        this.drawShape[this.selectedShape](this.context);
        //this.saveConfigsInStack();
      }
    },
    drawPreview(event) {
      if (!this.isDrawing || !this.isPreview) return;
      this.setMouseCoordinates(event);
      this.initialSetup(this.contextPreview);
      this.selectedShape &&
        this.drawShape[this.selectedShape](this.contextPreview);
    },
    freeDraw(context, configs) {
      const settings = configs ? configs : this;
      context.moveTo(settings.mouseX, settings.mouseY);
      this.setMouseCoordinates(event);
      context.lineTo(settings.mouseX, settings.mouseY);
      context.stroke();
    },
    drawLine(context, configs) {
      const settings = configs ? configs : this;
      context.moveTo(settings.initialMouseX, settings.initialMouseY);
      context.lineTo(settings.mouseX, settings.mouseY);
      context.stroke();
    },
    drawRectangle(context, configs) {
      const settings = configs ? configs : this;
      context.moveTo(settings.initialMouseX, settings.initialMouseY);
      context.rect(
        settings.initialMouseX,
        settings.initialMouseY,
        settings.mouseX - settings.initialMouseX,
        settings.mouseY - settings.initialMouseY
      );
      this.drawShapeInCanvas(context, settings.hasFill);
    },
    drawImage(context, configs) {
      if (!this.uploadedImages.length) return;
      const settings = configs ? configs : this;
      const image = new Image();
      image.src = configs
        ? this.uploadedImages[settings.uploadedImageIndex]
        : this.uploadedImages[this.uploadedImages.length - 1];
      context.moveTo(settings.initialMouseX, settings.initialMouseY);
      image.onload = () =>
        context.drawImage(
          image,
          settings.initialMouseX,
          settings.initialMouseY,
          settings.mouseX - settings.initialMouseX,
          settings.mouseY - settings.initialMouseY
        );
    },
    drawCircle(context, configs) {
      const settings = configs ? configs : this;
      const radian = Math.PI / 180;
      const radius = this.getDistance(
        settings.initialMouseX,
        settings.initialMouseY,
        settings.mouseX,
        settings.mouseY
      );
      context.arc(
        settings.initialMouseX,
        settings.initialMouseY,
        radius,
        0 * radian,
        360 * radian
      );
      this.drawShapeInCanvas(context, settings.hasFill);
    },
    drawEllipse(context, configs) {
      const settings = configs ? configs : this;
      context.moveTo(
        settings.initialMouseX,
        settings.initialMouseY + (settings.mouseY - settings.initialMouseY) / 2
      );
      context.bezierCurveTo(
        settings.initialMouseX,
        settings.initialMouseY,
        settings.mouseX,
        settings.initialMouseY,
        settings.mouseX,
        settings.initialMouseY + (settings.mouseY - settings.initialMouseY) / 2
      );
      context.bezierCurveTo(
        settings.mouseX,
        settings.mouseY,
        settings.initialMouseX,
        settings.mouseY,
        settings.initialMouseX,
        settings.initialMouseY + (settings.mouseY - settings.initialMouseY) / 2
      );
      context.closePath();
      this.drawShapeInCanvas(context, settings.hasFill);
    },
    drawText(canvasText, configs) {
      const text = configs ? configs.canvasText : canvasText;
      if (!text) return;
      const settings = configs ? configs : this;
      const { fontFamily, fontSize, isItalic, isBold } = settings.textOptions;
      this.context.fillStyle = settings.selectedFillColor;
      this.context.strokeStyle = settings.selectedStrokeColor;
      this.context.font = `${isItalic ? 'italic' : 'normal'} ${
        isBold ? 700 : 400
      } ${fontSize} ${fontFamily}`;
      settings.hasFill
        ? this.context.fillText(
            text,
            settings.initialMouseX,
            settings.initialMouseY
          )
        : this.context.strokeText(
            text,
            settings.initialMouseX,
            settings.initialMouseY
          );

      !configs && this.saveConfigsInStack(canvasText);
      this.textOptions = defaultTextOptions;
      this.isDrawing = false;
      this.showTextOptions = false;
    },
    drawTriangle(context, configs) {
      const settings = configs ? configs : this;
      context.moveTo(settings.initialMouseX, settings.initialMouseY);
      // size of a triangle size
      const triangleLength = Math.abs(settings.initialMouseX - settings.mouseX);

      // x3 is the point in the middle of the base line of equilateral triangle
      const x3 = triangleLength / 2 + settings.initialMouseX;

      // height = length * Math.cos(30) <=> length * Math.cos(Math.PI / 6)
      // const height = triangleLength * Math.cos(Math.PI / 6);
      const height = (triangleLength * Math.sqrt(3, 2)) / 2;
      context.lineTo(settings.mouseX, settings.initialMouseY);
      context.lineTo(x3, settings.initialMouseY - height);
      context.closePath();
      this.drawShapeInCanvas(context, settings.hasFill);
    },
    erase(context, configs) {
      const settings = configs ? configs : this;
      context.moveTo(settings.mouseX, settings.mouseY);
      this.setMouseCoordinates(event);
      context.clearRect(
        settings.mouseX,
        settings.mouseY,
        settings.selectedThickness,
        settings.selectedThickness
      );
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
        hasFill: this.hasFill
      };

      if (this.selectedShape === shapes.TEXT) {
        configs.textOptions = this.textOptions;
        configs.canvasText = canvasText;
      }

      if (this.selectedShape === shapes.IMAGE) {
        configs.uploadedImageIndex = this.uploadedImages.length - 1;
      }

      const newStackItem = this.stackHistory.length
        ? [...this.stackHistory[this.stackHistory.length - 1], configs]
        : [configs];

      this.stackHistory.push(newStackItem);
    },
    redraw() {
      if (!this.stackHistory.length) return;
      this.clearCanvas(this.context);
      this.isDrawing = true;
      const stackItems = [...this.stackHistory[this.nrOfStackSteps - 1]];
      stackItems.forEach(configs => {
        this.context.beginPath();
        this.context.lineWidth = configs.selectedThickness;
        this.context.strokeStyle = configs.selectedStrokeColor;
        this.context.fillStyle = configs.selectedFillColor;
        this.drawShape[configs.selectedShape](this.context, configs);
      });
      this.isDrawing = false;
    },
    getDistance(x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    },
    setMouseCoordinates(event) {
      this.mouseX = event.clientX - this.boundings.left;
      this.mouseY = event.clientY - this.boundings.top;
    },
    setInitialMouseCoordinates(event) {
      this.initialMouseX = event.clientX - this.boundings.left;
      this.initialMouseY = event.clientY - this.boundings.top;
    },
    onColorSelect(selectedColor) {
      if (this.hasFill) {
        return (this.selectedFillColor = selectedColor);
      }
      this.selectedStrokeColor = selectedColor;
    },
    onThicknessSelect(thickness) {
      this.selectedThickness = thickness;
    },
    onShapeSelect(shape) {
      this.selectedShape = shape;
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
      const fileName = prompt('Please enter the file name');
      const canvas = this.$refs.canvas;
      const canvasDataUrl = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = canvasDataUrl;
      a.download = fileName || 'my-paint-app-draw';
      a.click();
    },
    onResize() {
      this.resizeCanvas = !this.resizeCanvas;
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
    getCurrentStackIndex() {
      return this.nrOfStackSteps !== null
        ? this.nrOfStackSteps
        : this.stackHistory.length || 0;
    }
  }
};
