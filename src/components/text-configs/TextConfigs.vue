<template>
  <div
    class="text-configs"
    v-if="showTextOptions"
    :style="{
      top: `${initialMouseY}px`,
      left: `${initialMouseX}px`
    }"
  >
    <input
      type="text"
      v-model="canvasText"
      placeholder="type and press 'Enter'"
      @keydown.enter="onDrawText"
    />
    <div class="text-configs-bar">
      <select
        :value="textOptions.fontFamily"
        name="fontFamily"
        @change="onTextConfig"
      >
        <option
          v-for="fontFamily in fontFamilies"
          :key="`font-${fontFamily}`"
          :value="fontFamily"
          >{{ fontFamily }}</option
        >
      </select>
      <select
        :value="textOptions.fontSize"
        name="fontSize"
        @change="onTextConfig"
      >
        <option
          v-for="fontSize in fontSizes"
          :key="`font-${fontSize}`"
          :value="fontSize"
          >{{ fontSize.split('px')[0] }}</option
        >
      </select>
      <button
        :class="{
          'text-configs-button--active': textOptions.isItalic
        }"
        :value="!textOptions.isItalic"
        name="isItalic"
        style="fontStyle: italic"
        @click="onTextConfig"
      >
        I
      </button>
      <button
        :class="{
          'text-configs-button--active': textOptions.isBold
        }"
        :value="!textOptions.isBold"
        name="isBold"
        style="fontWeight: 700"
        @click="onTextConfig"
      >
        B
      </button>
    </div>
  </div>
</template>

<script src="./TextConfigs.js"></script>
<style scoped lang="scss" src="./TextConfigs.scss"></style>
