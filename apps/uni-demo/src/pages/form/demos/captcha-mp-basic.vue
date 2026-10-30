<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 拼图验证基础用法：v-model 打开，success 回调。
 *
 * 背景图走稳定网络地址，每次刷新都会重新裁剪缺口；`v-model` 关闭弹层，
 * `success` / `fail` 回报结果，通过后弹层自动关闭。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const passed = ref(false);
const attempts = ref(0);

/** Stable network poster (picsum seed) so the puzzle cuts a real photo. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-basic/600/400';

function onSuccess(): void {
  passed.value = true;
  attempts.value += 1;
}

function onFail(): void {
  passed.value = false;
  attempts.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <view class="sn-demo__panel-head">
        <text class="sn-demo__panel-title">基础用法</text>
        <text
          class="sn-demo__badge"
          :class="passed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ passed ? '已通过' : '待验证' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        v-model 控制弹层开关；滑动拼图块对齐缺口后 emit success。
      </text>
      <SnButton type="primary" block @tap="show = true">拼图验证</SnButton>
    </view>

    <text class="sn-demo__meta">尝试次数：{{ attempts }}</text>

    <SnCaptcha
      v-model="show"
      :src="SOURCE"
      :width="300"
      :height="200"
      custom-class="sn-demo-contained"
      @success="onSuccess"
      @fail="onFail"
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

.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}

/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>