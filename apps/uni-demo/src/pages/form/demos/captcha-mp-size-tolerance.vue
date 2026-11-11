<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 尺寸与容差（width / height / tolerance）。
 *
 * `width` / `height` 调整舞台尺寸（更宽的画幅让拼图更好辨认）；
 * `tolerance` 放宽对齐窗口。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const passed = ref(false);

/** Stable network poster (picsum seed) so the puzzle cuts a real photo. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-size/640/320';
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <view class="sn-demo__panel-head">
        <text class="sn-demo__panel-title">尺寸与容差</text>
        <text
          class="sn-demo__badge"
          :class="passed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ passed ? '已通过' : '待验证' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">更宽的画幅 + 更宽松的容差。</text>
      <SnButton type="primary" block @tap="show = true">打开宽幅验证</SnButton>
    </view>

    <SnCaptcha
      v-model="show"
      :src="SOURCE"
      :width="320"
      :height="160"
      :tolerance="16"
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

.sn-demo__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sn-demo__panel-title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}

.sn-demo__badge {
  padding: 4rpx 16rpx;
  border-radius: var(--sn-mp-radius-full);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-demo__badge--idle {
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-demo__badge--passed {
  background-color: var(--sn-mp-color-feedback-success-soft);
  color: var(--sn-mp-color-feedback-success);
}

.sn-demo__panel-desc {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}

/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>
