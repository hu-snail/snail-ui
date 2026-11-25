<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — z-index / custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const styled = ref(false);
</script>

<template>
  <!-- stack 由内层 view 承载：MP-WEIXIN 页面级 `.demo-host[class] { display: block }`
       编译后特异性高于 demo 根的 scoped 规则，根上声明的 flex + gap 会被拍平
       成块流（按钮间距全失）。内层 view 带不上 demo-host，页面规则碰不到它。 -->
  <view class="sn-demo">
    <view class="sn-demo--stack">
      <SnButton block @tap="styled = true"> z-index=300 + custom-style </SnButton>

      <SnToast
        v-model="styled"
        msg="z-index 与 custom-style"
        icon-name="info"
        :z-index="300"
        custom-style="padding: var(--sn-mp-spacing-5); border-radius: var(--sn-mp-radius-xl);"
        custom-class="sn-demo-contained"
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
