<template>
  <div class="thickness">
    <button
      v-for="thicknessItem in thickness"
      :key="`thickess-${thicknessItem}`"
      class="thickness__item"
      :class="{
        'thickness__item--active': thicknessItem === selectedThickness
      }"
      :value="thicknessItem"
      @click="onThicknessClick"
    >
      <div :style="{ width: `${thicknessItem}px` }">&nbsp;</div>
    </button>
  </div>
</template>

<script src="./Thickness.js"></script>
<style scoped lang="scss" src="./Thickness.scss"></style>
