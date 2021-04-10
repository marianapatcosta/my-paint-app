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
        ellipsis: this.drawEllipsis,
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
      resizeCanvas: false
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
      this.setMouseCoordinates(event);
      this.setInitialMouseCoordinates(event);
      this.isDrawing = true;
      this.isPreview = !this.drawWithoutPreview.includes(this.selectedShape);
      this.showTextOptions = this.selectedShape === shapes.TEXT;
    },
    finishDrawing(event) {
      this.setMouseCoordinates(event);
      this.isDrawing = false;
      this.isPreview = false;

      if (!this.drawWithoutPreview.includes(this.selectedShape)) {
        this.clearCanvas(this.contextPreview);
        this.initialSetup(this.context);
        this.selectedShape && this.drawShape[this.selectedShape](this.context);
      }
    },
    drawShapeInCanvas(context) {
      if (this.isPreview) return context.stroke();
      context.stroke();
      this.hasFill && context.fill();
    },
    draw(event) {
      if (!this.isDrawing && !this.isPreview) return;
      this.initialSetup(this.context);
      this.selectedShape &&
        this.selectedShape !== 'text' &&
        this.drawShape[this.selectedShape](this.context, event);
    },
    drawPreview(event) {
      if (!this.isDrawing && this.isPreview) return;
      this.setMouseCoordinates(event);
      this.initialSetup(this.contextPreview);
      this.selectedShape &&
        this.drawShape[this.selectedShape](this.contextPreview);
    },
    freeDraw(context, event) {
      context.moveTo(this.mouseX, this.mouseY);
      this.setMouseCoordinates(event);
      context.lineTo(this.mouseX, this.mouseY);
      context.stroke();
    },
    drawLine(context) {
      context.moveTo(this.initialMouseX, this.initialMouseY);
      context.lineTo(this.mouseX, this.mouseY);
      context.stroke();
    },
    drawRectangle(context) {
      context.moveTo(this.initialMouseX, this.initialMouseY);
      context.rect(
        this.initialMouseX,
        this.initialMouseY,
        this.mouseX - this.initialMouseX,
        this.mouseY - this.initialMouseY
      );
      this.drawShapeInCanvas(context);
    },
    drawImage(context) {
      if (!this.uploadedImages.length) return;
      const image = new Image();
      image.src = this.uploadedImages[this.uploadedImages.length - 1];
      context.moveTo(this.initialMouseX, this.initialMouseY);
      image.onload = () =>
        context.drawImage(
          image,
          this.initialMouseX,
          this.initialMouseY,
          this.mouseX - this.initialMouseX,
          this.mouseY - this.initialMouseY
        );
    },
    drawCircle(context) {
      const radian = Math.PI / 180;
      const radius = this.getDistance(
        this.initialMouseX,
        this.initialMouseY,
        this.mouseX,
        this.mouseY
      );
      context.arc(
        this.initialMouseX,
        this.initialMouseY,
        radius,
        0 * radian,
        360 * radian
      );
      this.drawShapeInCanvas(context);
    },
    drawEllipsis(context) {
      context.moveTo(
        this.initialMouseX,
        this.initialMouseY + (this.mouseY - this.initialMouseY) / 2
      );
      context.bezierCurveTo(
        this.initialMouseX,
        this.initialMouseY,
        this.mouseX,
        this.initialMouseY,
        this.mouseX,
        this.initialMouseY + (this.mouseY - this.initialMouseY) / 2
      );
      context.bezierCurveTo(
        this.mouseX,
        this.mouseY,
        this.initialMouseX,
        this.mouseY,
        this.initialMouseX,
        this.initialMouseY + (this.mouseY - this.initialMouseY) / 2
      );
      context.closePath();
      this.drawShapeInCanvas(context);
    },
    drawText(canvasText) {
      if (!canvasText) return;
      const { fontFamily, fontSize, isItalic, isBold } = this.textOptions;
      this.context.fillStyle = this.selectedFillColor;
      this.context.strokeStyle = this.selectedStrokeColor;
      this.context.font = `${isItalic ? 'italic' : 'normal'} ${
        isBold ? 700 : 400
      } ${fontSize} ${fontFamily}`;
      this.drawType === drawTypes.FILL
        ? this.context.fillText(
            canvasText,
            this.initialMouseX,
            this.initialMouseY
          )
        : this.context.strokeText(
            canvasText,
            this.initialMouseX,
            this.initialMouseY
          );

      this.isDrawing = false;
      this.textOptions = defaultTextOptions;
      this.showTextOptions = false;
    },
    drawTriangle(context) {
      context.moveTo(this.initialMouseX, this.initialMouseY);
      // size of a triangle size
      const triangleLength = Math.abs(this.initialMouseX - this.mouseX);

      // x3 is the point in the middle of the base line of equilateral triangle
      const x3 = triangleLength / 2 + this.initialMouseX;

      // height = length * Math.cos(30) <=> length * Math.cos(Math.PI / 6)
      // const height = triangleLength * Math.cos(Math.PI / 6);
      const height = (triangleLength * Math.sqrt(3, 2)) / 2;
      context.lineTo(this.mouseX, this.initialMouseY);
      context.lineTo(x3, this.initialMouseY - height);
      context.closePath();
      this.drawShapeInCanvas(context);
    },
    erase(context, event) {
      context.moveTo(this.mouseX, this.mouseY);
      this.setMouseCoordinates(event);
      context.clearRect(
        this.mouseX,
        this.mouseY,
        this.selectedThickness,
        this.selectedThickness
      );
    },
    getDistance(p1x, p1y, p2x, p2y) {
      return Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
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
    onUndo() {},
    onRedo() {}
  }
};
