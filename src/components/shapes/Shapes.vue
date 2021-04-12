<template>
  <div class="shapes">
    <div
      class="shapes__item-wrapper"
      v-for="shapeItem in shapes"
      :key="`shape-${shapeItem}`"
    >
      <button
        class="shapes__item"
        :class="{
          'shapes__item--active': shapeItem === selectedShape
        }"
        :aria-label="`click to select ${shapeItem} shape`"
        :value="shapeItem"
        @click="onShapeClick"
      >
        <img
          :src="require(`../../assets/icons/${shapeItem}.svg`)"
          :alt="`${shapeItem} icon`"
        />
      </button>
      <span class="tooltip">{{ shapeItem }}</span>
    </div>
    <input
      class="shapes__input"
      type="file"
      @change="onImageUpload"
      ref="uploadImageInput"
    />
  </div>
</template>

<script src="./Shapes.js"></script>
<style scoped lang="scss" src="./Shapes.scss"></style>
