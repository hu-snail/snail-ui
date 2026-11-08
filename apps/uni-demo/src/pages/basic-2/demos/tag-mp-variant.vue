<script setup lang="ts">
/** Demo: sn-tag (uni-end) — 五种变体：同一语义色下的视觉强度梯度。 */
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** dark 实心 → light 浅底 → plain 描边 → dashed 虚线 → text 纯文字。 */
const variants = ['dark', 'light', 'plain', 'dashed', 'text'] as const;

const hues = ['primary', 'success', 'danger'] as const;
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view v-for="variant in variants" :key="variant" class="sn-demo__row">
      <SnTag v-for="hue in hues" :key="hue" :type="hue" :variant="variant">
        {{ variant }}
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
