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
  <section class="modal-card-body">
    <div class="content">
      <div class="title">Trgk's Audio Blind Test</div>
      <div class="subtitle">Version {{version}}</div>
      <p>이중맹검 블라인드테스트를 도와주는 프로그램입니다.</p>
    </div>
  </section>
    <footer class="modal-card-foot">
      <div class="youtube-wrapper">
        <iframe src="https://www.youtube.com/embed/qtg3AmN2IuQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    </footer>

</div>

</template>

<style lang='scss'>

.youtube-wrapper {
  position: relative;
  padding-bottom: 56.25%;
  width: 100%;

  iframe {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
