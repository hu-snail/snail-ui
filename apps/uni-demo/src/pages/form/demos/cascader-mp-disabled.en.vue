<script setup lang="ts">
/**
 * Demo: sn-cascader — Disabled options: a row marked `disabled` is dimmed, does
 * not react to taps and never takes part in the selection.
 *
 * The tree marks the whole Jiangsu branch and the Zhoushan leaf as disabled:
 * drilling into a disabled branch does not open the next level and a disabled
 * leaf never confirms.
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
      { value: 'zs', text: 'Zhoushan', disabled: true },
    ],
  },
  { value: 'js', text: 'Jiangsu', disabled: true, children: [{ value: 'nj', text: 'Nanjing' }] },
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
      >The whole Jiangsu branch and the Zhoushan leaf are disabled: the rows read dimmed and a tap
      neither drills down nor confirms.</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Service area"
        placeholder="Please select"
        :value="selectedText"
        is-link
        @click="open = true"
      />
    </view>
    <SnCascader v-model="value" v-model:visible="open" :options="tree" title="Service area" />
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
