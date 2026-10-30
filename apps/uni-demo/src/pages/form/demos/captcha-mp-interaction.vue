<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 与 sn-slide-verify 组合的两段式验证。
 *
 * 第一段滑块验证通过后才展开第二段拼图验证：常见于风控分级场景（先低成本
 * 滑块，必要时再升级为拼图）。两段都通过才算整链通过；滑块按步进入、拼图
 * 内嵌展示，任一环节失败都可原地重试或整链重置。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC sources.
 */
import { computed, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

/** 第一段：滑块是否已通过。 */
const sliderPassed = ref(false);
/** 第二段：拼图验证是否通过。 */
const puzzlePassed = ref(false);
/** 第二段已尝试次数（用于展示与重置 key）。 */
const puzzleAttempts = ref(0);

/** 两段都通过才算整链通过。 */
const chainPassed = computed(() => sliderPassed.value && puzzlePassed.value);

/** Stable network posters (picsum seeds) — a real photo makes the gap readable. */
const SCENES = [
  'https://picsum.photos/seed/snui-captcha-chain-a/600/400',
  'https://picsum.photos/seed/snui-captcha-chain-b/600/400',
];

const sceneIndex = ref(0);
const src = computed(() => SCENES[sceneIndex.value % SCENES.length] ?? SCENES[0]!);
const statusText = computed(() => {
  if (chainPassed.value) return '整链通过';
  if (!sliderPassed.value) return '等待滑块验证';
  return puzzlePassed.value ? '整链通过' : '等待拼图验证';
});

function onPuzzleSuccess(): void {
  puzzlePassed.value = true;
  puzzleAttempts.value += 1;
}

function onPuzzleFail(): void {
  puzzlePassed.value = false;
  puzzleAttempts.value += 1;
}

/** 拼图换图：保持未通过态，重新掷缺口。 */
function onPuzzleRefresh(): void {
  sceneIndex.value += 1;
  puzzlePassed.value = false;
}

/** 整链重置：两段都回到起点（滑块需要新的手势才能再次通过）。 */
function resetChain(): void {
  sliderPassed.value = false;
  puzzlePassed.value = false;
  puzzleAttempts.value = 0;
  sceneIndex.value = 0;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <view class="sn-demo__panel-head">
        <text class="sn-demo__panel-title">1 · 滑块验证</text>
        <text
          class="sn-demo__badge"
          :class="sliderPassed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ sliderPassed ? '已通过' : '待验证' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">拖动滑块到最右侧，通过后展开第二段拼图。</text>
      <SnSlideVerify
        text="向右拖动滑块完成验证"
        success-text="滑块验证已通过"
        @success="sliderPassed = true"
        @fail="sliderPassed = false"
      />
    </view>

    <view v-if="sliderPassed" class="sn-demo__panel">
      <view class="sn-demo__panel-head">
        <text class="sn-demo__panel-title">2 · 拼图验证</text>
        <text
          class="sn-demo__badge"
          :class="puzzlePassed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ puzzlePassed ? '已通过' : '待验证' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">滑动拼图块对齐缺口，两段都通过即整链通过。</text>
      <SnCaptcha
        inline
        :src="src"
        :width="300"
        :height="190"
        @success="onPuzzleSuccess"
        @fail="onPuzzleFail"
        @refresh="onPuzzleRefresh"
      />
    </view>

    <view v-else class="sn-demo__panel sn-demo__panel--locked">
      <text class="sn-demo__panel-title sn-demo__panel-title--muted">2 · 拼图验证</text>
      <text class="sn-demo__panel-desc">先完成第一段滑块验证，拼图验证才会解锁。</text>
    </view>

    <text class="sn-demo__meta">
      整链状态：{{ statusText }} · 拼图尝试 {{ puzzleAttempts }} 次
    </text>

    <SnButton size="small" block @tap="resetChain">重置验证链</SnButton>
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

/* Locked stage: dashed outline + sunken surface so "not yet unlocked" reads
 * without relying on opacity alone. */
.sn-demo__panel--locked {
  border-style: dashed;
  background-color: var(--sn-mp-color-background-soft);
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

.sn-demo__panel-title--muted {
  color: var(--sn-mp-color-text-tertiary);
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