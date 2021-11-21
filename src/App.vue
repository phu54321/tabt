<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import BlindTest from './components/BlindTest.vue'
import zipb64 from './../testData/hdxxx.zip.base64?raw'
import { loadBlindTest } from './blindTestData'
import { ref } from '@vue/reactivity'

const audioBufferA = ref(null as null | AudioBuffer)
const audioBufferB = ref(null as null | AudioBuffer)

loadBlindTest(zipb64).then(bt => {
  audioBufferA.value = bt.entries[0].wavData
  audioBufferB.value = bt.entries[1].wavData
})

</script>

<template>
<div id="app">
  <h1>Trgk's Audio Blind Test</h1>
  <h2>Test 1/15</h2>
  <BlindTest v-if='audioBufferA && audioBufferB' :audio-buffer-a="audioBufferA" :audio-buffer-b="audioBufferB"></BlindTest>

</div>
</template>

<style lang='scss'>
#app {
  font-family: sans-serif;
}
</style>
