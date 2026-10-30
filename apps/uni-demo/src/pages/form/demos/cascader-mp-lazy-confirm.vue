<script setup lang="ts">
/**
 * Demo: sn-cascader — 异步加载与确认拦截：lazyLoad / isLeafKey / beforeConfirm。
 *
 * 懒加载根节点只有地区；展开非叶子节点时向宿主请求子级。beforeConfirm 只放行
 * 浙江分支，结果用一个 sn-cell 卡片行回报（守卫：待确认 / 已允许 / 只支持浙江）。
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
const lastGuard = ref('待确认');

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

/** 只允许确认浙江分支。 */
const guard = (payload: { value: string | number | Array<string | number> }) => {
  const first = Array.isArray(payload.value) ? payload.value[0] : payload.value;
  const allowed = first === 'zj' || first === 'hz' || first === 'nb';
  lastGuard.value = allowed ? '已允许' : '只支持浙江';
  return allowed;
};

const selectedText = computed(() =>
  Array.isArray(value.value)
    ? value.value.map((each) => TEXT[String(each)] ?? String(each)).join(' / ')
    : (TEXT[String(value.value)] ?? ''),
);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label"
      >lazyLoad 按需请求子级；isLeafKey 标记叶子；beforeConfirm
      拦截确认，进度由守卫卡片行回报。</text
    >
    <view class="sn-demo__cards">
      <SnCell
        card
        title="收货地区"
        placeholder="请选择"
        :value="selectedText"
        is-link
        @click="open = true"
      />
      <SnCell card title="确认守卫" :value="lastGuard" />
    </view>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      :lazy-load="load"
      is-leaf-key="isLeaf"
      check-strictly
      :before-confirm="guard"
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
