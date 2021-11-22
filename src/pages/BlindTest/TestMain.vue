<script setup lang='ts'>
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import { shellSort } from '../../utils/asyncSort'
import { shuffle } from '../../utils/shuffle'
import { BlindTest, BlindTestEntry } from './blindTestData'
import ABTest from './ABTest.vue'
import TestResult from './TestResult.vue'
import { pValuedComparator } from './pValuedComparator'
import BulmaModal from './../../utils/BulmaModal.vue'
import TestSplash from './TestSplash.vue'

const props = defineProps<{
  blindTest: BlindTest
}>()

const logs = reactive([] as string[])
const finalOrder = ref(null as null | number[])

// eslint-disable-next-line func-call-spacing
const emit = defineEmits<{
  (eventName: 'log', message: string): void,
  (eventName: 'completed', order: number[]): void
}>()

const { blindTest } = toRefs(props)
const showSplash = ref(true)

/// ////////////////////
onMounted(reset)
watch(blindTest, reset)

async function reset () {
  logs.splice(0, logs.length)
  finalOrder.value = null
  showSplash.value = true

  const entries = blindTest.value.entries
  const sortee = shuffle(Array.from(Array(entries.length).keys()))
  async function comparator (left: number, right: number): Promise<number> {
    console.log(`Compare #${left} vs #${right}`)
    const ret = await pValuedComparator(entries[left], entries[right], comparatorSingle)
    let message: string
    if (ret < 0) {
      message = `#${left} < #${right} (p-value = ${-ret.toFixed(3)})`
    } else {
      message = `#${left} > #${right} (p-value = ${ret.toFixed(3)})`
    }
    logs.push(message)
    emit('log', message)
    return ret
  }
  await shellSort(sortee, comparator)

  emit('completed', sortee)
  finalOrder.value = sortee
}

/// ////////////////////
interface ABTestData {
  soundA: AudioBuffer
  soundB: AudioBuffer
  resolve: (ret: 'A' | 'B') => void
}

const abTestDataPending = reactive([] as ABTestData[])

function comparatorSingle (left: BlindTestEntry, right: BlindTestEntry): Promise<number> {
  const coin = Math.random() < 0.5
  const soundA = coin ? left.wavData : right.wavData
  const soundB = coin ? right.wavData : left.wavData
  return new Promise(resolve => {
    const data: ABTestData = {
      soundA,
      soundB,
      resolve: function (e) {
        console.log(`Selected ${e}`) // TODO: make to toast
        const idx = abTestDataPending.indexOf(data)
        abTestDataPending.splice(idx, 1)
        if (e === 'A') resolve(coin ? -1 : 1)
        else resolve(coin ? 1 : -1)
      }
    }
    abTestDataPending.push(data)
  })
}

</script>

<template>
<ABTest
  v-if='abTestDataPending.length > 0'
  :waveform-audio-buffer="blindTest.entries[0].wavData"
  :audio-buffer-a='abTestDataPending[0].soundA'
  :audio-buffer-b='abTestDataPending[0].soundB'
  @select='abTestDataPending[0]?.resolve'
>
</ABTest>

<bulma-modal :show='finalOrder'>
  <TestResult :entries='blindTest.entries' :final-order='finalOrder!' :logs='logs' />
</bulma-modal>

<bulma-modal :show='showSplash'>
  <TestSplash :test='blindTest' @close='showSplash = false' />
</bulma-modal>
</template>
