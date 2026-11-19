<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — semantic card notifications (default / primary /
 * success / warning / danger) + hide-all.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';
import type { SnNotifyInstance, SnNotifyOptions } from '@snui/uni-src/components/sn-notify/sn-notify-types';

const notify = ref<SnNotifyInstance | null>(null);

const CASES: Array<SnNotifyOptions & { label: string }> = [
  {
    label: 'Default toast',
    title: 'Join a team',
    description: 'Junior Garcia sent you an invitation to join HeroUI team!',
  },
  {
    label: 'Accent toast',
    type: 'primary',
    title: 'You have 2 credits left',
    description: 'Get a paid plan for more credits',
  },
  {
    label: 'Success toast',
    type: 'success',
    title: 'Plan upgraded',
    description: 'You can continue using HeroUI Chat and more',
  },
  {
    label: 'Warning toast',
    type: 'warning',
    title: 'No credits left',
    description: 'Upgrade to a paid plan to continue using HeroUI Chat',
  },
  {
    label: 'Danger toast',
    type: 'danger',
    title: 'Network error',
    description: 'Request failed, check your connection and retry',
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
      Hide all toasts
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
