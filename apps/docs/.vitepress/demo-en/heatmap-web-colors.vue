<script setup lang="ts">
/** Demo: SnHeatmap — custom minimum color and custom level colors. */
import { ref } from 'vue';
import { SnHeatmap } from '@snui/vue-web';

const size = ref<'small' | 'medium' | 'large'>('medium');

/** Deterministic pseudo-random data over the last ~20 weeks. */
function buildData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Array<{ timestamp: number; value: number }> = [];
  for (let i = 139; i >= 0; i -= 1) {
    const ts = today.getTime() - i * 86_400_000;
    const seed = Math.abs(Math.sin(ts / 86_400_000 + 1.3));
    out.push({ timestamp: ts, value: Math.floor(seed * 12) });
  }
  return out;
}

const data = ref(buildData());

// 预置的自定义色阶（从浅到深），仅作用于本演示。
const palettePresets = [
  { name: 'Custom green', active: ['#d8f3dc', '#95d5b2', '#40916c', '#1b4332'] },
  { name: 'Custom orange', active: ['#ffedd5', '#fdba74', '#ea580c', '#7c2d12'] },
];
const activeColors = ref<string[]>([...(palettePresets[0]?.active ?? [])]);
const minimumColor = ref('#f0f1f5');

function pickPreset(index: number) {
  const preset = palettePresets[index];
  if (!preset) return;
  activeColors.value = [...preset.active];
}
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__controls">
      <span class="sn-demo__label">Custom color scales:</span>
      <button
        v-for="(preset, index) in palettePresets"
        :key="preset.name"
        type="button"
        class="sn-demo__btn"
        @click="pickPreset(index)"
      >
        {{ preset.name }}
      </button>
      <label class="sn-demo__label">
        Size:
        <select v-model="size" class="sn-demo__select" aria-label="Size">
          <option value="small">Small</option>
          <option value="medium">Middle</option>
          <option value="large">Large</option>
        </select>
      </label>
    </div>
    <div class="sn-demo__scroller">
      <SnHeatmap
        :data="data"
        :size="size"
        :active-colors="activeColors"
        :minimum-color="minimumColor"
      />
    </div>
    <div class="sn-demo__scroller">
      <SnHeatmap :data="data" :size="size" />
    </div>
    <p class="sn-demo__tip">
      Top: custom via active-colors + minimum-color; bottom: default scale.
    </p>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.sn-demo__label,
.sn-demo__tip {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.sn-demo__btn {
  height: 28px;
  padding: 0 10px;
  /* Control edge per the global spec: ~12% ink over surface (naive borderColor), not --sn-web-color-border-default. */
  border: 1px solid
    color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: 3px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font: inherit;
  cursor: pointer;
}

.sn-demo__btn:hover {
  background: var(--sn-web-color-background-subtle);
}

.sn-demo__select {
  height: 28px;
  padding: 0 8px;
  border: 1px solid
    color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: 3px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-secondary);
  font: inherit;
}

.sn-demo__scroller {
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
