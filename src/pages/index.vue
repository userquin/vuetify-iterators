<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import type { Mode, Row } from '../composables/iterator'
import { filter, newArray } from '../composables/iterator'

// @ts-expect-error missing types
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const iterators = ref(false)
const now = ref(Date.now())
setInterval(() => {
  now.value = Date.now()
}, 0)
const search = ref<Mode>(1)
const searchMode = computed(() => {
  const mode = search.value
  return mode === 1 ? 'Odd' : mode === 2 ? 'Even' : 'All'
})
const running = ref(false)
const originalList: Row[] = Array.from({ length: 100000 }, (v, i) => ({
  id: i + 1,
  text: `Item ${i + 1}`,
}))
const items = reactive([...originalList])
// const items = shallowRef([...originalList])

async function run() {
  if (running.value) return
  const now = performance.now()
  running.value = true
  let mode = search.value
  switch (mode) {
    case 1:
      mode = 2
      break // odd
    case 2:
      mode = 3
      break // even
    default:
      mode = 1 // all
  }
  search.value = mode
  let current: Row
  if (iterators.value) {
    for /*await*/ (const item of newArray(originalList, mode)) {
      current = items[item.id - 1]!
      if (mode === 1) {
        current.text = `Item ${item.id}`
      }
      else {
        current.text = `Item ${item.id} (Filtered)`
      }
    }
  } else {
    const f = filter(mode)
    for (const item of originalList) {
      current = items[item.id - 1]!
      current.filtered = !f(item)
      if (mode === 1) {
        current.text = `Item ${item.id}`
      }
      else {
        current.text = `Item ${item.id} (Filtered)`
      }
    }
  }
  // items.value = newList
  console.log(performance.now() - now)
  running.value = false
}
</script>
<template>
  <div>
    <div>
      <v-btn @click.passive="run"
      >{{ running ? 'Filtering' : 'Filter'}} ({{searchMode}})</v-btn
      >
      <v-checkbox v-model="iterators" label="Iterators" />
      <br />
      <br />
      {{ now }}
      <br />
      <br />
    </div>
    <RecycleScroller page-mode key-field="id" :item-size="28" :items="items">
      <template #default="{ item }">
        <div style="height: 28px">{{ item.text }}</div>
      </template>
    </RecycleScroller>
  </div>
</template>
