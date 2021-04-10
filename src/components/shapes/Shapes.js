import { shapes } from '../constants';

export default {
  name: 'Shapes',
  props: {
    selectedShape: String
  },
  emits: ['selectShape', 'uploadImage'],
  data() {
    return {
      shapes
    };
  },
  methods: {
    onShapeClick(event) {
      this.$emit('selectShape', event.target.value);
      if (event.target.value === 'image') {
        this.$refs.uploadImageInput.click();
      }
    },
    async onImageUpload(event) {
      const imageUrl = await new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = event => {
          const imageUrl = event.target.result;
          resolve(imageUrl);
          reject('error');
        };
        reader.readAsDataURL(event.target.files[0]);
      });
      await this.$emit('uploadImage', imageUrl);
    }
  }
};
