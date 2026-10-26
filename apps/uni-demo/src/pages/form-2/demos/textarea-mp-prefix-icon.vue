<script setup lang="ts">
/** Demo: sn-textarea — 前置图标（registry 名 / CSS 类）与占位符样式。 */
import { ref } from 'vue';
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Edit } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ Edit });

const registry = ref('');
const cssClass = ref('');
const styled = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">prefixIcon（经 sn-icon registry 解析）</text>
    <SnTextarea v-model="registry" prefix-icon="Edit" placeholder="带前置图标的文本域" />

    <text class="sn-demo__title">iconPrefix + cssIcon（直接当 CSS 类名，不走 registry）</text>
    <SnTextarea
      v-model="cssClass"
      icon-prefix="sn-demo__icon"
      css-icon
      placeholder="前置图标是 CSS 类"
    />

    <text class="sn-demo__title">placeholderStyle + placeholderClass</text>
    <SnTextarea
      v-model="styled"
      placeholder-style="font-style: italic; color: var(--sn-mp-color-feedback-danger);"
      placeholder-class="sn-demo__placeholder"
      placeholder="斜体占位符 + 自定义占位符类"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__icon {
  display: inline-flex;
  width: 32rpx;
  height: 32rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
}

.sn-demo__placeholder {
  font-size: 26rpx;
  color: var(--sn-mp-color-feedback-warning);
}
</style>
