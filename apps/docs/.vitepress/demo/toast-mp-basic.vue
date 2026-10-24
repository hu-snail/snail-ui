<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — component-form toast.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 * NOTE: only the component form ships this round — `useToast()` is not implemented.
 */
import { ref } from 'vue'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue'

const plainOpen = ref(false)
const successOpen = ref(false)
const verticalOpen = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="plainOpen = true">纯文案（中间）</SnButton>
    <SnButton type="success" block @tap="successOpen = true">成功图标（顶部）</SnButton>
    <SnButton block @tap="verticalOpen = true">纵向排版（底部）</SnButton>

    <SnToast
      v-model="plainOpen"
      msg="已复制到剪贴板"
      :duration="1500"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="successOpen"
      msg="保存成功"
      icon-name="success"
      position="top"
      custom-class="sn-demo-contained"
    />

    <SnToast
      v-model="verticalOpen"
      msg="正在提交，请稍候"
      icon-name="loading"
      direction="vertical"
      position="bottom"
      :duration="0"
      custom-class="sn-demo-contained"
      @click="verticalOpen = false"
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
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
