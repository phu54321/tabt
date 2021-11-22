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
    <p class="modal-card-title">{{test.label}}</p>
  </header>
  <section class="modal-card-body">
    <div class="content">
      <div class="subtitle">비교할 대상</div>
      <ol>
        <li v-for='entry, i of test.entries' :key='i'>{{entry.label}}</li>
      </ol>
    </div>
  </section>
  <footer class="modal-card-foot">
    <button class="button" @click='$emit("close")'>테스트 시작</button>
  </footer>
</div>
</template>
