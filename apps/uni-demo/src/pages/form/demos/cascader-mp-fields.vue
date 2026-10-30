<script setup lang="ts">
/**
 * Demo: sn-cascader — 字段映射与指示条：valueKey / textKey / childrenKey / tipKey。
 *
 * 选项的 value / 文案 / 子级 / 提示字段名完全可配；lineTheme / lineHeight
 * 控制当前列指示条（数字按 rpx 设计值，1 设计值 = 2rpx）。
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

/** 自定义字段名：id / name / items，靠 *-key 映射；行内提示用 tipKey。 */
const tree = [
  {
    id: 'zj',
    name: '浙江',
    items: [
      { id: 'hz', name: '杭州', tips: '省会' },
      { id: 'nb', name: '宁波', tips: '港口' },
    ],
  },
  {
    id: 'js',
    name: '江苏',
    items: [{ id: 'nj', name: '南京', tips: '省会' }],
  },
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
      >valueKey="id" / textKey="name" / childrenKey="items" / tipKey="tips"；指示条 lineTheme="text"
      + lineHeight。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="常驻城市"
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
      value-key="id"
      text-key="name"
      children-key="items"
      tip-key="tips"
      title="选择城市"
      check-strictly
      confirm-text="就它"
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
