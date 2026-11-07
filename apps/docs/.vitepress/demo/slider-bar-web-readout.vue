<script setup lang="ts">
/** Demo: SnSliderBar — read-out formats. */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const percent = ref(64);
const time = ref(35);
const temp = ref(22);
const gain = ref(-6);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">percent（默认，填充比例）</span>
    <SnSliderBar v-model="percent" show-value aria-label="Volume" />

    <span class="demo-label">value + valueSuffix</span>
    <SnSliderBar
      v-model="time"
      :max="120"
      format="value"
      value-suffix="s"
      show-value
      aria-label="Playback position"
    />

    <span class="demo-label">formatValue（完全自定义）</span>
    <SnSliderBar
      v-model="gain"
      :min="-24"
      :max="12"
      :format-value="(v: number) => `${v > 0 ? '+' : ''}${v} dB`"
      show-value
      tooltip
      placement="bottom-end"
      aria-label="Gain"
    />

    <span class="demo-label">竖排 + tooltipOnly（读数进气泡）</span>
    <div class="demo-row">
      <SnSliderBar
        v-model="temp"
        variant="column"
        :min="16"
        :max="30"
        format="value"
        value-suffix="°"
        show-value
        aria-label="Temperature"
      />
      <SnSliderBar
        v-model="temp"
        variant="column"
        :min="16"
        :max="30"
        format="value"
        value-suffix="°"
        tooltip-only
        aria-label="Temperature (tooltip)"
      />
    </div>

    <span class="demo-log">percent = {{ percent }}% · time = {{ time }}s · gain = {{ gain }} dB</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 420px;
  padding: 12px 0;
}
.demo-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.demo-row {
  display: flex;
  gap: 14px;
  height: 180px;
  margin-top: 6px;
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
