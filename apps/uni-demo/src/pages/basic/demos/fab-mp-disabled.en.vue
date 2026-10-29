<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — states and gestures: click-only / disabled /
 * draggable.
 *
 *   - `expandable=false`: tapping the trigger skips expansion and emits
 *     `click` only (bottom-right; the trigger slot renders a Phone icon,
 *     a single-action dialer); the counter shows the feedback.
 *   - `disabled`: blocks every interaction, trigger at half opacity
 *     (bottom-left, built-in plus icon sized with --sn-mp-icon-size-large).
 *   - `draggable`: drag the trigger with a gesture, release clamps inside
 *     the viewport; the menu still opens after dragging (top-right,
 *     direction="down" icon bubbles).
 *
 * Copy is kept in parity with fab-mp-disabled.vue.
 */
import { computed, ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Phone, Zap } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const clicks = ref(0);
const dragActive = ref(false);
const lastAction = ref('');

const actionNote = computed(() =>
  lastAction.value === '' ? '' : `Last action: ${lastAction.value}`,
);

function onClick(): void {
  clicks.value += 1;
}

function pick(label: string): void {
  lastAction.value = label;
  dragActive.value = false;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">States and gestures</text>
      <text class="sn-fab-demo__hint-text">
        Bottom-right: expandable=false emits click only ({{ clicks }} taps); bottom-left: disabled blocks interaction; top-right: draggable. {{ actionNote }}
      </text>
    </view>

    <SnFab
      position="right-bottom"
      :expandable="false"
      :gap="{ bottom: 16, right: 16 }"
      custom-class="sn-demo-contained"
      @click="onClick"
    >
      <template #trigger>
        <SnIcon :icon="Phone" size="var(--sn-mp-icon-size-large)" />
      </template>
    </SnFab>

    <SnFab
      position="left-bottom"
      disabled
      :gap="{ bottom: 16, left: 16 }"
      custom-class="sn-demo-contained"
    />

    <SnFab
      v-model:active="dragActive"
      type="info"
      position="right-top"
      direction="down"
      draggable
      :gap="{ top: 16, right: 16 }"
      custom-class="sn-demo-contained"
    >
      <view class="sn-fab-demo__bubble" role="button" aria-label="Quick launch" @tap="pick('Quick launch')">
        <SnIcon :icon="Zap" size="var(--sn-mp-icon-size-large)" />
      </view>
      <view class="sn-fab-demo__bubble" role="button" aria-label="Remind" @tap="pick('Remind')">
        <SnIcon :icon="Bell" size="var(--sn-mp-icon-size-large)" />
      </view>
    </SnFab>
  </view>
</template>

<style scoped>
.sn-fab-demo__stage {
  position: relative;
  width: 100%;
  height: 560rpx;
  overflow: hidden;
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-subtle);
}

.sn-fab-demo__hint {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5) 0;
  max-width: 60%;
}

.sn-fab-demo__hint-title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: 600;
  color: var(--sn-mp-color-text-primary);
}

.sn-fab-demo__hint-text {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-secondary);
}

.sn-fab-demo__bubble {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88rpx;
  height: 88rpx;
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-elevated);
  box-shadow: var(--sn-mp-shadow-sm);
  color: var(--sn-mp-color-text-secondary);
}

/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
