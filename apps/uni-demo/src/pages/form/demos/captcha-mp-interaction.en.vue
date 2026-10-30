<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — two-stage verification with sn-slide-verify.
 *
 * The puzzle only unfolds after the slider passes: the common risk-tiering
 * flow (cheap slider first, escalate to the jigsaw when needed). Both stages
 * must pass for the chain to pass; either can be retried in place, and the
 * whole chain can be reset.
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC sources.
 */
import { computed, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

/** Stage 1: the slider verdict. */
const sliderPassed = ref(false);
/** Stage 2: the puzzle verdict. */
const puzzlePassed = ref(false);
/** Puzzle attempts, shown in the meta line. */
const puzzleAttempts = ref(0);

/** Both stages must pass. */
const chainPassed = computed(() => sliderPassed.value && puzzlePassed.value);

/** Stable network posters (picsum seeds) — a real photo makes the gap readable. */
const SCENES = [
  'https://picsum.photos/seed/snui-captcha-chain-a/600/400',
  'https://picsum.photos/seed/snui-captcha-chain-b/600/400',
];

const sceneIndex = ref(0);
const src = computed(() => SCENES[sceneIndex.value % SCENES.length] ?? SCENES[0]!);
const statusText = computed(() => {
  if (chainPassed.value) return 'chain passed';
  if (!sliderPassed.value) return 'waiting for the slider';
  return puzzlePassed.value ? 'chain passed' : 'waiting for the puzzle';
});

function onPuzzleSuccess(): void {
  puzzlePassed.value = true;
  puzzleAttempts.value += 1;
}

function onPuzzleFail(): void {
  puzzlePassed.value = false;
  puzzleAttempts.value += 1;
}

/** New photo on refresh, verdict cleared. */
function onPuzzleRefresh(): void {
  sceneIndex.value += 1;
  puzzlePassed.value = false;
}

/** Reset both stages (the slider needs a fresh gesture to pass again). */
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
        <text class="sn-demo__panel-title">1 · Slider</text>
        <text
          class="sn-demo__badge"
          :class="sliderPassed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ sliderPassed ? 'passed' : 'pending' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        Drag the slider to the far right; the puzzle unfolds once it passes.
      </text>
      <SnSlideVerify
        text="Drag the slider to the right"
        success-text="Slider verified"
        @success="sliderPassed = true"
        @fail="sliderPassed = false"
      />
    </view>

    <view v-if="sliderPassed" class="sn-demo__panel">
      <view class="sn-demo__panel-head">
        <text class="sn-demo__panel-title">2 · Jigsaw</text>
        <text
          class="sn-demo__badge"
          :class="puzzlePassed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ puzzlePassed ? 'passed' : 'pending' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        Align the puzzle piece with the gap; both stages must pass.
      </text>
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
      <text class="sn-demo__panel-title sn-demo__panel-title--muted">2 · Jigsaw</text>
      <text class="sn-demo__panel-desc">
        Finish stage 1 first — the puzzle unlocks after the slider passes.
      </text>
    </view>

    <text class="sn-demo__meta">
      Chain: {{ statusText }} · puzzle attempts: {{ puzzleAttempts }}
    </text>

    <SnButton size="small" block @tap="resetChain">Reset the chain</SnButton>
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