<script setup lang='ts'>
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import { mergeSort } from '../../utils/asyncSort'
import { shuffle } from '../../utils/shuffle'
import { type BlindTest, type BlindTestEntry, type ComparionResult } from './blindTestData'
import ABTest from './ABTest.vue'
import TestResult from './TestResult.vue'
import TestProgress from './TestProgress.vue'
import { pValuedComparator } from './pValuedComparator'
import BulmaModal from './../../utils/BulmaModal.vue'
import TestSplash from './TestSplash.vue'
import * as bulmaToast from 'bulma-toast'

const props = defineProps<{
  blindTest: BlindTest
}>()

const logs = reactive([] as ComparionResult[])
const finalOrder = ref(null as null | number[])

// eslint-disable-next-line func-call-spacing
const { blindTest } = toRefs(props)
const showSplash = ref(true)

/// ////////////////////
onMounted(reset)
watch(blindTest, reset)

async function reset () {
  testCount.value = 0

  logs.splice(0, logs.length)
  finalOrder.value = null
  showSplash.value = true

  const entries = blindTest.value.entries
  let sortee = shuffle(Array.from(Array(entries.length).keys()))
  async function comparator (left: number, right: number): Promise<number> {
    const ret = await pValuedComparator(left, right, (l, r) => comparatorSingle(l, r, entries))
    let unlabeledMessage: string
    if (ret < 0) {
      unlabeledMessage = `#${left} < #${right} (p-value = ${-ret.toFixed(3)})`
    } else {
      unlabeledMessage = `#${left} > #${right} (p-value = ${ret.toFixed(3)})`
    }
    bulmaToast.toast({
      message: unlabeledMessage,
      type: 'is-success',
      animate: { in: 'fadeIn', out: 'fadeOut' }
    })
    return ret
  }
  sortee = await mergeSort(sortee, comparator)
  finalOrder.value = sortee
}

/// ////////////////////
interface ABTestData {
  soundA: AudioBuffer
  soundB: AudioBuffer
  resolve: (ret: 'A' | 'B') => void
}

const abTestDataPending = reactive([] as ABTestData[])
const testCount = ref(0)

function comparatorSingle (leftIndex: number, rightIndex: number, entries: BlindTestEntry[]): Promise<number> {
  const coin = Math.random() < 0.5
  const leftEntry = entries[leftIndex]
  const rightEntry = entries[rightIndex]

  const soundA = coin ? leftEntry.wavData : rightEntry.wavData
  const soundB = coin ? rightEntry.wavData : leftEntry.wavData

  testCount.value++

  return new Promise(resolve => {
    const data: ABTestData = {
      soundA,
      soundB,
      resolve: function (e) {
        bulmaToast.toast({
          message: `Selected ${e}`,
          type: 'is-info',
          animate: { in: 'fadeIn', out: 'fadeOut' }
        })
        const idx = abTestDataPending.indexOf(data)
        abTestDataPending.splice(idx, 1)
        const result =
          (e === 'A')
            ? (coin ? 1 : -1)
            : (coin ? -1 : 1)
        logs.push({
          leftCandidate: leftIndex,
          rightCandidate: rightIndex,
          leftHigher: (result === 1)
        })
        resolve(result)
      }
    }
    abTestDataPending.push(data)
  })
}

</script>

<template>
<p class="title has-text-centered">소리가 더 좋은걸 고르세요.</p>
<TestProgress :entries="blindTest.entries" :logs="logs" />
<p class="mt-1 subtitle has-text-centered">Test #{{testCount}}</p>
<transition name="abtest-fadein">
  <ABTest
    v-if='abTestDataPending.length > 0'
    :key = testCount
    :waveform-audio-buffer="blindTest.entries[0].wavData"
    :audio-buffer-a='abTestDataPending[0].soundA'
    :audio-buffer-b='abTestDataPending[0].soundB'
    @select='abTestDataPending[0]?.resolve'
  />
</transition>

<bulma-modal :show='finalOrder'>
  <TestResult :entries='blindTest.entries' :final-order='finalOrder!' :logs='logs' />
</bulma-modal>

<bulma-modal :show='showSplash'>
  <TestSplash :test='blindTest' @close='showSplash = false' />
</bulma-modal>
</template>

<style>
.abtest-fadein-enter-active {
  transition: opacity 0.3s;
}
.abtest-fadein-enter-from {
  opacity: 0.8;
}
.abtest-fadein-leave-active {
  display: none;
}
</style>
