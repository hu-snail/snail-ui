<script setup lang="ts">
/** Demo: sn-cascader — checkStrictly 允许确认任意层级，并显示确认按钮；lazyLoad 在展开非叶子节点时向宿主请求子级。 */
import { ref } from 'vue'
import SnCascader from '@snui/uni-src/components/sn-cascader/sn-cascader.vue'

const tree = [
  { value: 'zj', text: '浙江', children: [{ value: 'hz', text: '杭州' }, { value: 'nb', text: '宁波' }] },
  { value: 'js', text: '江苏', children: [{ value: 'nj', text: '南京' }] },
]
const strictValue = ref<string | number>('zj')
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">任意级可选</view>
    <text class="sn-demo__meta">已选：{{ strictValue || '（未选择）' }}</text>
    <SnCascader
      v-model="strictValue"
      v-model:visible="open"
      :options="tree"
      check-strictly
      title="任意级可选"
      line-theme="underline"
    />
  </view>
</template>

<style scoped>
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
