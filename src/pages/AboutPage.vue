<script lang='ts'>
import packageJson from './../../package.json'

export default {
  emits: ['close'],
  data () {
    return {
      version: packageJson.version
    }
  }
}
</script>

<template>

<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">About</p>
    <button class="delete" aria-label="close" @click='$emit("close")'></button>
  </header>
  <section class="modal-card-body modal-card-foot">
    <div class="content">
      <div class="title">Trgk's Audio Blind Test</div>
      <div class="subtitle">Version {{version}}</div>
      <p>이중맹검 블라인드테스트를 도와주는 프로그램입니다.</p>
    </div>
  </section>
</div>

</template>
