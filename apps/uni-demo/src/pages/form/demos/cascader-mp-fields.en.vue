<script setup lang="ts">
/**
 * Demo: sn-cascader — Field mapping and the indicator: valueKey / textKey /
 * childrenKey / tipKey.
 *
 * The value / label / children / tip keys of every option are configurable;
 * lineTheme / lineHeight control the active-column indicator (a number is an
 * rpx design value — 1 design value = 2rpx).
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

/** Custom key names — id / name / items, mapped through the *-key props; tips come from tipKey. */
const tree = [
  {
    id: 'zj',
    name: 'Zhejiang',
    items: [
      { id: 'hz', name: 'Hangzhou', tips: 'Capital' },
      { id: 'nb', name: 'Ningbo', tips: 'Port' },
    ],
  },
  {
    id: 'js',
    name: 'Jiangsu',
    items: [{ id: 'nj', name: 'Nanjing', tips: 'Capital' }],
  },
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
      >valueKey="id" / textKey="name" / childrenKey="items" / tipKey="tips"; indicator
      lineTheme="text" + lineHeight.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Home city"
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
      value-key="id"
      text-key="name"
      children-key="items"
      tip-key="tips"
      title="Pick a city"
      check-strictly
      confirm-text="Use it"
      line-theme="text"
      :line-height="4"
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
</style>
