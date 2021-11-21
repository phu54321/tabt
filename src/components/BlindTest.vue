<script setup lang="ts">
import { toRefs, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  audioBufferA: AudioBuffer,
  audioBufferB: AudioBuffer
}>()
const { audioBufferA, audioBufferB } = toRefs(props)

// ----------------

const audioCtx = new AudioContext()
let currentPlayingSource: AudioBufferSourceNode | null = null

function killCurrentlyPlayingSource () {
  if (currentPlayingSource) {
    currentPlayingSource.stop()
    currentPlayingSource.disconnect()
    currentPlayingSource = null
  }
}

function play (idx: number) {
  killCurrentlyPlayingSource()
  const source = audioCtx.createBufferSource()
  source.buffer = ((idx === 0) ? audioBufferA : audioBufferB).value
  source.connect(audioCtx.destination)
  source.start()
  currentPlayingSource = source
}

watch([audioBufferA, audioBufferB], killCurrentlyPlayingSource)
onBeforeUnmount(killCurrentlyPlayingSource)

// -------

const emit = defineEmits<{(eventName: 'select', selection: 'A' | 'B'): void}>()
function select (idx: number) {
  emit('select', idx === 0 ? 'A' : 'B')
}

</script>

<template>
<table class='blindtest'>
  <tr>
    <th>A</th><th>B</th>
  </tr>
  <tr>
    <td colspan=2>
      <img src='../assets/test.png'>
    </td>
  </tr>
  <tr>
    <td>
      <button class='play' @click='play(0)'>Play</button>
      <button class='select' @click='select(0)'>Select</button>
    </td>
    <td>
      <button class='play' @click='play(1)'>Play</button>
      <button class='select' @click='select(1)'>Select</button>
    </td>
  </tr>
</table>
</template>

<style lang='scss'>
table.blindtest {
  border-collapse: collapse;
  &, tr, td, th {
    border: 1px solid #666;
  }
  td, th {
    padding: 3px 5px;
  }

  img {
    max-width: 100%;
  }

  button {
    display: block;
    width: 100%;
    &.play {
      padding: 2em;
      margin-bottom: .5em;
    }
  }

}

</style>
