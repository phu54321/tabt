<script setup lang='ts'>
import { ref } from 'vue'
import zipb64 from '../../../testData/hdxxx.zip.base64?raw'
import { BlindTest, loadBlindTest } from './blindTestData'
import TestMain from './TestMain.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'

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
