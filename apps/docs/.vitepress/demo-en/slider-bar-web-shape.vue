<script setup lang="ts">
/** Demo: SnSliderBar — shape and thickness. */
import { ref } from 'vue';
import { SnSliderBar } from '@snui/vue-web';

const a = ref(45);
const b = ref(45);
const c = ref(45);
const d = ref(45);
const e = ref(45);
</script>

<template>
  <div class="demo-col">
    <span class="demo-label">radius="4px"（更方正）</span>
    <SnSliderBar v-model="a" radius="4px" show-value aria-label="Square bar" />

    <span class="demo-label">默认圆角（--sn-web-radius-lg）</span>
    <SnSliderBar v-model="b" show-value aria-label="Default bar" />

    <span class="demo-label">radius="9999px"（全圆胶囊）</span>
    <SnSliderBar v-model="c" radius="9999px" show-value aria-label="Pill bar" />

    <span class="demo-label">thickness=28 · radius="9999px"</span>
    <SnSliderBar v-model="d" :thickness="28" radius="9999px" show-value aria-label="Thin bar" />

    <span class="demo-label">thickness=56 · 自定义填充渐变</span>
    <SnSliderBar
      v-model="e"
      :thickness="56"
      fill-background="linear-gradient(90deg, #18a058, #2080f0)"
      show-value
      aria-label="Gradient bar"
    />

    <span class="demo-log">a..e = {{ a }} / {{ b }} / {{ c }} / {{ d }} / {{ e }}</span>
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
.demo-log {
  margin-top: 4px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
