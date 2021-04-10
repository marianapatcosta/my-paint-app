import { baseColors } from '../constants';

export default {
  name: 'ColorPallete',
  props: {
    selectedColor: String
  },
  emits: ['selectColor'],
  computed: {
    colors() {
      return [...baseColors, ...this.personalizedColors];
    }
  },
  data() {
    return {
      personalizedColors: []
    };
  },
  methods: {
    onColorClick(event) {
      this.$emit('selectColor', event.target.value);
    },
    addNewColor() {
      this.$refs.inputColor.click();
    },
    onPickNewColor(event) {
      this.personalizedColors = [
        ...this.personalizedColors,
        event.target.value
      ];
      this.onColorClick(event);
    }
  }
};
