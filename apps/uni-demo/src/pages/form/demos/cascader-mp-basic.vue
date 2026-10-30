<script setup lang="ts">
/**
 * Demo: sn-cascader — 基础用法：静态模式逐级下钻，点中叶子即确认并关闭。
 *
 * 触发入口用 sn-cell 卡片行（card + is-link）：标题是字段名，右侧显示已选
 * 文案（未选时走 placeholder），整行可点。
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

const value = ref<string | number>('hz');
const open = ref(false);
const selectedText = computed(() => TEXT[String(value.value)] ?? '');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">静态模式：逐级 tap 下钻，点中叶子即确认并关闭。</text>
    <view class="sn-demo__cards">
      <SnCell
        card
        title="常驻地区"
        placeholder="请选择"
        :value="selectedText"
        is-link
        @click="open = true"
      />
    </view>
    <SnCascader v-model="value" v-model:visible="open" :options="tree" title="配送地区" />
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
