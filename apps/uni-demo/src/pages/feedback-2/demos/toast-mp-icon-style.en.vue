<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — English shadow of toast-mp-icon-style.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const iconSized = ref(false);
const loadingSized = ref(false);
</script>

<template>
  <!-- stack 由内层 view 承载：MP-WEIXIN 页面级 `.demo-host[class] { display: block }`
       编译后特异性高于 demo 根的 scoped 规则，根上声明的 flex + gap 会被拍平
       成块流（按钮间距全失）。内层 view 带不上 demo-host，页面规则碰不到它。 -->
  <view class="sn-demo">
    <view class="sn-demo--stack">
      <SnButton type="success" block @tap="iconSized = true"> icon-size / icon-color </SnButton>
      <SnButton block @tap="loadingSized = true"> loading-size / loading-color </SnButton>

      <SnToast
        v-model="iconSized"
        msg="Larger, recolored status glyph"
        icon-name="success"
        :icon-size="72"
        icon-color="var(--sn-mp-color-feedback-success)"
        custom-class="sn-demo-contained"
      />

      <SnToast
        v-model="loadingSized"
        msg="Larger, recolored spinner"
        icon-name="loading"
        :loading-size="64"
        loading-color="var(--sn-mp-color-feedback-warning)"
        direction="vertical"
        :duration="2000"
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
