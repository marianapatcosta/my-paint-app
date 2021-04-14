import { thickness } from '../../constants';

export default {
  name: 'Thickness',
  props: {
    selectedThickness: Number
  },
  emits: ['selectThickness'],
  data() {
    return {
      thickness
    };
  },
  methods: {
    onThicknessClick(event) {
      this.$emit('selectThickness', +event.target.value);
    }
  }
};
