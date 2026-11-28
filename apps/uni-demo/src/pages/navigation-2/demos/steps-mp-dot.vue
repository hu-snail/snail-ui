<script setup lang="ts">
/** Demo: sn-steps — 点状步骤条（dot）。 */
import SnSteps from '@snui/uni-src/components/sn-steps/sn-steps.vue';
import SnStep from '@snui/uni-src/components/sn-steps/sn-step.vue';
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSteps :active="2" dot align-center>
      <SnStep title="注册" />
      <SnStep title="登录" />
      <SnStep title="完成" />
    </SnSteps>
    <text class="sn-demo__meta">dot 把指示器换成圆点。</text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  width: 100%;
}
/* MP / App drop flex gap: spacing rides on margins (§116). */
.sn-demo__meta {
  margin-top: 12px;
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
