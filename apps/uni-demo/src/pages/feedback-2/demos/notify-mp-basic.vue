<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — 语义色卡片通知（default / primary / success /
 * warning / danger）+ 一键清空。
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';
import type { SnNotifyInstance, SnNotifyOptions } from '@snui/uni-src/components/sn-notify/sn-notify-types';

const notify = ref<SnNotifyInstance | null>(null);

const CASES: Array<SnNotifyOptions & { label: string }> = [
  {
    label: 'default 通知',
    title: '加入团队',
    description: 'Junior Garcia 邀请你加入 HeroUI 团队',
  },
  {
    label: 'primary 通知',
    type: 'primary',
    title: '剩余额度 2 条',
    description: '升级付费计划获取更多额度',
  },
  {
    label: 'success 通知',
    type: 'success',
    title: '升级成功',
    description: '可以继续使用全部功能了',
  },
  {
    label: 'warning 通知',
    type: 'warning',
    title: '额度已用尽',
    description: '升级付费计划后才能继续使用',
  },
  {
    label: 'danger 通知',
    type: 'danger',
    title: '网络异常',
    description: '请求失败，请检查网络后重试',
  },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton
      v-for="item in CASES"
      :key="item.label"
      :type="item.type ?? 'default'"
      variant="soft"
      block
      @tap="notify?.show(item)"
    >
      {{ item.label }}
    </SnButton>
    <SnButton type="danger" variant="soft" block @tap="notify?.hideAll()">
      清空全部通知
    </SnButton>

    <SnNotify ref="notify" custom-class="sn-demo-contained" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}
</style>
