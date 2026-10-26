<script setup lang="ts">
/** Demo: SnHeatmap — the five built-in color themes. */
import { ref } from 'vue';
import { SnHeatmap } from '@snui/vue-web';

type DemoColorTheme = 'green' | 'blue' | 'orange' | 'purple' | 'red';

const themes: Array<{ name: string; value: DemoColorTheme }> = [
  { name: 'Green', value: 'green' },
  { name: 'Blue', value: 'blue' },
  { name: 'Orange', value: 'orange' },
  { name: 'Purple', value: 'purple' },
  { name: 'Red', value: 'red' },
];

/** Deterministic pseudo-random data over the last ~20 weeks. */
function buildData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Array<{ timestamp: number; value: number }> = [];
  for (let i = 139; i >= 0; i -= 1) {
    const ts = today.getTime() - i * 86_400_000;
    const seed = Math.abs(Math.sin(ts / 86_400_000 + 0.5));
    out.push({ timestamp: ts, value: Math.floor(seed * 12) });
  }
  return out;
}

const data = ref(buildData());
</script>

<template>
  <div class="sn-demo">
    <section v-for="theme in themes" :key="theme.value" class="sn-demo__section">
      <h4 class="sn-demo__title">{{ theme.name }}</h4>
      <div class="sn-demo__scroller">
        <SnHeatmap :data="data" :color-theme="theme.value" size="small" />
      </div>
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sn-demo__section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sn-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary);
}

.sn-demo__scroller {
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
}
</style>
