<script setup lang="ts">
import { toRefs } from 'vue'
import { type BlindTestEntry, type ComparionResult } from './blindTestData'

const props = defineProps<{
  entries: BlindTestEntry[]
  finalOrder: number[]
  logs: ComparionResult[]
}>()

function comparisonResultToSTring (log: ComparionResult): string {
  return [
    `(${props.entries[log.leftCandidate].label})`, log.leftHigher ? '>' : '<', `(${props.entries[log.rightCandidate].label})`
  ].join(' ')
}

const { entries, finalOrder, logs } = toRefs(props)
</script>

<template>
<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">테스트 결과</p>
  </header>
  <section class="modal-card-body">
    <div class="content allow-select">
      <div class="subtitle">순서 (좋은 것 → 안 좋은 것)</div>
      <ol>
        <li v-for='o of finalOrder' :key='o'>{{entries[o].label}}</li>
      </ol>

      <div class="subtitle">테스트 기록</div>
      <ul>
        <li v-for='log, i of logs' :key='i'>{{comparisonResultToSTring(log)}}</li>
      </ul>
    </div>
  </section>
  <footer class="modal-card-foot">
    수고하셨습니다.
  </footer>
</div>
</template>

<style>
.allow-select {
  user-select: initial;
}

.result-small {
  font-size: .8em;
  margin-left: 3em;
  line-height: 1.2em;
}
</style>
