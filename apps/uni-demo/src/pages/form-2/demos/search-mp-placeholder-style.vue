<script setup lang="ts">
/**
 * Demo: sn-search — placeholderStyle / placeholderClass / customClass / customStyle。
 *
 * `placeholder-style` 是内联声明串，`placeholder-class` 是占位伪元素的类名——
 * 两者都只作用于占位文本，不影响输入后的正文。`custom-class` / `custom-style`
 * 落在根包装节点上，用来改外框。
 *
 * 浏览器预览里 `placeholder-style` / `placeholder-class` 是 uni 专有属性，
 * 原生 `<input>` 不识别，因此下面的样式同时用 `::placeholder` 兜住可见效果。
 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const inline = ref('');
const classed = ref('');
const wrapper = ref('snail');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch
      v-model="inline"
      placeholder="内联占位样式"
      placeholder-style="color: var(--sn-mp-color-feedback-danger); font-size: 26rpx;"
    />
    <text class="sn-demo__meta">placeholderStyle：占位文本用内联声明染色</text>

    <SnSearch v-model="classed" placeholder="占位类名" placeholder-class="sn-demo__placeholder" />
    <text class="sn-demo__meta">placeholderClass：占位文本走类名（伪元素上生效）</text>

    <SnSearch
      v-model="wrapper"
      custom-class="sn-demo__search"
      custom-style="border-radius: var(--sn-mp-radius-full); background-color: var(--sn-mp-color-background-soft);"
      placeholder="customClass + customStyle"
    />
    <text class="sn-demo__meta">customClass / customStyle 改根包装的外框与底色</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* custom-class 落在 sn-search 根节点上，需要 :deep 穿透组件边界。 */
.sn-demo :deep(.sn-demo__search) {
  border: 2rpx solid var(--sn-mp-color-border-default);
}
/* 浏览器预览的可见兜底：uni 的 placeholder-class 走伪元素，这里用 ::placeholder 对应。 */
.sn-demo :deep(.sn-demo__placeholder)::placeholder,
.sn-demo :deep(input)::placeholder {
  color: var(--sn-mp-color-text-tertiary);
  font-style: italic;
}
</style>
