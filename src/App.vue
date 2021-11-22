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

// This is where the application will put zipb64 data in.
const data = '<<<<<>>>>>'

// Main logic begins
const zipb64 = ref(data.slice(5, data.length - 5))
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

// ---------------------------
// Modals

const showAbout = ref(false)

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
      <a class="navbar-item" @click='showAbout = true'>
        <font-awesome-icon icon='question-circle' />
      </a>
      <a class="navbar-item" href='https://github.com/phu54321/tabt' target="blank">
        <font-awesome-icon :icon="['fab', 'github']" />
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
