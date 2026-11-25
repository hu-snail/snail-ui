<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — component-form toast.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 * NOTE: only the component form ships this round — `useToast()` is not implemented.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const plainOpen = ref(false);
const successOpen = ref(false);
const verticalOpen = ref(false);
</script>

<template>
  <!-- stack 由内层 view 承载：MP-WEIXIN 页面级 `.demo-host[class] { display: block }`
       编译后特异性高于 demo 根的 scoped 规则，根上声明的 flex + gap 会被拍平
       成块流（按钮间距全失）。内层 view 带不上 demo-host，页面规则碰不到它。 -->
  <view class="sn-demo">
    <view class="sn-demo--stack">
      <SnButton type="primary" block @tap="plainOpen = true">Plain text (middle)</SnButton>
      <SnButton type="success" block @tap="successOpen = true">Success icon (top)</SnButton>
      <SnButton block @tap="verticalOpen = true">Vertical layout (bottom)</SnButton>

      <SnToast
        v-model="plainOpen"
        msg="Copied to clipboard"
        :duration="1500"
        custom-class="sn-demo-contained"
      />

      <SnToast
        v-model="successOpen"
        msg="Saved"
        icon-name="success"
        position="top"
        custom-class="sn-demo-contained"
      />

      <SnToast
        v-model="verticalOpen"
        msg="Submitting, please wait"
        icon-name="loading"
        direction="vertical"
        position="bottom"
        :duration="2500"
        custom-class="sn-demo-contained"
        @click="verticalOpen = false"
      />
    </view>
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
