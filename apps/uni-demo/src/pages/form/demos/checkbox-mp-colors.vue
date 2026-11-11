<script setup lang="ts">
/** Demo: sn-checkbox — 选中颜色（checkedColor / uncheckedColor）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';

const colored = ref<boolean>(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnCheckbox
      v-model="colored"
      checked-color="var(--sn-mp-color-feedback-success)"
      unchecked-color="var(--sn-mp-color-border-default)"
    >
      checkedColor / uncheckedColor
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
</style>
