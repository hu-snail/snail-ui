<script setup lang="ts">
/** Demo: SnHeatmap — per-cell hover tooltip (boolean switch, default content). */
import { ref } from 'vue';
import { SnHeatmap } from '@snui/vue-web';

/** Deterministic pseudo-random data over the last ~20 weeks. */
function buildData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Array<{ timestamp: number; value: number }> = [];
  for (let i = 139; i >= 0; i -= 1) {
    const ts = today.getTime() - i * 86_400_000;
    const seed = Math.abs(Math.sin(ts / 86_400_000 + 4.2));
    out.push({ timestamp: ts, value: Math.floor(seed * 12) });
  }
  return out;
}

const data = ref(buildData());
const tooltip = ref(true);
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo-controls">
      <label class="sn-demo-control">
        <input v-model="tooltip" type="checkbox" /> 开启悬浮提示
      </label>
    </div>
    <div class="sn-demo-scroll">
      <SnHeatmap :data="data" :tooltip="tooltip" fill-calendar-leading />
    </div>
    <p class="sn-demo-tip">
      <code>:tooltip="true"</code>（或省略值）时每个格子悬浮展示默认内容「YYYY-MM-DD：数值」； 默认
      <code>false</code> 不渲染任何浮层。
    </p>
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

.sn-demo-tip {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
