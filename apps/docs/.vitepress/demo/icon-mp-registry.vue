<script setup lang="ts">
/**
 * Demo: sn-icon (uni-end) — custom IconData + button integration.
 *
 * Show how to author your own IconData (copy the SVG paths from
 * https://lucide.dev/icons) and use sn-icon inside a button slot.
 */
import SnIcon, {
  type IconData,
} from '@snui/uni-src/components/sn-icon/sn-icon.vue'
import {
  Plus,
  X,
} from '@snui/uni-src/components/sn-icon/sn-icon-set'
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue'

// Custom icon — author once, use anywhere.
const CustomFlag: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z', 'M4 22V15'],
}
</script>

<template>
  <div class="sn-demo">
    <SnButton type="primary">
      <template #icon>
        <SnIcon :icon="Plus" :size="14" />
      </template>
      新建
    </SnButton>

    <SnButton>
      <template #icon>
        <SnIcon :icon="CustomFlag" :size="14" />
      </template>
      自定义
    </SnButton>

    <SnButton type="danger">
      <template #icon>
        <SnIcon :icon="X" :size="14" />
      </template>
      删除
    </SnButton>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 24rpx;
  align-items: center;
}
</style>