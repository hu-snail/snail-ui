<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 拼图验证基础用法：v-model 打开，success 回调。
 *
 * 背景图走网络地址（picsum seed 固定），每次刷新重新裁剪缺口；
 * `v-model` 关闭弹层，`success` / `fail` 回报结果。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const passed = ref(false);

/** Stable network poster (picsum seed) so the puzzle cuts a real photo. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-basic/600/400';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">基础用法</text>
      <text class="sn-demo__panel-desc">
        v-model 控制弹层开关；滑动拼图块对齐缺口后 emit success。
      </text>
      <SnButton type="primary" block @tap="show = true">拼图验证</SnButton>
      <text class="sn-demo__meta">验证结果：{{ passed ? '通过' : '待验证' }}</text>
    </view>

    <SnCaptcha
      v-model="show"
      :src="SOURCE"
      :width="300"
      :height="200"
      custom-class="sn-demo-contained"
      @success="passed = true"
      @fail="passed = false"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__panel-title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__panel-desc {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>
