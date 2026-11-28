<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — cover.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';

const covered = ref(false);
</script>

<template>
  <!-- stack 由内层 view 承载：MP-WEIXIN 页面级 `.demo-host[class] { display: block }`
       编译后特异性高于 demo 根的 scoped 规则，根上声明的 flex + gap 会被拍平
       成块流（按钮间距全失）。内层 view 带不上 demo-host，页面规则碰不到它。 -->
  <view class="sn-demo">
    <view class="sn-demo--stack">
      <SnButton type="warning" block @tap="covered = true"> cover（透明全屏遮罩阻挡点击） </SnButton>

      <text class="sn-demo__meta">toast 展示期间页面无法点击，duration 结束后自动恢复。</text>

      <SnToast
        v-model="covered"
        msg="cover：透明遮罩挡住页面点击"
        icon-name="warning"
        cover
        :duration="2500"
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
