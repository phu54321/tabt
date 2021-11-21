<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
// import BlindTest from './components/BlindTest.vue'
// import zipb64 from './../testData/hdxxx.zip.base64?raw'
// import { loadBlindTest } from './blindTestData'
// import { ref } from '@vue/reactivity'
import './scss/styles.scss'
import { ref } from 'vue'

// const audioBufferA = ref(null as null | AudioBuffer)
// const audioBufferB = ref(null as null | AudioBuffer)

// loadBlindTest(zipb64).then(bt => {
//   audioBufferA.value = bt.entries[0].wavData
//   audioBufferB.value = bt.entries[1].wavData
// })

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
  <router-view></router-view>
</div>

</template>

<style lang='scss'>
#app {
  font-family: sans-serif;
}
</style>
