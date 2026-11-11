<script setup lang="ts">
/** Demo: sn-tag (uni-end) — 尺寸档位。 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** 尺寸档位自 小 到 超大，default 为基准档。 */
const sizes = ['small', 'default', 'large', 'extra-large'] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__row">
      <SnTag v-for="size in sizes" :key="size" type="primary" :size="size">
        {{ size }}
      </SnTag>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-5);
  align-items: flex-start;
}

.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-mp-spacing-4) var(--sn-mp-spacing-5);
  align-items: center;
}
</style>
