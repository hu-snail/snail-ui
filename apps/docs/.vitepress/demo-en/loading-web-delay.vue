<script setup lang="ts">
/**
 * loading-web-delay — `delay` suppresses the flash for fast responses.
 *
 * Shows: two identical requests, one with a 600ms delay. The short task ends
 * before the timer fires, so no spinner is ever painted.
 */
import { ref } from 'vue'
import { SnButton, SnLoading } from '@snui/vue-web'

const fastDone = ref(false)
const fastLoading = ref(false)
const slowLoading = ref(false)

function run(target: typeof fastLoading, ms: number): void {
  target.value = true
  setTimeout(() => {
    target.value = false
  }, ms)
}
</script>

<template>
  <div class="ldg-delay">
    <div class="ldg-delay__row">
      <div class="ldg-delay__meta">
        <span class="ldg-delay__cap">No delay, 200ms task</span>
        <span class="ldg-delay__note">The spinner flashes briefly</span>
      </div>
      <div class="ldg-delay__stage">
        <SnLoading :show="fastLoading" description="Loading…">
          <span class="ldg-delay__body">{{ fastDone ? 'Done' : 'Waiting' }}</span>
        </SnLoading>
      </div>
      <SnButton
        size="small"
        @click="run(fastLoading, 200); fastDone = false; setTimeout(() => fastDone = true, 220)"
      >
        Run
      </SnButton>
    </div>

    <div class="ldg-delay__row">
      <div class="ldg-delay__meta">
        <span class="ldg-delay__cap">delay=600, 200ms task</span>
        <span class="ldg-delay__note">The task finishes first; the spinner never appears</span>
      </div>
      <div class="ldg-delay__stage">
        <SnLoading :show="slowLoading" :delay="600" description="Loading…">
          <span class="ldg-delay__body">Content always visible</span>
        </SnLoading>
      </div>
      <SnButton size="small" @click="run(slowLoading, 200)">
        Run
      </SnButton>
    </div>

    <p class="ldg-delay__hint">
      <code>delay</code> prevents a flash of the loading state: when the request returns within the delay, the indicator never renders.
    </p>
  </div>
</template>

<style scoped>
.ldg-delay {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}
.ldg-delay__row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}
.ldg-delay__meta {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 180px;
}
.ldg-delay__cap {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.ldg-delay__note {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.ldg-delay__stage {
  flex: 1 1 260px;
  padding: 20px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.ldg-delay__body {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.ldg-delay__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
