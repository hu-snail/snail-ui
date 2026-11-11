<script setup lang="ts">
/**
 * Demo: sn-cascader — sheet settings (scrim / stacking / custom).
 *
 * closeOnClickModal / safeAreaInsetBottom / zIndex / rootPortal /
 * customClass / customStyle control the sheet behaviour and appearance.
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const tree = [
  {
    value: 'zj',
    text: 'Zhejiang',
    children: [
      { value: 'hz', text: 'Hangzhou' },
      { value: 'nb', text: 'Ningbo' },
    ],
  },
  { value: 'js', text: 'Jiangsu', children: [{ value: 'nj', text: 'Nanjing' }] },
];

/** Leaf value → display text, demo-only. */
const TEXT: Record<string, string> = {
  zj: 'Zhejiang',
  hz: 'Hangzhou',
  nb: 'Ningbo',
  js: 'Jiangsu',
  nj: 'Nanjing',
};

const value = ref<string | number>('hz');
const open = ref(false);
const selectedText = computed(() => TEXT[String(value.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >Sheet settings: the mask tap keeps it open (closeOnClickModal=false), no safe-area padding,
      higher zIndex, customStyle tweaks the radius.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Campaign region"
        placeholder="Please select"
        :value="selectedText"
        is-link
        @click="open = true"
      />
    </view>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      title="Campaign region"
      :close-on-click-modal="false"
      :safe-area-inset-bottom="false"
      :z-index="1250"
      root-portal
      custom-class="sn-demo__sheet"
      custom-style="border-radius: var(--sn-mp-radius-xl);"
    />
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}

.sn-demo__cards {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}

.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}

.sn-demo__sheet {
  background-color: var(--sn-mp-color-background-elevated);
}
</style>
