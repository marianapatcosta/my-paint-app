import { fontFamilies, fontSizes } from '../constants';

export default {
  name: 'TextConfigs',
  props: {
    showTextOptions: Boolean,
    initialMouseX: Number,
    initialMouseY: Number,
    textOptions: Object
  },
  emits: ['configText', 'drawText'],
  data() {
    return {
      canvasText: '',
      fontFamilies,
      fontSizes
    };
  },
  methods: {
    onTextConfig(event) {
      const { name, value } = event.target;
      const updatedValue =
        value === 'true' || value === 'false' ? value === 'true' : value;

      this.$emit('configText', updatedValue, name);
    },
    onDrawText() {
      this.$emit('drawText', this.canvasText);
      this.canvasText = '';
    }
  }
};
