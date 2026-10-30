<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — two-stage verification with sn-slide-verify.
 *
 * The puzzle only appears after the slider passes: the common risk-tiering
 * flow (cheap slider first, escalate to a puzzle on failure or high risk).
 * The chain passes only when both stages pass.
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC sources.
 */
import { computed, ref } from 'vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

/** Stage one: the slider has passed. */
const sliderPassed = ref(false);
/** Stage two: the puzzle has passed. */
const puzzlePassed = ref(false);

/** The chain passes only when both stages pass. */
const chainPassed = computed(() => sliderPassed.value && puzzlePassed.value);

/** Stable network poster (picsum seed) for the puzzle notch. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-chain/600/400';

function resetChain(): void {
  sliderPassed.value = false;
  puzzlePassed.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">Stage 1 · slider</text>
      <text class="sn-demo__panel-desc">
        Drag the handle to the far right; passing unlocks stage two.
      </text>
      <SnSlideVerify
        text="Drag right to verify"
        success-text="Slider verified"
        @success="sliderPassed = true"
        @fail="sliderPassed = false"
      />
    </view>

    <view v-if="sliderPassed" class="sn-demo__panel">
      <text class="sn-demo__panel-title">Stage 2 · puzzle</text>
      <text class="sn-demo__panel-desc">
        Align the puzzle piece with the notch; both stages passing clears the
        chain.
      </text>
      <SnCaptcha
        v-model="puzzlePassed"
        inline
        :src="SOURCE"
        :width="280"
        :height="180"
        @success="puzzlePassed = true"
        @fail="puzzlePassed = false"
      />
    </view>

    <view v-else class="sn-demo__panel sn-demo__panel--placeholder">
      <text class="sn-demo__placeholder-text">Finish the slider first</text>
    </view>

    <text class="sn-demo__meta">
      Slider: {{ sliderPassed ? 'passed' : 'pending' }} · Puzzle:
      {{ puzzlePassed ? 'passed' : 'pending' }} · Chain:
      {{ chainPassed ? 'passed' : 'incomplete' }}
    </text>

    <view class="sn-demo__actions">
      <text class="sn-demo__reset" role="button" aria-label="Reset the verification chain" @tap="resetChain">
        Reset chain
      </text>
    </view>
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
.sn-demo__panel--placeholder {
  align-items: center;
  justify-content: center;
  min-height: 160rpx;
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
.sn-demo__placeholder-text {
  color: var(--sn-mp-color-text-disabled);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.sn-demo__reset {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
