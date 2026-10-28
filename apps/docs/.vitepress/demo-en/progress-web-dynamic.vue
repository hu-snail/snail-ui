<script setup lang="ts">
/**
 * Demo: SnProgress — drive `percentage` from a slider, step buttons and an
 * auto-play timer. The timer is disposed in `onUnmounted` so navigating away
 * never leaves an interval running.
 */
import { computed, onUnmounted, ref } from 'vue';
import { SnButton, SnIcon, SnProgress, SnSlider, registerSnIcons } from '@snui/vue-web';
import { Minus, Pause, Play, Plus, RotateCcw, SlidersHorizontal } from 'lucide-vue-next';

registerSnIcons({ Minus, Pause, Play, Plus, RotateCcw, SlidersHorizontal });

const percentage = ref(45);
const autoPlaying = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const status = computed(() => {
  if (percentage.value >= 100) return 'success';
  if (percentage.value === 0) return 'error';
  return 'default';
});

const statusLabel = computed(() => {
  if (percentage.value >= 100) return 'Completed';
  if (percentage.value === 0) return 'Not started';
  return 'In progress';
});

function clamp(value: number): number {
  return Math.min(100, Math.max(0, Math.round(value)));
}

function step(delta: number): void {
  percentage.value = clamp(percentage.value + delta);
}

function stopTimer(): void {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
  autoPlaying.value = false;
}

function toggleAutoPlay(): void {
  if (autoPlaying.value) {
    stopTimer();
    return;
  }
  autoPlaying.value = true;
  timer = setInterval(() => {
    percentage.value = percentage.value >= 100 ? 0 : clamp(percentage.value + 2);
  }, 120);
}

function reset(): void {
  stopTimer();
  percentage.value = 0;
}

/** Slider drag — pause the auto-play and adopt the dragged value. */
function onSliderInput(v: number | number[]): void {
  stopTimer();
  percentage.value = clamp(typeof v === 'number' ? v : (v[0] ?? 0));
}

onUnmounted(stopTimer);
</script>

<template>
  <div class="progress-dynamic-demo">
    <section class="progress-dynamic-demo__block">
      <h4>Current progress: {{ percentage }}% ({{ statusLabel }})</h4>
      <SnProgress :percentage="percentage" :status="status" :height="10" />
      <SnProgress type="circle" :percentage="percentage" :status="status" />
    </section>

    <section class="progress-dynamic-demo__block">
      <h4>Manual control</h4>
      <div class="progress-dynamic-demo__row">
        <SnButton size="small" icon-name="Minus" @click="step(-10)">Decrease 10%</SnButton>
        <SnButton size="small" icon-name="Plus" @click="step(10)">Increase 10%</SnButton>
        <SnButton size="small" icon-name="RotateCcw" @click="reset">Reset</SnButton>
      </div>
      <div class="progress-dynamic-demo__slider">
        <SnIcon name="SlidersHorizontal" :size="14" />
        <SnSlider
          :model-value="percentage"
          :min="0"
          :max="100"
          :step="1"
          aria-label="Progress percentage"
          @update:model-value="onSliderInput"
        />
      </div>
    </section>

    <section class="progress-dynamic-demo__block">
      <h4>Auto progress</h4>
      <div class="progress-dynamic-demo__row">
        <SnButton
          size="small"
          type="primary"
          :icon-name="autoPlaying ? 'Pause' : 'Play'"
          @click="toggleAutoPlay"
        >
          {{ autoPlaying ? 'Pause' : 'Start' }}
        </SnButton>
      </div>
    </section>
  </div>
</template>

<style scoped>
.progress-dynamic-demo {
  display: grid;
  gap: 20px;
}
.progress-dynamic-demo__block {
  display: grid;
  gap: 12px;
  justify-items: start;
}
.progress-dynamic-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.progress-dynamic-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.progress-dynamic-demo__slider {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 320px;
  color: var(--sn-web-color-text-secondary);
}
</style>
