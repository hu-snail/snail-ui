<script setup lang="ts">
/**
 * Demo: sn-sidebar — the `before-change` guard and the `select` method.
 *
 * - `before-change` runs before a switch; returning `false` (or a rejected
 *   promise) vetoes it
 * - a template ref exposes `select(value, label)`, so the host can drive the
 *   sidebar from code
 * - `max` on `sn-sidebar-item` caps the badge (above it renders `{max}+`)
 * - `custom-class` / `custom-style` land on the root node
 */
import { ref } from 'vue'
import SnSidebar from '@snui/uni-src/components/sn-sidebar/sn-sidebar.vue'
import SnSidebarItem from '@snui/uni-src/components/sn-sidebar/sn-sidebar-item.vue'

const active = ref(0)
const blocked = ref(0)

const labels = ['All', 'Unpaid', 'To ship', 'Completed']

/** Block the first two switches, then allow. */
function beforeChange(): boolean {
  blocked.value += 1
  return blocked.value > 2
}

const sidebarRef = ref<InstanceType<typeof SnSidebar> | null>(null)

function jumpTo(index: number): void {
  sidebarRef.value?.select(index, labels[index] ?? '')
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnSidebar
        ref="sidebarRef"
        v-model="active"
        :before-change="beforeChange"
        custom-class="sn-demo__side"
      >
        <SnSidebarItem
          v-for="(label, index) in labels"
          :key="label"
          :label="label"
          :value="index"
          :badge="index === 1 ? 120 : undefined"
          :max="99"
        />
      </SnSidebar>
      <view class="sn-demo__panel">
        <text class="sn-demo__panel-text">Current: {{ labels[active] }}</text>
        <text class="sn-demo__meta">Blocked {{ Math.min(blocked, 2) }} times</text>
      </view>
    </view>

    <view class="sn-demo__actions">
      <text class="sn-demo__button" @tap="jumpTo(2)">select(2) → "To ship"</text>
      <text class="sn-demo__button" @tap="blocked = 0">Reset the counter</text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo__row {
  display: flex;
  width: 100%;
  min-height: 400rpx;
}
.sn-demo__panel {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
}
.sn-demo__panel-text {
  font-size: 26rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-2);
}
.sn-demo__button {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-sm);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
/* custom-class lands on the sn-sidebar root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__side) {
  flex: 0 0 180rpx;
}
</style>
