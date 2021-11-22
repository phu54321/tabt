<script setup lang='ts'>
import { ref } from 'vue'
import { BlindTest, loadBlindTest } from './blindTestData'
import TestMain from './TestMain.vue'
import Loading from 'vue-loading-overlay'
import calibrateBase64 from './../../calibrate.zip.base64?raw'
import 'vue-loading-overlay/dist/vue-loading.css'

// This is where the application will put zipb64 data in.
const start = '!@#$%'
const end = '^&*()'
const data = '!@#$%^&*()'

// Main logic begins
let zipb64 = data.slice(start.length, data.length - end.length)
if (zipb64.length === 0) zipb64 = calibrateBase64

const blindTest = ref(null as null | BlindTest)
loadBlindTest(zipb64).then(b => {
  blindTest.value = b
})

</script>

<template>

<Loading :active="blindTest === null">
  <template v-slot:after>
    <p class="has-text-centered">Loading...</p>
  </template>
</Loading>
<TestMain v-if='blindTest !== null' :blind-test="blindTest"></TestMain>

</template>

<style>
.vld-icon {
  text-align: center;
}
</style>
