<script setup lang="ts">
/**
 * Demo: sn-cascader — 异步加载（lazyLoad）。
 *
 * 懒加载根节点只有地区；展开非叶子节点时向宿主请求子级，isLeafKey 标记叶子。
 */
import { computed, ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';

/** 懒加载根节点：isLeaf 决定是否还能下钻。 */
const tree = [
  { value: 'zj', text: '浙江', isLeaf: false },
  { value: 'js', text: '江苏', isLeaf: false },
  { value: 'sh', text: '上海', isLeaf: true },
];

/** 值 → 展示文案（懒加载模式 v-model 是路径数组）。 */
const TEXT: Record<string, string> = {
  zj: '浙江',
  hz: '杭州',
  nb: '宁波',
  js: '江苏',
  nj: '南京',
  sh: '上海',
};

const value = ref<string | number | Array<string | number>>([]);
const open = ref(false);

const children: Record<string, Array<Record<string, unknown>>> = {
  zj: [
    { value: 'hz', text: '杭州', isLeaf: true },
    { value: 'nb', text: '宁波', isLeaf: true },
  ],
  js: [{ value: 'nj', text: '南京', isLeaf: true }],
};

/** 展开非叶子节点时向宿主请求子级。 */
const load = (
  option: Record<string, unknown>,
  _tabIndex: number,
  resolve: (children: Array<Record<string, unknown>>) => void,
) => {
  resolve(children[String(option.value)] ?? []);
};

const selectedText = computed(() =>
  Array.isArray(value.value)
    ? value.value.map((each) => TEXT[String(each)] ?? String(each)).join(' / ')
    : (TEXT[String(value.value)] ?? ''),
);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">lazyLoad 按需请求子级；isLeafKey 标记叶子。</text>
    <view class="sn-demo__cards">
      <SnCell
        card
        title="收货地区"
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
      :lazy-load="load"
      is-leaf-key="isLeaf"
      check-strictly
      title="收货地区"
      confirm-text="就它"
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
