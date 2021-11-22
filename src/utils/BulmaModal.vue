<script lang='ts'>
export default {
  props: ['show']
}
</script>

<template>
<teleport to='body'>
  <transition name='fade'>
    <div v-if='show' class="modal is-active">
      <div class="modal-background"></div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </transition>
</teleport>

</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
