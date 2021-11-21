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
<table class='table'>
  <tr>
    <th>A<a class='ml-2' href='#' @click='select(0)'>Select</a></th>
    <th>B<a class='ml-2' href='#' @click='select(1)'>Select</a></th>
  </tr>
  <tr>
    <td colspan=2>
      <img src='../assets/test.png'>
    </td>
  </tr>
  <tr>
    <td>
      <button class='button' @click='play(0)'>
        <font-awesome-icon class="mr-1" icon="play-circle" />
        Play
      </button>
    </td>
    <td>
      <button class='button' @click='play(1)'>
        <font-awesome-icon class="mr-1" icon="play-circle" />
        Play
      </button>
    </td>
  </tr>
</table>
</template>

<style lang='scss'>

</style>
