<script setup lang="ts">
import { ref, toRefs, onBeforeUnmount, watch } from 'vue'
import MusicScrollbar from './MusicScrollbar.vue'

const props = defineProps<{
  waveformAudioBuffer: AudioBuffer,
  audioBufferA: AudioBuffer,
  audioBufferB: AudioBuffer
}>()
const { waveformAudioBuffer, audioBufferA, audioBufferB } = toRefs(props)

// ----------------

const audioCtx = new AudioContext()
let currentPlayingSource: AudioBufferSourceNode | null = null
let currentPlayingStartTimestamp = 0
let playbackStartPercent = 0

function killCurrentlyPlayingSource () {
  if (currentPlayingSource) {
    currentPlayingSource.stop()
    currentPlayingSource.disconnect()
    currentPlayingSource = null
  }
}

function play (idx: number | null) {
  let buffer: AudioBuffer
  if (idx === null) {
    if (currentPlayingSource === null) return
    buffer = currentPlayingSource.buffer!
  } else {
    buffer = ((idx === 0) ? audioBufferA : audioBufferB).value
  }

  killCurrentlyPlayingSource()
  const source = audioCtx.createBufferSource()
  source.buffer = buffer
  source.connect(audioCtx.destination)
  source.start(0, source.buffer!.duration * playbackStartPercent)
  currentPlayingSource = source
  currentPlayingStartTimestamp = Date.now() / 1000.0 - source.buffer!.duration * playbackStartPercent
}

watch([audioBufferA, audioBufferB], resetTestSession)
onBeforeUnmount(resetTestSession)

// -------

// Audio time track
const currentPlaybackPercent = ref(0)
const timer = setInterval(updateAudioProgress, 0.1)
onBeforeUnmount(() => clearInterval(timer))

function updateAudioProgress () {
  if (currentPlayingSource) {
    const elapsedTime = Date.now() / 1000.0 - currentPlayingStartTimestamp
    currentPlaybackPercent.value = elapsedTime / currentPlayingSource.buffer!.duration
  }
}

function updatePlaybackStart (start: number) {
  playbackStartPercent = start
  currentPlaybackPercent.value = start
  play(null)
}

// -------

function resetTestSession () {
  killCurrentlyPlayingSource()
  currentPlaybackPercent.value = 0
  currentPlayingStartTimestamp = 0
  playbackStartPercent = 0
}

// -------

const emit = defineEmits<{(eventName: 'select', selection: 'A' | 'B'): void}>()
function select (idx: number) {
  emit('select', idx === 0 ? 'A' : 'B')
}

</script>

<template>
<table class='table abtest'>
  <tr>
    <th>A<a class='ml-2' href='#' @click='select(0)'>Select</a></th>
    <th>B<a class='ml-2' href='#' @click='select(1)'>Select</a></th>
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
<MusicScrollbar class='music-scroll is-full' :audio-buffer="waveformAudioBuffer" :play-percent='currentPlaybackPercent' @@update:play-percent="updatePlaybackStart" />
</template>

<style lang='scss'>
.music-scroll {
  height: 300px;
}

.abtest {
  margin-left: auto;
  margin-right: auto;
}

</style>
