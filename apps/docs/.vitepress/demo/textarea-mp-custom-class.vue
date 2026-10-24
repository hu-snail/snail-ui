<script setup lang="ts">
/** Demo: sn-textarea — customClass / customStyle / customTextareaClass 三个挂载点。 */
import { ref } from 'vue'
import SnTextarea from '@snui/uni-src/components/sn-textarea/sn-textarea.vue'

const value = ref('根节点类名 + 内联样式 + 内层 textarea 类名')
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">customClass + customStyle</text>
    <SnTextarea
      v-model="value"
      custom-class="sn-demo__textarea"
      custom-style="background-color: var(--sn-mp-color-background-soft);"
    />

    <text class="sn-demo__title">customTextareaClass（作用在内层原生 textarea 上）</text>
    <SnTextarea v-model="value" custom-textarea-class="sn-demo__native" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__textarea {
  border-radius: var(--sn-mp-radius-lg);
}

.sn-demo__native {
  letter-spacing: 1rpx;
}
</style>
