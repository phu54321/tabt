<script setup lang="ts">
import { ref } from 'vue'
import BulmaModal from './utils/BulmaModal.vue'
import AboutPage from './pages/AboutPage.vue'
import Loading from 'vue-loading-overlay'

import './scss/styles.scss'
import 'animate.css/animate.css'
import 'vue-loading-overlay/dist/vue-loading.css'

import { type BlindTest, loadBlindTest } from './pages/BlindTest/blindTestData'
import BlindTestVue from './pages/BlindTest/TestMain.vue'

// This is where the application will put zipb64 data in.
const data = '<<<<<>>>>>'
let zipb64 = data.slice(5, data.length - 5)
const blindTest = ref(null as null | BlindTest)
const showNoTestModal = ref(false)

async function onZipLoad () {
  if (zipb64.length === 0) {
    showNoTestModal.value = true
    return
  }
  showNoTestModal.value = false
  blindTest.value = await loadBlindTest(zipb64)
}

onZipLoad()

// Development mode
if (import.meta.env.MODE === 'development') {
  import('./calibrate.zip.base64?raw').then(m => {
  // import('./aac_ldac_blind_test.zip.base64?raw').then(m => {
   zipb64 = m.default
   onZipLoad()
  })
}


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
  <!-- @vue-ignore -->
  <Loading :active="!showNoTestModal && blindTest === null">
    <template v-slot:after>
      <p class="has-text-centered">Loading...</p>
    </template>
  </Loading>

  <template v-if="blindTest !== null">
    <BlindTestVue :blind-test='blindTest' />
  </template>
</div>

<bulma-modal :show='showAbout'>
  <AboutPage @close='showAbout = false' />
</bulma-modal>

<bulma-modal :show='showNoTestModal'>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">첨부된 테스트가 없습니다.</p>
    </header>
    <section class="modal-card-body modal-card-foot">
      <div class="content">
        <p>테스트를 첨부해주세요.</p>
      </div>
    </section>
  </div>
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
