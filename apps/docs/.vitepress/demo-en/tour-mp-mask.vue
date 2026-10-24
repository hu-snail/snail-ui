<script setup lang="ts">
/**
 * Demo: sn-tour — mask toggle, mask colour, duration, z-index and custom panel.
 *
 * - `mask` off leaves just the guide panel, with no scrim
 * - `mask-color` overrides the scrim background inline (empty string = token
 *   default `--sn-mp-color-background-overlay`)
 * - `duration` feeds `--snui-tour-duration` (written on the root only when it is
 *   not the 300ms default)
 * - `z-index` / `custom-class` / `custom-style` land on the root node
 * - `show-tour-buttons=false` hides the default buttons so the `footer` slot can
 *   render its own
 * - the default slot scope `{ step, current, total }` customises the panel body
 *
 * Docs-preview only: in the real runtime the root is `position: fixed` and would
 * cover the whole page; `custom-class` lands on the root, so the preview pins the
 * guide layer inside this stage.
 *
 * Note: `offset` / `padding` / `top-safety-offset` / `bottom-safety-offset` /
 * `custom-nav` depend on synchronous measurement of the target element (no uniform
 * uni API), so they are passed as contract slots here and produce no visible
 * highlight cut-out; a host that can measure (H5 / App) positions it itself.
 */
import { ref } from 'vue'
import SnTour from '@snui/uni-src/components/sn-tour/sn-tour.vue'

const plainVisible = ref(false)
const plainCurrent = ref(0)
const plainSteps = [
  { content: 'mask=false: no scrim, just the guide panel.' },
  { content: 'Second step.' },
]

const customVisible = ref(false)
const customCurrent = ref(0)
const customSteps = [
  { content: 'This step renders its actions through the footer slot.' },
  { content: 'Last step — the custom button becomes "Got it".' },
]
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__stage">
      <text class="sn-demo__button" @tap="plainVisible = true">Open maskless guide</text>
      <text class="sn-demo__button" @tap="customVisible = true">Open custom scrim + custom panel</text>

      <SnTour
        v-model="plainVisible"
        v-model:current="plainCurrent"
        :steps="plainSteps"
        :mask="false"
        :duration="150"
        :offset="20"
        :padding="8"
        :top-safety-offset="0"
        :bottom-safety-offset="100"
        :z-index="60"
        custom-class="sn-demo-contained"
      />

      <SnTour
        v-model="customVisible"
        v-model:current="customCurrent"
        :steps="customSteps"
        mask-color="var(--sn-mp-color-background-overlay)"
        :duration="300"
        :border-radius="16"
        :show-tour-buttons="false"
        custom-nav
        custom-class="sn-demo-contained"
        custom-style="--snui-tour-duration: 300ms;"
      >
        <template #default="{ step, current, total }">
          <view class="sn-demo__panel">
            <text class="sn-demo__panel-title">Step {{ current + 1 }} / {{ total }}</text>
            <text class="sn-demo__panel-text">{{ step?.content }}</text>
          </view>
        </template>
        <template #footer="{ current, total }">
          <view class="sn-demo__footer">
            <text class="sn-demo__button" @tap="customVisible = false">Skip</text>
            <text
              class="sn-demo__button sn-demo__button--primary"
              @tap="customVisible = current + 1 >= total ? false : (customCurrent = current + 1)"
            >
              {{ current + 1 >= total ? 'Got it' : 'Continue' }}
            </text>
          </view>
        </template>
      </SnTour>
    </view>

    <text class="sn-demo__meta">Step: {{ plainCurrent + 1 }} / {{ customCurrent + 1 }}</text>
  </view>
</template>

<style scoped>
.sn-demo__stage {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  align-items: flex-start;
  min-height: 480rpx;
  padding: var(--sn-mp-spacing-4);
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-4);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__button--primary {
  border-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-action-primary);
}
.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__panel-title {
  font-size: 28rpx;
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__panel-text {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--sn-mp-spacing-3);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* Docs-preview only — pin the fixed guide layer to the stage. */
.sn-demo__stage :deep(.sn-tour.sn-demo-contained) {
  position: absolute;
}
</style>
