<script setup lang="ts">
/**
 * Demo: sn-transition (uni-end) — per-stage classes + custom-class / custom-style.
 *
 * `enter-class` / `enter-active-class` / `enter-to-class` (and the leave side)
 * are applied to the root node per stage:
 *
 *   - enter-class        first frame of the enter leg
 *   - enter-active-class the whole enter leg
 *   - enter-to-class     enter finished, while `show` is true
 *   - leave-class / leave-active-class / leave-to-class mirror it on leave
 *
 * These classes only ride along with the stage; the animation itself still comes
 * from `name` / `duration`. The custom classes below only shift colour and
 * offset so the stage change is visible.
 *
 * `custom-class` stays on the root node; `custom-style` is appended to the root
 * inline style.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTransition from '@snui/uni-src/components/sn-transition/sn-transition.vue';

const shown = ref(true);
const phaseLog = ref<string[]>([]);

function toggle(): void {
  shown.value = !shown.value;
}

function log(label: string): void {
  phaseLog.value = [...phaseLog.value.slice(-5), label];
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__meta">
      All six stage classes + custom-class (always on, dashed frame) + custom-style (inline radius
      and fill)
    </text>
    <SnButton size="small" @tap="toggle">{{ shown ? 'Collapse' : 'Expand' }}</SnButton>

    <SnTransition
      :show="shown"
      name="fade-up"
      :duration="400"
      enter-class="sn-demo-stage--enter"
      enter-active-class="sn-demo-stage--enter-active"
      enter-to-class="sn-demo-stage--enter-to"
      leave-class="sn-demo-stage--leave"
      leave-active-class="sn-demo-stage--leave-active"
      leave-to-class="sn-demo-stage--leave-to"
      custom-class="sn-demo-stage--root"
      custom-style="border-radius: var(--sn-mp-radius-lg);"
      @before-enter="log('before-enter')"
      @after-enter="log('after-enter')"
      @before-leave="log('before-leave')"
      @after-leave="log('after-leave')"
    >
      <view class="sn-demo-stage__box">
        <text class="sn-demo-stage__text">Custom stage classes</text>
      </view>
    </SnTransition>

    <text class="sn-demo__meta">Event sequence: {{ phaseLog.join(' → ') || '—' }}</text>

    <text class="sn-demo__meta">
      Control case with custom-class only: no extra stage classes, the animation still follows name
    </text>
    <SnTransition :show="shown" name="zoom-in" custom-class="sn-demo-stage--root">
      <view class="sn-demo-stage__box">
        <text class="sn-demo-stage__text">custom-class only</text>
      </view>
    </SnTransition>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo-stage__box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 140rpx;
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-soft);
}
.sn-demo-stage__text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-primary);
}

/* custom-class: always on the root node. */
.sn-demo :deep(.sn-demo-stage--root) {
  padding: var(--sn-mp-spacing-2);
  border: 2rpx dashed var(--sn-mp-color-border-default);
}

/* Enter leg: grey start, shadow mid-leg, brand tint once finished. */
.sn-demo :deep(.sn-demo-stage--enter) {
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo :deep(.sn-demo-stage--enter-active) {
  box-shadow: var(--sn-mp-shadow-sm);
}
.sn-demo :deep(.sn-demo-stage--enter-to) {
  background-color: var(--sn-mp-color-action-primary-soft);
}

/* Leave leg: brand tint start, faded mid-leg, palest fill once finished. */
.sn-demo :deep(.sn-demo-stage--leave) {
  background-color: var(--sn-mp-color-action-primary-soft);
}
.sn-demo :deep(.sn-demo-stage--leave-active) {
  opacity: 0.7;
}
.sn-demo :deep(.sn-demo-stage--leave-to) {
  background-color: var(--sn-mp-color-background-sunken);
}
</style>
