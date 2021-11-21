<script setup lang="ts">
import './scss/styles.scss'
import { ref } from 'vue'
import BlindTest from './pages/BlindTest/index.vue'

const isMenuExpanded = ref(false)
function toggleMenu () {
  isMenuExpanded.value = !isMenuExpanded.value
}

</script>

<template>
<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="/">
      <font-awesome-icon class="mr-2" icon="music" /> TABT
    </a>
    <a class="navbar-burger" :class='{"is-active": isMenuExpanded}' @click="toggleMenu" role="button" aria-label="menu" aria-expanded="false">
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
      <span aria-hidden="true"></span>
    </a>
  </div>
  <div class="navbar-menu" :class='{"is-active": isMenuExpanded}'>
    <div class="navbar-end">
      <a class="navbar-item">Create new test</a>
      <a class="navbar-item">Help</a>
      <a class="navbar-item">
        <font-awesome-icon class="mr-1" :icon="['fab', 'github']"></font-awesome-icon>Github
      </a>
    </div>
  </div>
</nav>
<div class="container p-3">
  <BlindTest />
</div>

</template>

<style lang='scss'>
#app {
  font-family: sans-serif;
}
</style>
