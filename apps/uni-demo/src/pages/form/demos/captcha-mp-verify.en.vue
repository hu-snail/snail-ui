<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — inline puzzle verification.
 *
 * `inline` renders the puzzle directly in the page flow instead of covering the
 * viewport as a popup: the right shape for inline form verification that should
 * not interrupt the user. The block owns its background image, drag track and
 * refresh button; it never auto-closes, so it stays on the passed state and the
 * host decides what happens next.
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

/** Refresh: swap the photo and clear the previous verdict. */
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
        <text class="sn-demo__panel-title">Inline puzzle (inline)</text>
        <text
          class="sn-demo__badge"
          :class="passed ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ passed ? 'passed' : 'pending' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        The puzzle renders in the page flow so a form can verify in place without
        covering the screen.
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

    <text class="sn-demo__meta">
      Attempts: {{ attempts }} · tap the top-right button to load another photo
    </text>
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