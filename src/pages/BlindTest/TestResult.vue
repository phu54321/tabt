<script setup lang="ts">
import { toRefs } from 'vue'
import { BlindTestEntry } from './blindTestData'

const props = defineProps<{
  entries: BlindTestEntry[]
  finalOrder: number[]
  logs: string[]
}>()

const { entries, finalOrder, logs } = toRefs(props)
</script>

<template>
<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">테스트 결과</p>
  </header>
  <section class="modal-card-body">
    <div class="content">
      <div class="subtitle">Order</div>
      <ol>
        <li v-for='o of finalOrder' :key='o'>{{entries[o].label}}</li>
      </ol>

      <div class="subtitle">Test log</div>
      <ul>
        <li v-for='log, i of logs' :key='i'>{{log}}</li>
      </ul>
    </div>
  </section>
  <footer class="modal-card-foot">
    수고하셨습니다.
  </footer>
</div>
</template>
