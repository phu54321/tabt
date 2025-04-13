<script setup lang="ts">
import { computed } from 'vue'
import { type BlindTestEntry, type ComparisonResult } from './blindTestData'

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from https://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb (h: number, s: number, l: number) {
  let r, g, b

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb(p, q, h + 1 / 3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1 / 3)
  }

  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`
}

function hueToRgb (p: number, q: number, t: number): number {
  if (t < 0) t += 1
  if (t > 1) t -= 1
  if (t < 1 / 6) return p + (q - p) * 6 * t
  if (t < 1 / 2) return q
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
  return p
}

const props = defineProps<{
  entries: BlindTestEntry[]
  logs: ComparisonResult[]
}>()

const selectedEntry = computed(() => {
  return props.logs.map(l => l.leftHigher ? l.leftCandidate : l.rightCandidate)
})
</script>

<template>
<div class="log-view-intermediate">
  <div class='selection' v-for="sel, i of selectedEntry" :key="i" :style="{ backgroundColor: hslToRgb(sel * 0.17, 0.8, 0.8)}">
    {{ sel }}
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
