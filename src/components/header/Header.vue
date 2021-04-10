<template>
  <div>
    <header>
      <h1>{{ title }}</h1>
      <img
        :src="require(`../../assets/icons/palette.svg`)"
        :alt="`palleteicon`"
      />
    </header>
  </div>
</template>

<script src="./Header.js"></script>

<style scoped lang="scss" src="./Header.scss"></style>
