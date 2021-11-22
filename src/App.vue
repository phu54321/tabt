<script setup lang="ts">
import './scss/styles.scss'
import 'animate.css/animate.css'
import { ref, watch } from 'vue'
import BulmaModal from './utils/BulmaModal.vue'
import AboutPage from './pages/AboutPage.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

import calibrateBase64 from './calibrate.zip.base64?raw'
import { BlindTest, loadBlindTest } from './pages/BlindTest/blindTestData'
import BlindTestVue from './pages/BlindTest/TestMain.vue'
import SelectFile from './pages/SelectFile.vue'

// This is where the application will put zipb64 data in.
const start = '!@#$%'
const end = '^&*()'
const data = '!@#$%^&*()'

// Main logic begins
const zipb64 = ref(data.slice(start.length, data.length - end.length))
const blindTest = ref(null as null | BlindTest)

async function onZipLoad () {
  let b64 = zipb64.value
  if (b64.length === 0) b64 = calibrateBase64
  blindTest.value = await loadBlindTest(b64)
}

watch(zipb64, onZipLoad)
onZipLoad()

// ---------------------------

// Menu expand / collapse
const isMenuExpanded = ref(false)
function toggleMenu () {
  isMenuExpanded.value = !isMenuExpanded.value
}

function _arrayBufferToBase64 (buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}

function onFileSelect (file: File) {
  const reader = new FileReader()
  reader.onload = function () {
    zipb64.value = _arrayBufferToBase64(reader.result as ArrayBuffer)
  }
  reader.readAsArrayBuffer(file)
  showCreateNewTest.value = false
  blindTest.value = null
}

// ---------------------------
// Modals

const showAbout = ref(false)
const showCreateNewTest = ref(false)

</script>

<template>
<nav class="navbar is-primary" role="navigation" aria-label="main navigation">
  <div class="navbar-brand">
    <a class="navbar-item" href="#">
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
      <a class="navbar-item" @click='showCreateNewTest = true'>테스트 제작</a>
      <a class="navbar-item" @click='showAbout = true'>About</a>
      <a class="navbar-item" href='https://github.com/phu54321/tabt' target="blank">
        <font-awesome-icon class="mr-1" :icon="['fab', 'github']"></font-awesome-icon>Github
      </a>
    </div>
  </div>
</nav>

<div class="container p-3">
  <Loading :active="blindTest === null">
    <template v-slot:after>
      <p class="has-text-centered">Loading...</p>
    </template>
  </Loading>

  <BlindTestVue v-if='blindTest !== null' :blind-test='blindTest' />
</div>

<bulma-modal :show='showAbout'>
  <AboutPage @close='showAbout = false' />
</bulma-modal>

<bulma-modal :show='showCreateNewTest'>
  <SelectFile @close='showCreateNewTest = false' @select="onFileSelect" />
</bulma-modal>

</template>

<style lang='scss'>
#app {
  font-family: sans-serif;
  user-select: none;
}

.vld-icon {
  text-align: center;
}

</style>
