<script setup lang="ts">
import { hslToRgb } from '../../utils/hueToRgb';
import type { BlindTestEntry, ABComparisonResult } from './blindTestData'

defineProps<{
  entries: BlindTestEntry[]
  comparisonLogs: ABComparisonResult[]
}>()

function selectedEntry(e: ABComparisonResult) {
  return e.leftHigher ? e.lhs : e.rhs
}

</script>

<template>
<div class="log-view-intermediate">
  <div class='selection' v-for="log, i of comparisonLogs" :key="i" :style="{ backgroundColor: hslToRgb(selectedEntry(log) * 0.17, 0.8, 0.8)}">
    {{ selectedEntry(log) + 1 }}
  </div>
</div>
</template>

<style lang="scss">
.log-view-intermediate {
  text-align: center;

  .selection {
    display: inline-block;
    padding: 0 5px;
    margin: 2px 2px;
    border-radius: 3px;
    /* border: 1px solid rgba(0, 0, 0, 0.2); */
  }
}
</style>
