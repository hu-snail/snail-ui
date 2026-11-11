<script setup lang="ts">
/**
 * Demo: sn-fab (uni-end) — click-only (`expandable=false`).
 *
 * Tapping the trigger skips expansion and emits `click` only (bottom-right;
 * the trigger slot renders a Phone icon, a single-action dialer); the counter
 * shows the feedback.
 *
 * Copy is kept in parity with fab-mp-expandable.vue.
 */
import { ref } from 'vue';
import SnFab from '@snui/uni-src/components/sn-fab/sn-fab.vue';
import SnIcon from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Phone } from '@snui/uni-src/components/sn-icon/sn-icon-set';

const clicks = ref(0);

function onClick(): void {
  clicks.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-fab-demo__stage">
    <view class="sn-fab-demo__hint">
      <text class="sn-fab-demo__hint-title">Click-only</text>
      <text class="sn-fab-demo__hint-text">
        Bottom-right: expandable=false skips expansion and emits click only ({{ clicks }} taps).
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

/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-fab.sn-demo-contained {
  position: absolute;
}
</style>
