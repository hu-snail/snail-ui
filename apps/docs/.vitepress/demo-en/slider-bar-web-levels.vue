<script setup lang="ts">
/** Demo: SnSliderBar — level scenes (gain / fan speed / taste) + edge glyphs. */
import { ref, computed } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

/** 0–100 mapped onto 5 discrete levels; the caption reads the level. */
const SPEED = [
  { value: 0, label: '关闭' },
  { value: 25, label: '1 档' },
  { value: 50, label: '2 档' },
  { value: 75, label: '3 档' },
  { value: 100, label: '最大' },
];

const speed = ref(50);
const taste = ref(33);
const volume = ref(40);

const TASTE = computed(() => [
  { value: -40, label: '苦涩' },
  { value: -10, label: '微苦' },
  { value: 10, label: '适中' },
  { value: 30, label: '甜' },
  { value: 40, label: '很甜' },
]);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">风扇档位（levels + 刻度，读数显示档名）</span>
    <SnSliderBar
      v-model="speed"
      theme="aurora"
      :levels="SPEED"
      :step="25"
      label="风速"
      show-value
      aria-label="Fan speed"
    />

    <span class="demo-label">甜度（负值区间，刻度随区间分布）</span>
    <SnSliderBar
      v-model="taste"
      :min="-40"
      :max="40"
      :step="10"
      :levels="TASTE"
      leading-icon="Minus"
      trailing-icon="Plus"
      show-value
      aria-label="Sweetness"
    />

    <span class="demo-label">头尾图标 + 拖动到不同档位</span>
    <SnSliderBar
      v-model="volume"
      leading-icon="Volume1"
      trailing-icon="Volume2"
      label="音量"
      show-value
      aria-label="Volume"
    />

    <span class="demo-log">
      speed = {{ speed }}（{{ SPEED.find((l) => l.value === speed)?.label ?? '—' }}）· taste =
      {{ taste }}（{{ TASTE.find((l) => l.value === taste)?.label ?? '—' }}）
    </span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 460px;
  padding: 12px 0;
}
.demo-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
