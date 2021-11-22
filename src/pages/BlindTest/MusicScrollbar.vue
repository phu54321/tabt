<script setup lang="ts">
import { ref, toRefs, watch, onMounted, onBeforeUnmount } from 'vue'
import quickselect from 'quickselect'

const props = defineProps<{
  audioBuffer: AudioBuffer,
  playPercent: number
}>()
const emit = defineEmits<{(eventName: '@update:playPercent', playPercent: number): void}>()

const { audioBuffer, playPercent } = toRefs(props)
const waveformCanvas = ref<null | HTMLCanvasElement>(null)
const cursorCanvas = ref<null | HTMLCanvasElement>(null)

// ----------------

// Waveform rendering

function renderCanvas () {
  const channel0 = audioBuffer.value.getChannelData(0)
  const { length } = channel0

  const canvas = waveformCanvas.value!
  const { scrollWidth: width, scrollHeight: height } = canvas
  canvas.width = width
  canvas.height = height
  const ctx = waveformCanvas.value!.getContext('2d')!

  const imageData = ctx.createImageData(width, height)
  imageData.data.fill(0xff)

  for (let x = 0; x < width; x++) {
    const startIndex = x * length / width | 0
    const endIndex = (x + 1) * length / width | 0
    const intervalSamples = channel0.slice(startIndex, endIndex)

    let maxSample = -1
    let minSample = 1
    for (const sample of intervalSamples) {
      if (maxSample < sample) maxSample = sample
      if (minSample > sample) minSample = sample
    }
    const intervalLength = intervalSamples.length
    const q1Index = intervalLength * 1 / 4 | 0
    quickselect(intervalSamples, q1Index)
    const q1Sample = intervalSamples[q1Index]

    const q3Index = intervalLength * 3 / 4 | 0
    quickselect(intervalSamples, q3Index)
    const q3Sample = intervalSamples[q3Index]

    // maxSample = 1 → y = 0, minSample = -1 → y = height - 1
    const maxSampleY = ((1 - (maxSample + 1) / 2.0) * (height - 1) + 0.5) | 0
    const minSampleY = ((1 - (minSample + 1) / 2.0) * (height - 1) + 0.5) | 0
    for (let iy = maxSampleY; iy <= minSampleY; iy++) {
      const index = (iy * width + x) * 4
      imageData.data[index + 0] = 160
      imageData.data[index + 1] = 160
      imageData.data[index + 2] = 160
    }

    const q3SampleY = ((1 - (q3Sample + 1) / 2.0) * (height - 1) + 0.5) | 0
    const q1SampleY = ((1 - (q1Sample + 1) / 2.0) * (height - 1) + 0.5) | 0
    for (let iy = q3SampleY; iy <= q1SampleY; iy++) {
      const index = (iy * width + x) * 4
      imageData.data[index + 0] = 96
      imageData.data[index + 1] = 96
      imageData.data[index + 2] = 96
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

onMounted(renderCanvas)
watch(audioBuffer, renderCanvas)

// ----------------

// Cursor rendering part
function renderCursor () {
  const canvas = cursorCanvas.value!
  const { scrollWidth: width, scrollHeight: height } = canvas
  canvas.width = width
  canvas.height = height
  const ctx = cursorCanvas.value!.getContext('2d')!

  const imageData = ctx.createImageData(width, height)
  imageData.data.fill(0)

  let x = (playPercent.value * width + 0.5) | 0
  if (x < 0) x = 0
  if (x >= width) x = width - 1

  for (let iy = 0; iy < height; iy++) {
    const index = (iy * width + x) * 4
    imageData.data[index + 0] = 255
    imageData.data[index + 1] = 170
    imageData.data[index + 2] = 170
    imageData.data[index + 3] = 255
  }
  ctx.putImageData(imageData, 0, 0)
}

onMounted(renderCursor)
watch(playPercent, renderCursor)

function onClick (event: MouseEvent) {
  const canvas = cursorCanvas.value!
  emit('@update:playPercent', event.offsetX / canvas.scrollWidth)
}

// ----------------

// Resize handler

const ro = ref(null as null | ResizeObserver)
onMounted(() => {
  const ob = new ResizeObserver(onResize)
  ob.observe(waveformCanvas.value!)
  ro.value = ob
})

onBeforeUnmount(() => {
  ro.value?.unobserve(waveformCanvas.value!)
})

function onResize () {
  renderCanvas()
  renderCursor()
}

</script>

<template>
<div class="canvas-container">
  <canvas ref='waveformCanvas'></canvas>
  <canvas ref='cursorCanvas' @click='onClick'></canvas>
</div>
</template>

<style lang='scss'>
.canvas-container {
  position: relative;
  outline: 1px solid #eee;
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
  }
}
</style>
