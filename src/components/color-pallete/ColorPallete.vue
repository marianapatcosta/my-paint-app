<template>
  <div class="color-pallete__wrapper">
    <div class="color-pallete">
      <button
        v-for="color in colors"
        :key="`color-${color}`"
        class="color-pallete__color"
        :class="{ 'color-pallete__color--active': color === selectedColor }"
        :value="color"
        :style="{ 'background-color': `${color}` }"
        @click="onColorClick"
      />
      <div class="color-pallete__personalize-wrapper">
        <button
          class="color-pallete__color color-pallete__personalize"
          aria-label="add personalized color"
          @click="addNewColor"
        >
          <img :src="require(`../../assets/icons/add.svg`)" alt="add icon" />
        </button>
        <span class="tooltip">personalize</span>
      </div>
    </div>
    <input
      class="color-pallete__input"
      type="color"
      :value="selectedColor"
      @change="onPickNewColor"
      ref="inputColor"
    />
  </div>
</template>

<script src="./ColorPallete.js"></script>
<style scoped lang="scss" src="./ColorPallete.scss"></style>
