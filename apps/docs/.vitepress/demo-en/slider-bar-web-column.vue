<script setup lang="ts">
/** Demo: SnSliderBar — variant="column" vertical bar (reading merged into the track top). */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const dimmer = ref(21);
const warm = ref(3200);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">竖排亮度（column，读数并入轨道顶部）</span>
    <div class="demo-row">
      <SnSliderBar
        v-model="dimmer"
        variant="column"
        show-value
        :min="15"
        :max="30"
        aria-label="Dimmer"
      />
      <SnSliderBar
        v-model="warm"
        variant="column"
        :min="2700"
        :max="6500"
        :step="100"
        format="value"
        value-suffix="K"
        tooltip-only
        aria-label="Color temperature"
        style="--sn-slider-bar-column-width: 64px"
      />
    </div>
    <span class="demo-log">dimmer = {{ dimmer }} · warm = {{ warm }}K</span>
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
.demo-row {
  display: flex;
  gap: 14px;
  height: 190px;
  margin-top: 6px;
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
