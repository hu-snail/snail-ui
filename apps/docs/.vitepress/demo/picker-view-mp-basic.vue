<script setup lang="ts">
/** Demo: sn-picker-view — sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。 */
import { ref } from 'vue'
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue'

const fruits = ['苹果', '香蕉', '樱桃', '葡萄']
const value = ref<Array<string | number>>(['苹果'])
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView v-model="value" :columns="[fruits]" />
    <text class="sn-demo__meta">已选：{{ value[0] }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
