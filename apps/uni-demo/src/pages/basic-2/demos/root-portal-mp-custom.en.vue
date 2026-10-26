<script setup lang="ts">
/**
 * Demo: sn-root-portal (uni-end) — custom-class / custom-style.
 *
 * The layer is the only node this component can style (there is no teleport
 * target), so these two props are the prerequisite for using it as an overlay:
 *   - customClass  → class on the fixed layer
 *   - customStyle  → inline style on the fixed layer
 *
 * Preview-only extra: in a real miniprogram the layer is `position: fixed` and
 * would cover the whole phone screen. To keep it inside the device shell, the
 * demo uses customClass to make it `position: absolute` — do not do this in
 * application code.
 */
import { ref } from 'vue';
import SnRootPortal from '@snui/uni-src/components/sn-root-portal/sn-root-portal.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const visible = ref(true);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__host">
      <text class="sn-demo__note">Host container: position: relative + overflow: hidden</text>

      <SnRootPortal
        v-if="visible"
        custom-class="sn-demo__layer"
        custom-style="padding: var(--sn-mp-spacing-2);"
      >
        <view class="sn-demo__badge">Fixed layer driven by custom-class</view>
      </SnRootPortal>
    </view>

    <view class="sn-demo__actions">
      <SnButton size="small" @tap="visible = !visible">
        {{ visible ? 'Unmount the layer' : 'Mount the layer' }}
      </SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  width: 100%;
  align-items: stretch;
}
.sn-demo__host {
  position: relative;
  height: 200rpx;
  padding: var(--sn-mp-spacing-3);
  overflow: hidden;
  border: 2rpx dashed var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-subtle);
}
.sn-demo__note {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__badge {
  position: absolute;
  left: 50%;
  bottom: var(--sn-mp-spacing-3);
  transform: translateX(-50%);
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: var(--sn-mp-font-size-xs);
  white-space: nowrap;
}
.sn-demo__actions {
  display: flex;
  gap: 12rpx;
}
/* custom-class lands on the fixed layer. Preview only: pin it to the host so it
 * does not cover the whole phone screen; real code keeps the default fixed. */
.sn-demo :deep(.sn-demo__layer) {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: var(--sn-mp-color-background-overlay);
}
</style>
