<script setup lang="ts">
/** Demo: sn-cascader — 异步加载与确认拦截：lazyLoad / isLeafKey / beforeConfirm / checkStrictly。 */
import { ref } from 'vue';
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue';

/** 懒加载根节点：isLeaf 决定是否还能下钻。 */
const tree = [
  { value: 'zj', text: '浙江', isLeaf: false },
  { value: 'js', text: '江苏', isLeaf: false },
  { value: 'sh', text: '上海', isLeaf: true },
];

const value = ref<string | number | Array<string | number>>([]);
const open = ref(false);
const lastGuard = ref('—');

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

const selectedText = () => (Array.isArray(value.value) ? value.value.join(' / ') : value.value);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__title">lazyLoad + isLeafKey + beforeConfirm + checkStrictly</text>
    <view class="sn-demo__button" @tap="open = true">懒加载</view>
    <text class="sn-demo__meta">已选：{{ selectedText() || '（未选择）' }}</text>
    <text class="sn-demo__meta">守卫：{{ lastGuard }}</text>
    <SnCascader
      v-model="value"
      v-model:visible="open"
      :options="tree"
      :lazy-load="load"
      is-leaf-key="isLeaf"
      check-strictly
      :before-confirm="guard"
      title="懒加载"
      confirm-text="就它"
    />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}

.sn-demo__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 72rpx;
  padding: 0 32rpx;
  border-radius: var(--sn-mp-button-radius);
  background-color: var(--sn-mp-color-action-primary);
  color: var(--sn-mp-color-text-on-primary);
  font-size: 28rpx;
}

.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
