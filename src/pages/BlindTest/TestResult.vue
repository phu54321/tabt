<script setup lang="ts">
import { toRefs } from 'vue'
import type { BlindTestEntry } from './blindTestData'
import type { PValuedComparatorResult } from './pValuedComparator';
import { hslToRgb } from '../../utils/hueToRgb';

const props = defineProps<{
  entries: BlindTestEntry[]
  finalOrder: number[]
  sortLogs: PValuedComparatorResult<number>[]
}>()

const { entries, finalOrder, sortLogs } = toRefs(props)
</script>

<template>
<div class="modal-card">
  <header class="modal-card-head">
    <p class="modal-card-title">블라인드 테스트 결과</p>
  </header>
  <section class="modal-card-body">
    <div class="content allow-select test-result">
      <div class="subtitle">순서 (좋은 것 → 안 좋은 것)</div>
      <ul>
        <li v-for='o of finalOrder' :key='o'>
          <span class="entry-index-small" :style="{ backgroundColor: hslToRgb(o * 0.17, 0.8, 0.8) }">
            <span class="hidden">[</span>{{ o + 1 }}<span class="hidden">]</span>
          </span>
          {{entries[o].label}}
        </li>
      </ul>

      <div class="subtitle">테스트 기록</div>
      <ul>
        <li v-for='log, i of sortLogs' :key='i'>
          <template v-if="log.signedPValue < 0">
            <span class="entry-index-small" :style="{ backgroundColor: hslToRgb(log.rhs * 0.17, 0.8, 0.8) }">
              <span class="hidden">[</span>{{ log.rhs + 1 }}<span class="hidden">]</span>
            </span>
            {{ entries[log.rhs].label }}
            <span class="entry-selection-count">[{{ log.leftLower }}회]</span>
            &gt;
            <span class="entry-index-small" :style="{ backgroundColor: hslToRgb(log.lhs * 0.17, 0.8, 0.8) }">
              <span class="hidden">[</span>{{ log.lhs + 1 }}<span class="hidden">]</span>
            </span>
            {{ entries[log.lhs].label }}
            <span class="entry-selection-count">[{{ log.rightLower }}회]</span>
          </template>
          <template v-else>
            <span class="entry-index-small" :style="{ backgroundColor: hslToRgb(log.lhs * 0.17, 0.8, 0.8) }">
              <span class="hidden">[</span>{{ log.lhs + 1 }}<span class="hidden">]</span>
            </span>
            {{ entries[log.lhs].label }}
            <span class="entry-selection-count">[{{ log.rightLower }}회]</span>
            &gt;
            <span class="entry-index-small" :style="{ backgroundColor: hslToRgb(log.rhs * 0.17, 0.8, 0.8) }">
              <span class="hidden">[</span>{{ log.rhs + 1 }}<span class="hidden">]</span>
            </span>
            {{ entries[log.rhs].label }}
            <span class="entry-selection-count">[{{ log.leftLower }}회]</span>
          </template>
          &nbsp;
          <span class="entry-pvalue">(p-value {{ Math.abs(log.signedPValue).toFixed(3) }})</span>
        </li>
      </ul>
    </div>
  </section>
  <footer class="modal-card-foot">
    수고하셨습니다.
  </footer>
</div>
</template>

<style lang="scss">
.allow-select {
  user-select: initial;
}

.test-result {
  .entry-index-small {
    padding: 0 3px;
    border-radius: 3px;
    font-size: .8em;
  }

  .entry-selection-count {
    color: #666;
    font-size: .8em;
  }

  .entry-pvalue {
    margin-left: 1em;
    font-style: italic;
    color: #aaa;
    font-size: .9em;
  }

  .hidden{
    font-size: 0;
  }
}

</style>
