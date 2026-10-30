<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — tap to open the popup overlay.
 *
 * The default shape: `v-model` drives the overlay, a trigger opens the puzzle
 * over the viewport, `closeOnClickModal` decides whether a scrim tap closes it
 * and `refreshable` renders the top-right refresh button. Posters are stable
 * network URLs; every open / refresh cuts a new gap.
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

/** Swap the photo on refresh so the same gap is never reused. */
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
        <text class="sn-demo__panel-title">Tap to open (popup)</text>
        <text
          class="sn-demo__badge"
          :class="result === 'passed' ? 'sn-demo__badge--passed' : 'sn-demo__badge--idle'"
        >
          {{ result === 'passed' ? 'passed' : result === 'failed' ? 'missed' : 'pending' }}
        </text>
      </view>
      <text class="sn-demo__panel-desc">
        A trigger opens the scrim overlay; align the puzzle piece with the gap to
        pass, and the popup closes itself.
      </text>
      <SnButton type="primary" block @tap="open()">Start verification</SnButton>
    </view>

    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">Scrim tap does not close</text>
      <text class="sn-demo__panel-desc">
        close-on-click-modal = false requires solving the puzzle or using the
        close button, so a stray tap cannot cancel it.
      </text>
      <SnButton block @tap="open({ locked: true })">Verify (locked scrim)</SnButton>
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

/* Docs-preview only — keep the fixed-position popup inside the phone screen. */
.sn-captcha.sn-demo-contained {
  position: absolute;
}
</style>