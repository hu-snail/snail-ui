<script setup lang="ts">
/** Demo: sn-radio — 卡片模式（variant="card" + card 插槽自定义内容）。 */
import { ref } from 'vue';
import SnRadio from '@snui/uni-src/components/sn-radio/sn-radio.vue';
import SnRadioGroup from '@snui/uni-src/components/sn-radio/sn-radio-group.vue';

const plan = ref<string | number | boolean | undefined>('pro');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnRadioGroup v-model="plan" variant="card">
      <SnRadio value="basic">
        <template #card="{ checked }">
          <text class="plan__title">基础版</text>
          <text class="plan__price">¥0</text>
          <text class="plan__desc">个人项目 · 1 个空间</text>
          <text v-if="checked" class="plan__hint">已选择</text>
        </template>
      </SnRadio>
      <SnRadio value="pro">
        <template #card>
          <text class="plan__title">专业版</text>
          <text class="plan__price">¥99</text>
          <text class="plan__desc">团队协作 · 10 个空间</text>
        </template>
      </SnRadio>
      <SnRadio value="enterprise">
        <template #card>
          <text class="plan__title">企业版</text>
          <text class="plan__price">按需</text>
          <text class="plan__desc">私有部署 · 专属支持</text>
        </template>
      </SnRadio>
    </SnRadioGroup>
    <text class="sn-demo__meta">已选：{{ plan }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.plan__title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.plan__price {
  margin-top: 8rpx;
  font-size: 40rpx;
  font-weight: var(--sn-mp-font-weight-bold);
  color: var(--sn-mp-color-action-primary);
}
.plan__desc {
  margin-top: 4rpx;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
.plan__hint {
  margin-top: 8rpx;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-action-primary);
}
</style>
