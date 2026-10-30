<script setup lang="ts">
/**
 * Demo: sn-cascader — 禁用选项：行级 `disabled` 降低透明度、不响应点击，也不参与选择。
 *
 * 树里把「江苏」整枝与「舟山」叶子标为 disabled；逐级下钻到被禁用的分支时
 * 不会展开下一级，被禁用的叶子点了也不会确认。
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
      { value: 'zs', text: '舟山', disabled: true },
    ],
  },
  { value: 'js', text: '江苏', disabled: true, children: [{ value: 'nj', text: '南京' }] },
];

/** 叶子值 → 展示文案，示例演示用。 */
const TEXT: Record<string, string> = { zj: '浙江', hz: '杭州', nb: '宁波', js: '江苏', nj: '南京' };

const value = ref<string | number>('hz');
const open = ref(false);
const selectedText = computed(() => TEXT[String(value.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >「江苏」整枝与「舟山」叶子被禁用：行呈弱化态，点了既不展开也不确认。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="开通城市"
        placeholder="请选择"
        :value="selectedText"
        is-link
        @click="open = true"
      />
    </view>
    <SnCascader v-model="value" v-model:visible="open" :options="tree" title="开通城市" />
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
