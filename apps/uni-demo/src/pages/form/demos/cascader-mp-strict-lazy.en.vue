<script setup lang="ts">
/**
 * Demo: sn-cascader — Any level (`checkStrictly`): tapping a branch no longer
 * confirms, the confirm button submits the level you picked and the emitted
 * value is that level's value instead of a leaf value.
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

const value = ref<string | number>('zj');
const open = ref(false);
const selectedText = computed(() => TEXT[String(value.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >checkStrictly: any level can be confirmed and only then does the confirm button render; pick
      a branch, then tap "Use it".</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="Responsible region"
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
      check-strictly
      title="Responsible region"
      confirm-text="Use it"
      line-theme="underline"
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
