<script setup lang="ts">
/** Demo: SnSliderBar — capsule slider across its real scenarios.
 *  bar: media volume / playback progress / price range (dual handles).
 *  column: light dimmer / thermostat (fade + tooltip-only read-out). */
import { ref, computed } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const volume = ref(64);
const progress = ref(35);
const price = ref<[number, number]>([120, 480]);
const dimmer = ref(21);
const warm = ref(3200);

const priceLabel = computed(() => `¥${price.value[0]} – ¥${price.value[1]}`);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">Volume（#icon 插槽，默认不渲染图标）</span>
    <SnSliderBar v-model="volume" show-value aria-label="Volume">
      <template #icon>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
          <path d="M4 9h3l4-4v14l-4-4H4z" />
          <path
            d="M16 8.5a5 5 0 0 1 0 7"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
          <path
            d="M18.6 6a8.5 8.5 0 0 1 0 12"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
      </template>
    </SnSliderBar>

    <span class="demo-label">播放进度（format="value" + valueSuffix）</span>
    <SnSliderBar
      v-model="progress"
      :max="120"
      format="value"
      value-suffix="s"
      show-value
      aria-label="Playback position"
    />

    <span class="demo-label">价格区间（range 双柄 + 自定义读数）</span>
    <SnSliderBar
      v-model="price"
      range
      :min="0"
      :max="1000"
      :step="10"
      show-value
      :format-value="() => priceLabel"
      aria-label="Price range"
    />

    <span class="demo-label">禁用 / 只读 / 反向</span>
    <SnSliderBar v-model="volume" show-value disabled aria-label="Disabled volume" />
    <SnSliderBar v-model="volume" show-value reverse aria-label="Reversed volume" />

    <span class="demo-label">column 竖排：亮度 / 色温</span>
    <div class="demo-row">
      <SnSliderBar v-model="dimmer" variant="column" show-value :min="15" :max="30" aria-label="Dimmer" />
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

    <span class="demo-log">
      volume = {{ volume }}% · progress = {{ progress }}s · {{ priceLabel }} · dimmer = {{ dimmer }}
    </span>
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
  height: 190px;
  margin-top: 6px;
}
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
