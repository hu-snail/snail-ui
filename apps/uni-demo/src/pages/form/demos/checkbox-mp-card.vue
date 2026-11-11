<script setup lang="ts">
/** Demo: sn-checkbox — 卡片模式（variant="card" + card 插槽）。 */
import { ref } from 'vue';
import SnCheckbox from '@snui/uni-src/components/sn-checkbox/sn-checkbox.vue';
import SnCheckboxGroup from '@snui/uni-src/components/sn-checkbox/sn-checkbox-group.vue';

const picked = ref<Array<string | number | boolean>>(['mail']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnCheckboxGroup v-model="picked" variant="card">
      <SnCheckbox name="mail">
        <template #card="{ checked }">
          <text class="opt__title">邮件通知</text>
          <text class="opt__desc">每日摘要 · 可随时关闭</text>
          <text v-if="checked" class="opt__hint">已开启</text>
        </template>
      </SnCheckbox>
      <SnCheckbox name="sms">
        <template #card>
          <text class="opt__title">短信通知</text>
          <text class="opt__desc">仅重要提醒</text>
        </template>
      </SnCheckbox>
      <SnCheckbox name="push">
        <template #card>
          <text class="opt__title">推送通知</text>
          <text class="opt__desc">实时推送到设备</text>
        </template>
      </SnCheckbox>
    </SnCheckboxGroup>
    <text class="sn-demo__meta">已选：{{ picked.join('、') || '（无）' }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.opt__title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.opt__desc {
  margin-top: 4rpx;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}
.opt__hint {
  margin-top: 8rpx;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-action-primary);
}
</style>
