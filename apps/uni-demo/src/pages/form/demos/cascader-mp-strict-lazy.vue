<script setup lang="ts">
/**
 * Demo: sn-cascader — 任意级可选：checkStrictly 打开后点分支不自动确认，
 * 由确认按钮提交所选层级；确认后返回该层级的值（而不是叶子值）。
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

const tree = [
  {
    value: 'zj',
    text: '浙江',
    children: [
      { value: 'hz', text: '杭州' },
      { value: 'nb', text: '宁波' },
    ],
  },
  { value: 'js', text: '江苏', children: [{ value: 'nj', text: '南京' }] },
];

/** 叶子值 → 展示文案，示例演示用。 */
const TEXT: Record<string, string> = { zj: '浙江', hz: '杭州', nb: '宁波', js: '江苏', nj: '南京' };

const value = ref<string | number>('zj');
const open = ref(false);
const selectedText = computed(() => TEXT[String(value.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >checkStrictly：任意层级都可确认，此时才渲染确认按钮；选中分支后点「就它」提交。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="负责区域"
        placeholder="请选择"
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
      title="负责区域"
      confirm-text="就它"
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
