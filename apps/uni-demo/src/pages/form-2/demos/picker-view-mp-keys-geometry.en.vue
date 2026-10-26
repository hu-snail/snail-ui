<script setup lang="ts">
/**
 * Demo: sn-picker-view — itemHeight / visibleItemCount / valueKey / labelKey / childrenKey.
 *
 * `item-height` is the row height (px design units → rpx) and
 * `visible-item-count` the number of visible rows; `value-key` / `label-key` /
 * `children-key` let the component read custom field names, so business data
 * need not be reshaped into `value` / `label` / `children`.
 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

/** Row height 32 / 5 visible rows: a tighter roller. */
const dense = ref<Array<string | number>>(['Shanghai']);

/** Field names are not value / label: valueKey / labelKey point at the real ones. */
const cities = [
  { id: 'sh', name: 'Shanghai' },
  { id: 'bj', name: 'Beijing' },
  { id: 'gz', name: 'Guangzhou' },
];
const byId = ref<Array<string | number>>(['bj']);

/** The cascade tree uses `nodes` instead of `children`: childrenKey selects it. */
const tree = [
  {
    code: 'zj',
    title: 'Zhejiang',
    nodes: [
      { code: 'hz', title: 'Hangzhou' },
      { code: 'nb', title: 'Ningbo' },
    ],
  },
  { code: 'js', title: 'Jiangsu', nodes: [{ code: 'nj', title: 'Nanjing' }] },
];
const cascade = ref<Array<string | number>>(['zj', 'hz']);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPickerView
      v-model="dense"
      :columns="[['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Hangzhou', 'Chengdu']]"
      :item-height="32"
      :visible-item-count="5"
    />
    <text class="sn-demo__meta"
      >itemHeight=32 + visibleItemCount=5: shorter rows, fewer visible rows</text
    >

    <SnPickerView v-model="byId" :columns="[cities]" value-key="id" label-key="name" />
    <text class="sn-demo__meta">valueKey="id" + labelKey="name": read custom fields</text>

    <SnPickerView
      v-model="cascade"
      :columns="tree"
      cascade
      value-key="code"
      label-key="title"
      children-key="nodes"
    />
    <text class="sn-demo__meta"
      >childrenKey="nodes": the cascade tree uses a custom children field</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
