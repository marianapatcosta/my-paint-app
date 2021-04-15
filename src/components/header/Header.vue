<template>
  <div>
    <header>
      <div class="header__title-wrapper">
        <h1>{{ title }}</h1>
        <img
          :src="require(`../../assets/icons/palette.svg`)"
          :alt="`palleteicon`"
        />
      </div>
      <a
        rel="nofollow noopener noreferrer"
        href="https://github.com/marianapatcosta/my-paint-app"
        >help</a
      >
    </header>
  </div>
</template>

<script src="./Header.js"></script>

<style scoped lang="scss" src="./Header.scss"></style>
