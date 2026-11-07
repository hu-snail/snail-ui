<script setup lang="ts">
/** Demo: SnSliderBar — aurora theme (gradient fill + drifting stars + round thumb). */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const hero = ref(72);
const media = ref(45);
const custom = ref(58);
const still = ref(30);
const dimmer = ref(21);
const sizeSmall = ref(35);
const sizeLarge = ref(70);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">默认（紫蓝渐变 + 星光粒子动效）</span>
    <SnSliderBar v-model="hero" theme="aurora" aria-label="Hero progress" />

    <span class="demo-label">条内文字 + 读数</span>
    <SnSliderBar
      v-model="media"
      theme="aurora"
      label="播放进度"
      suffix="01:24"
      show-value
      format="percent"
      aria-label="Playback"
    />

    <span class="demo-label">自定义渐变（青 → 品红）</span>
    <SnSliderBar
      v-model="custom"
      theme="aurora"
      gradient="linear-gradient(90deg, #22d3ee 0%, #a855f7 55%, #ec4899 100%)"
      show-value
      aria-label="Custom gradient"
    />

    <span class="demo-label">animated=false（保留渐变，关闭动效）</span>
    <SnSliderBar v-model="still" theme="aurora" :animated="false" show-value aria-label="Static" />

    <span class="demo-label">尺寸档位（small 28 / large 52）</span>
    <SnSliderBar v-model="sizeSmall" theme="aurora" size="small" show-value aria-label="Small" />
    <SnSliderBar v-model="sizeLarge" theme="aurora" size="large" show-value aria-label="Large" />

    <span class="demo-label">竖向 aurora（column + 顶部读数）</span>
    <div class="demo-row">
      <SnSliderBar
        v-model="dimmer"
        theme="aurora"
        variant="column"
        show-value
        :min="15"
        :max="30"
        aria-label="Dimmer"
      />
    </div>

    <span class="demo-log">hero = {{ hero }} · media = {{ media }} · custom = {{ custom }}</span>
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
