<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 内嵌展示（inline）。
 *
 * `inline` 让拼图验证直接渲染在页面流里，而不是以弹层覆盖视口：适合
 * 「注册页内联校验」这类不需要打断用户的位置。验证块自带背景图、
 * 拖拽滑块与刷新按钮，成功后 emit `success`；内嵌形态不会自动关闭，
 * 通过后停留在通过态由宿主决定下一步。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC source.
 */
import { computed, ref } from 'vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';

/** Stable network posters (picsum seeds) — a real photo makes the gap readable. */
const SCENES = [
  'https://picsum.photos/seed/snui-captcha-inline-a/600/400',
  'https://picsum.photos/seed/snui-captcha-inline-b/600/400',
  'https://picsum.photos/seed/snui-captcha-inline-c/600/400',
];

const sceneIndex = ref(0);
const src = computed(() => SCENES[sceneIndex.value % SCENES.length] ?? SCENES[0]!);
const passed = ref(false);
const attempts = ref(0);

/** 刷新（换一张）：换底图并清掉上一次的判定。 */
function onRefresh(): void {
  sceneIndex.value += 1;
  passed.value = false;
}

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
        <text class="sn-demo__panel-title">内嵌展示（inline）</text>
        <text
          class="sn-demo__badge"
          :class="passed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ passed ? '已通过' : '待验证' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        拼图验证直接渲染在页面流中，配合表单原地校验，不遮挡页面。
      </text>

      <SnCaptcha
        inline
        :src="src"
        :width="300"
        :height="190"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
      />
    </view>

    <text class="sn-demo__meta">尝试次数：{{ attempts }} · 点右上角按钮可换一张底图</text>
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
</style>