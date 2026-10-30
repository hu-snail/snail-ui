<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 点击弹出验证（弹层形态）。
 *
 * 默认形态：`v-model` 控制弹层开关，触发器点击后拼图验证以遮罩弹层覆盖
 * 视口；`closeOnClickModal` 控制点遮罩关闭，`refreshable` 控制右上角刷新
 * 按钮。底图走稳定网络地址，每次打开 / 刷新都会重新裁剪缺口。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { computed, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

const show = ref(false);
const lockedScrim = ref(false);

/** Stable network posters (picsum seeds) — a real photo makes the gap readable. */
const SCENES = [
  'https://picsum.photos/seed/snui-captcha-popup-a/600/400',
  'https://picsum.photos/seed/snui-captcha-popup-b/600/400',
];

const sceneIndex = ref(0);
const src = computed(() => SCENES[sceneIndex.value % SCENES.length] ?? SCENES[0]!);
const result = ref<'idle' | 'passed' | 'failed'>('idle');

function open(options: { locked?: boolean } = {}): void {
  lockedScrim.value = options.locked === true;
  show.value = true;
}

function onSuccess(): void {
  result.value = 'passed';
}

/** 每次换图：刷新后重新裁剪缺口，避免同一张图反复通过。 */
function onRefresh(): void {
  sceneIndex.value += 1;
}

function onFail(): void {
  result.value = 'failed';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <view class="sn-demo__panel-head">
        <text class="sn-demo__panel-title">点击弹出（弹层形态）</text>
        <text
          class="sn-demo__badge"
          :class="result === 'passed' ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ result === 'passed' ? '已通过' : result === 'failed' ? '未对齐' : '待验证' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        触发器打开遮罩弹层，滑动拼图块对齐缺口即通过；通过后弹层自动关闭。
      </text>
      <SnButton type="primary" block @tap="open()">开始验证</SnButton>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">点遮罩不关闭</text>
      <text class="sn-demo__panel-desc">
        close-on-click-modal = false：必须滑动拼图或点右上角关闭，避免误触取消。
      </text>
      <SnButton block @tap="open({ locked: true })">验证（锁定遮罩）</SnButton>
    </view>

    <SnCaptcha
      v-model="show"
      :src="src"
      :width="300"
      :height="200"
      :close-on-click-modal="!lockedScrim"
      custom-class="sn-demo-contained"
      @success="onSuccess"
      @fail="onFail"
      @refresh="onRefresh"
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
</style>