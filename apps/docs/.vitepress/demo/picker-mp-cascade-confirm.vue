<script setup lang="ts">
/** Demo: sn-picker — cascade 让 columns 变成树，确认时返回完整路径；beforeConfirm 返回 false 时弹层不关闭、v-model 不写。 */
import { ref } from 'vue'
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue'

const tree = [
  { value: 'zj', label: '浙江', children: [{ value: 'hz', label: '杭州' }, { value: 'nb', label: '宁波' }] },
  { value: 'js', label: '江苏', children: [{ value: 'nj', label: '南京' }] },
]
const region = ref<Array<string | number>>(['zj', 'hz'])
const open = ref(false)
// 只允许确认「浙江」分支 —— 用来演示 beforeConfirm 拦截。
const guard = (payload: { value: Array<string | number> }) => payload.value[0] === 'zj'
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择地区</view>
    <text class="sn-demo__meta">已选：{{ region.join(' / ') || '（未选择）' }}</text>
    <SnPicker
      v-model="region"
      v-model:visible="open"
      :columns="tree"
      cascade
      title="选择地区"
      confirm-button-text="就它"
      :before-confirm="guard"
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
