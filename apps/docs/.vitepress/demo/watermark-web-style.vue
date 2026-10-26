<script setup lang="ts">
/**
 * Demo: SnWatermark — live customisation of fontSize / rotate / opacity /
 * fontColor through the surrounding controls.
 *
 * Note: `fontColor` is painted into a canvas tile, so it stays a real CSS
 * colour value; the surrounding chrome uses `--sn-web-*` tokens.
 */
import { ref } from 'vue';
import { SnWatermark } from '@snui/vue-web';

const fontSize = ref(14);
const rotate = ref(-24);
const opacity = ref(0.5);
const fontColor = ref('rgba(14, 128, 235, 0.32)');

const colorPresets = [
  { label: '品牌蓝', value: 'rgba(14, 128, 235, 0.32)' },
  { label: '中性灰', value: 'rgba(96, 98, 122, 0.34)' },
  { label: '警示红', value: 'rgba(208, 48, 80, 0.3)' },
];
</script>

<template>
  <div class="watermark-style-demo">
    <section class="watermark-style-demo__controls">
      <label class="watermark-style-demo__field">
        <span>fontSize：{{ fontSize }}px</span>
        <input v-model.number="fontSize" type="range" min="10" max="28" step="1" />
      </label>

      <label class="watermark-style-demo__field">
        <span>rotate：{{ rotate }}°</span>
        <input v-model.number="rotate" type="range" min="-90" max="90" step="1" />
      </label>

      <label class="watermark-style-demo__field">
        <span>opacity：{{ opacity.toFixed(2) }}</span>
        <input v-model.number="opacity" type="range" min="0.1" max="1" step="0.05" />
      </label>

      <div class="watermark-style-demo__field">
        <span>fontColor</span>
        <div class="watermark-style-demo__presets">
          <button
            v-for="preset in colorPresets"
            :key="preset.label"
            type="button"
            class="watermark-style-demo__preset"
            :class="{ 'watermark-style-demo__preset--active': fontColor === preset.value }"
            @click="fontColor = preset.value"
          >
            {{ preset.label }}
          </button>
        </div>
      </div>
    </section>

    <SnWatermark
      content="蜗牛 AUI · 内部资料"
      :font-size="fontSize"
      :line-height="fontSize + 6"
      :rotate="rotate"
      :opacity="opacity"
      :font-color="fontColor"
      :width="200"
      :height="120"
      font-weight="600"
    >
      <div class="watermark-style-demo__panel">
        <h5>样式定制预览</h5>
        <p>
          字号、行高、旋转、透明度与字色都可以实时调整；瓦片尺寸固定为 200 ×
          120，文字始终以瓦片中心旋转。
        </p>
      </div>
    </SnWatermark>
  </div>
</template>

<style scoped>
.watermark-style-demo {
  display: grid;
  gap: 20px;
}
.watermark-style-demo__controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px 24px;
}
.watermark-style-demo__field {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.watermark-style-demo__field input {
  accent-color: var(--sn-web-color-action-primary);
}
.watermark-style-demo__presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.watermark-style-demo__preset {
  padding: 4px 10px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
  background: var(--sn-web-color-background-subtle);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  cursor: pointer;
}
.watermark-style-demo__preset--active {
  color: var(--sn-web-color-action-primary);
  border-color: var(--sn-web-color-action-primary);
}
.watermark-style-demo__panel {
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-card-radius);
  background: var(--sn-web-color-background-surface);
  padding: 20px 24px;
  min-height: 200px;
}
.watermark-style-demo__panel h5 {
  margin: 0 0 10px;
  font-size: 15px;
  color: var(--sn-web-color-text-primary);
}
.watermark-style-demo__panel p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
