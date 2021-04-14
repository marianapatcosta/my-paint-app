<template>
  <div class="app">
    <app-header title="My Paint App" />
    <main class="app__main">
      <div class="app__main-body">
        <div class="app__sidebar">
          <div class="app__sidebar-item">
            <p>&nbsp;</p>
            <div class="app__sidebar-item-grid">
              <div
                v-for="operation in operations"
                :key="`operation-${operation}`"
              >
                <button
                  class="button"
                  :class="{
                    'button--disabled': isOperationButtonDisabled(operation)
                  }"
                  :aria-label="`click to ${operation}`"
                  @click="operationMethods[operation]"
                  :disabled="isOperationButtonDisabled(operation)"
                >
                  <img
                    :src="
                      require(`./assets/icons/${operation
                        .split('_')
                        .join('-')}.svg`)
                    "
                    :alt="`${operation.split('_').join(' ')}} icon`"
                  />
                </button>
                <span class="tooltip">{{
                  operation.split('_').join(' ')
                }}</span>
              </div>
            </div>
            <div class="app__resize" v-if="resizeCanvas">
              <label>
                width
                <input type="number" v-model="width" placeholder="width" />
              </label>
              <label>
                height
                <input type="number" v-model="height" placeholder="height" />
              </label>
            </div>
          </div>
          <div class="app__sidebar-item">
            <p>&nbsp;</p>
            <div class="app__sidebar-radio">
              <label
                v-for="type in drawTypes"
                :key="`draw-${type}`"
                class="radio-button__wrapper"
              >
                <input
                  type="radio"
                  :value="type"
                  v-model="drawType"
                  :checked="drawType === type"
                />
                <span class="radio-button" />
                {{ type }}
              </label>
            </div>
          </div>
          <div class="app__sidebar-item">
            <p>colors</p>
            <app-color-pallete
              :selectedColor="selectedColor"
              @selectColor="onColorSelect"
            />
          </div>
          <div class="app__sidebar-item">
            <p>thickness</p>
            <app-thickness
              :selectedThickness="selectedThickness"
              @selectThickness="onThicknessSelect"
            />
          </div>
          <div class="app__sidebar-item">
            <p>shapes</p>
            <app-shapes
              :selectedShape="selectedShape"
              @selectShape="onShapeSelect"
              @uploadImage="onImageUpload"
            />
          </div>
        </div>
        <div class="app__canvas-wrapper">
          <canvas
            class="app__canvas"
            :class="{ 'app__canvas--drawing': isDrawing }"
            ref="canvas"
            role="img"
            aria-label="draw here!"
            :width="width"
            :height="height"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
            @click="setDragMode"
            @dblclick="setEditMode"
          />
          <canvas
            class=" app__canvas app__canvas-preview"
            :class="{
              'app__canvas-preview--active': isPreview,
              'app__canvas--drawing': isDrawing
            }"
            ref="canvasPreview"
            role="img"
            aria-label="draw here!"
            :width="width"
            :height="height"
            @mousedown="onMouseDown"
            @mousemove="onMouseMove"
            @mouseup="onMouseUp"
          />
          <app-text-configs
            :showTextOptions="showTextOptions"
            :textOptions="textOptions"
            :initialMouseX="initialMouseX"
            :initialMouseY="initialMouseY"
            @configText="onTextOptionsUpdate"
            @drawText="drawText"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script src="./App.js"></script>

<style scoped lang="scss" src="./App.scss"></style>
