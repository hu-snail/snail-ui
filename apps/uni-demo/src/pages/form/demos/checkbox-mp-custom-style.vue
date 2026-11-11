<script setup lang="ts">
/** Demo: sn-checkbox — 自定义样式（customClass / customStyle）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';

const styled = ref<boolean>(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCheckbox
      v-model="styled"
      custom-class="sn-demo__check"
      custom-style="padding: 8rpx 16rpx; border-radius: var(--sn-mp-radius-md);"
    >
      customClass + customStyle
    </SnCheckbox>
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
/* custom-class 落在组件内部节点上，需要 :deep 穿透。 */
.sn-demo :deep(.sn-demo__check) {
  background-color: var(--sn-mp-color-background-soft);
}
</style>
