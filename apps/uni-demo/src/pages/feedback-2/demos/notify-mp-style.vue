<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — color / background / z-index / safe-height /
 * custom-style.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';

const customFill = ref(false);
const navOffset = ref(false);
const layered = ref(false);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="customFill">color / background 覆盖</SnButton>
    <SnButton block @tap="navOffset">safe-height（为自定义导航栏留位）</SnButton>
    <SnButton block @tap="layered">z-index=300 + custom-style</SnButton>

    <text class="sn-demo__meta">
      color 与 background 分别覆盖文字色与底色；safe-height 追加顶部内边距； root-portal
      仅为对齐声明，小程序无 portal 宿主，无实际效果。
    </text>

    <SnNotify
      v-model:visible="customFill"
      type="primary"
      message="自定义底色与文字色"
      color="var(--sn-mp-color-text-primary)"
      background="var(--sn-mp-color-feedback-warning-soft)"
      custom-class="sn-demo-contained"
    />

    <SnNotify
      v-model:visible="navOffset"
      type="info"
      message="safe-height = 88：模拟自定义导航栏高度"
      :safe-height="88"
      custom-class="sn-demo-contained"
    />

    <SnNotify
      v-model:visible="layered"
      type="success"
      message="z-index = 300，并叠加 custom-style"
      :z-index="300"
      :root-portal="true"
      selector="sn-demo-notify"
      custom-style="padding-left: var(--sn-mp-spacing-5);"
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
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}
</style>
