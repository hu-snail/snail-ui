<script setup lang="ts">
/**
 * Demo: sn-steps — English shadow of steps-mp-slots.
 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Star } from '@snui/uni-src/components/sn-icon/sn-icon-set';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSteps :active="0" vertical space="24rpx">
      <SnStep>
        <template #icon>
          <SnIcon :icon="Star" :size="'var(--sn-mp-icon-size-small)'" class="sn-demo__slot-icon" />
        </template>
        <template #title>
          <text class="sn-demo__title">Custom title</text>
        </template>
        <template #description>
          <text class="sn-demo__desc">The description slot accepts any structure</text>
        </template>
      </SnStep>
      <SnStep title="Plain step" description="Default rendering" />
    </SnSteps>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__slot-icon {
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__title {
  font-size: 26rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__desc {
  font-size: 22rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
