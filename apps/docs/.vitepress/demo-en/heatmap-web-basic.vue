<script setup lang="ts">
/** Demo: SnHeatmap — basic contribution grid with toggles for labels / indicator / loading. */
import { computed, ref } from 'vue'
import { SnHeatmap } from '@snui/vue-web'

const showWeekLabels = ref(true)
const showMonthLabels = ref(true)
const showColorIndicator = ref(true)
const loading = ref(false)

// Deterministic pseudo-random year of activity (seeded LCG, weekend dips).
function generateYearData(): { timestamp: number, value: number }[] {
  const out: { timestamp: number, value: number }[] = []
  const end = new Date()
  const start = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate())
  let seed = 42
  const next = () => {
    seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648
    return seed / 2_147_483_648
  }
  for (let ts = start.getTime(); ts <= end.getTime(); ts += 86_400_000) {
    const day = new Date(ts).getDay()
    const weekend = day === 0 || day === 6
    const value = next() < (weekend ? 0.7 : 0.25) ? 0 : Math.floor(next() ** 2 * 12) + 1
    out.push({ timestamp: ts, value })
  }
  return out
}

const data = computed(generateYearData)
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo-controls">
      <label class="sn-demo-control">
        <input v-model="showWeekLabels" type="checkbox"> Week labels
      </label>
      <label class="sn-demo-control">
        <input v-model="showMonthLabels" type="checkbox"> Month labels
      </label>
      <label class="sn-demo-control">
        <input v-model="showColorIndicator" type="checkbox"> Color legend
      </label>
      <label class="sn-demo-control">
        <input v-model="loading" type="checkbox"> Loading
      </label>
    </div>
    <div class="sn-demo-scroll">
      <SnHeatmap
        :data="data"
        :loading="loading"
        :show-week-labels="showWeekLabels"
        :show-month-labels="showMonthLabels"
        :show-color-indicator="showColorIndicator"
        fill-calendar-leading
      />
    </div>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.sn-demo-control {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}

.sn-demo-scroll {
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
