<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — component-form banner notification.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 * NOTE: only the component form ships this round — `useNotify()` is not implemented.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue'

const primaryOpen = ref(false)
const successOpen = ref(false)
const warningOpen = ref(false)
const dangerOpen = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="primaryOpen = true">primary</SnButton>
    <SnButton type="success" block @tap="successOpen = true">success</SnButton>
    <SnButton type="warning" block @tap="warningOpen = true">warning</SnButton>
    <SnButton type="danger" block @tap="dangerOpen = true">danger</SnButton>

    <SnNotify
      v-model:visible="primaryOpen"
      type="primary"
      message="这是一条普通通知"
      custom-class="sn-demo-contained"
    />
    <SnNotify
      v-model:visible="successOpen"
      type="success"
      message="保存成功"
      custom-class="sn-demo-contained"
    />
    <SnNotify
      v-model:visible="warningOpen"
      type="warning"
      message="额度即将用尽，请及时充值"
      custom-class="sn-demo-contained"
    />
    <SnNotify
      v-model:visible="dangerOpen"
      type="danger"
      message="网络异常，请稍后重试"
      custom-class="sn-demo-contained"
    />
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
