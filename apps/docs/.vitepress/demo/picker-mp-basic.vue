<script setup lang="ts">
/** Demo: sn-picker — sn-picker 弹层选择器：v-model:visible 控制显隐，滚动只改草稿，确认才写 v-model。 */
import { ref } from 'vue'
import SnPicker from '@snui/uni-src/components/sn-picker/sn-picker.vue'

const fruits = ['苹果', '香蕉', '樱桃']
const picked = ref<Array<string | number>>(['苹果'])
const open = ref(false)
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__button" @tap="open = true">选择水果</view>
    <text class="sn-demo__meta">已选：{{ picked.join(' / ') || '（未选择）' }}</text>
    <SnPicker v-model="picked" v-model:visible="open" :columns="[fruits]" title="选择水果" />
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
