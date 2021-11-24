<script setup lang='ts'>
import { ref, reactive, toRefs, onMounted, watch } from 'vue'
import { mergeSort } from '../../utils/asyncSort'
import { shuffle } from '../../utils/shuffle'
import { BlindTest, BlindTestEntry } from './blindTestData'
import ABTest from './ABTest.vue'
import TestResult from './TestResult.vue'
import { pValuedComparator } from './pValuedComparator'
import BulmaModal from './../../utils/BulmaModal.vue'
import TestSplash from './TestSplash.vue'
import * as bulmaToast from 'bulma-toast'

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
  testCount.value = 0

  logs.splice(0, logs.length)
  finalOrder.value = null
  showSplash.value = true

  const entries = blindTest.value.entries
  let sortee = shuffle(Array.from(Array(entries.length).keys()))
  async function comparator (left: number, right: number): Promise<number> {
    logs.push(`Compare ${entries[left].label}(1) vs ${entries[right].label}(2)`)
    const ret = await pValuedComparator(entries[left], entries[right], comparatorSingle)
    let labeledMessage: string
    let unlabeledMessage: string
    if (ret < 0) {
      labeledMessage = `${entries[left].label} < ${entries[right].label} (p-value = ${-ret.toFixed(3)})`
      unlabeledMessage = `#${left} < #${right} (p-value = ${-ret.toFixed(3)})`
    } else {
      labeledMessage = `${entries[left].label} > ${entries[right].label} (p-value = ${ret.toFixed(3)})`
      unlabeledMessage = `#${left} > #${right} (p-value = ${ret.toFixed(3)})`
    }
    logs.push(labeledMessage)
    emit('log', labeledMessage)
    bulmaToast.toast({
      message: unlabeledMessage,
      type: 'is-success',
      animate: { in: 'fadeIn', out: 'fadeOut' }
    })
    return ret
  }
  sortee = await mergeSort(sortee, comparator)

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
const testCount = ref(0)

function comparatorSingle (left: BlindTestEntry, right: BlindTestEntry): Promise<number> {
  const coin = Math.random() < 0.5
  const soundA = coin ? left.wavData : right.wavData
  const soundB = coin ? right.wavData : left.wavData

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
        logs.push(
          result === 1 ? '(1) > (2)' : '(1) < (2)'
        )
        resolve(result)
      }
    }
    abTestDataPending.push(data)
  })
}

</script>

<template>

<p class="title has-text-centered">소리가 더 좋은걸 고르세요.</p>
<p class="mt-1 subtitle has-text-centered">Test #{{testCount}}</p>
<ABTest
  v-if='abTestDataPending.length > 0'
  :waveform-audio-buffer="blindTest.entries[0].wavData"
  :audio-buffer-a='abTestDataPending[0].soundA'
  :audio-buffer-b='abTestDataPending[0].soundB'
  @select='abTestDataPending[0]?.resolve'
/>

<bulma-modal :show='finalOrder'>
  <TestResult :entries='blindTest.entries' :final-order='finalOrder!' :logs='logs' />
</bulma-modal>

<bulma-modal :show='showSplash'>
  <TestSplash :test='blindTest' @close='showSplash = false' />
</bulma-modal>
</template>
