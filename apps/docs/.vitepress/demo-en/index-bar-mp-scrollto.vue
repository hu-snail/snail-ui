<script setup lang="ts">
/**
 * Demo: sn-index-bar — `scrollTo()` from code and custom root styling.
 *
 * - `scrollTo(index)` on a template ref jumps to a group from code (and emits
 *   `change`)
 * - `custom-class` / `custom-style` land on the root node
 * - `sticky` currently only toggles the `sn-index-bar--sticky` class on the root and
 *   ships no matching CSS rule, so it is left off here — the prop is a contract slot
 *   and the docs page says so
 *
 * In the preview `sn-demo--index` makes the demo full-bleed (see the PhoneFrame
 * full-bleed rules).
 */
import { ref } from 'vue'
import SnIndexBar from '@snui/uni-src/components/sn-index-bar/sn-index-bar.vue'
import SnIndexAnchor from '@snui/uni-src/components/sn-index-bar/sn-index-anchor.vue'

const barRef = ref<InstanceType<typeof SnIndexBar> | null>(null)

const groups = [
  { index: 'A', names: ['Alice', 'Amy', 'Aaron'] },
  { index: 'B', names: ['Bob', 'Bella', 'Ben'] },
  { index: 'C', names: ['Carl', 'Cindy'] },
  { index: 'D', names: ['Dora'] },
]

function jumpTo(index: string): void {
  barRef.value?.scrollTo(index)
}
</script>

<template>
  <view class="sn-demo sn-demo--index">
    <SnIndexBar
      ref="barRef"
      custom-class="sn-demo__bar"
      custom-style="background-color: var(--sn-mp-color-background-surface);"
    >
      <SnIndexAnchor v-for="group in groups" :key="group.index" :index="group.index">
        <view v-for="name in group.names" :key="name" class="sn-demo__row">
          <text>{{ name }}</text>
        </view>
      </SnIndexAnchor>
    </SnIndexBar>

    <view class="sn-demo__jump">
      <text
        v-for="group in groups"
        :key="`jump-${group.index}`"
        class="sn-demo__chip"
        @tap="jumpTo(group.index)"
      >
        {{ group.index }}
      </text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--index {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 420rpx;
  overflow: hidden;
}
.sn-demo__row {
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__jump {
  display: flex;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-2) var(--sn-mp-spacing-3);
  border-top: 2rpx solid var(--sn-mp-color-border-subtle);
}
.sn-demo__chip {
  padding: 0 var(--sn-mp-spacing-2);
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-full);
  font-size: 22rpx;
  color: var(--sn-mp-color-action-primary);
}
/* custom-class lands on the sn-index-bar root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__bar) {
  flex: 1 1 auto;
  min-height: 0;
}
</style>
