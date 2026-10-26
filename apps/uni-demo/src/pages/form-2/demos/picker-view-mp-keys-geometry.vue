<script setup lang="ts">
/**
 * Demo: sn-picker-view — itemHeight / visibleItemCount / valueKey / labelKey / childrenKey。
 *
 * `item-height` 是每行高度（px 设计值 → rpx），`visible-item-count` 决定滚轮可见
 * 行数；`value-key` / `label-key` / `children-key` 让组件读取自定义字段名，
 * 不必把业务数据改成 `value` / `label` / `children`。
 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

/** 行高 32 / 可见 5 行：滚轮更紧凑。 */
const dense = ref<Array<string | number>>(['上海']);

/** 业务字段名不是 value / label：用 valueKey / labelKey 指定。 */
const cities = [
  { id: 'sh', name: '上海' },
  { id: 'bj', name: '北京' },
  { id: 'gz', name: '广州' },
];
const byId = ref<Array<string | number>>(['bj']);

/** 级联树用 `nodes` 而不是 `children`：childrenKey 指定。 */
const tree = [
  {
    code: 'zj',
    title: '浙江',
    nodes: [
      { code: 'hz', title: '杭州' },
      { code: 'nb', title: '宁波' },
    ],
  },
  { code: 'js', title: '江苏', nodes: [{ code: 'nj', title: '南京' }] },
];
const cascade = ref<Array<string | number>>(['zj', 'hz']);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnPickerView
      v-model="dense"
      :columns="[['上海', '北京', '广州', '深圳', '杭州', '成都']]"
      :item-height="32"
      :visible-item-count="5"
    />
    <text class="sn-demo__meta">itemHeight=32 + visibleItemCount=5：行更矮、可见行更少</text>

    <SnPickerView v-model="byId" :columns="[cities]" value-key="id" label-key="name" />
    <text class="sn-demo__meta">valueKey="id" + labelKey="name"：读取自定义字段</text>

    <SnPickerView
      v-model="cascade"
      :columns="tree"
      cascade
      value-key="code"
      label-key="title"
      children-key="nodes"
    />
    <text class="sn-demo__meta">childrenKey="nodes"：级联树用自定义子节点字段</text>
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
