<script setup lang="ts">
import { BlindTest } from './blindTestData'

defineProps<{
  test: BlindTest
}>()
defineEmits<{(eventName: 'close'): void}>()

</script>

<template>
<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">테스트 설명</p>
    <button class="delete" aria-label="close" @click='$emit("close")'></button>
  </header>
  <section class="modal-card-body modal-card-foot">
    <div class="content">
      <p class="title">{{test.label}}</p>
      <ol>
        <li v-for='entry, i of test.entries' :key='i'>{{entry.label}}</li>
      </ol>
    </div>
  </section>
</div>
</template>

<style>
.title-scrolling {
  overflow-x: scroll;
}
</style>
