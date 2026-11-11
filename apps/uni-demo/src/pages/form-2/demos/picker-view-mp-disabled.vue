<script setup lang="ts">
/** Demo: sn-picker-view — disabled 整列不可交互，滚轮冻结在当前值。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const fruits = ['苹果', '香蕉', '樱桃'];
const locked = ref<Array<string | number>>(['香蕉']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView v-model="locked" :columns="[fruits]" disabled />
    <text class="sn-demo__meta">disabled：拖动无效，值停在 {{ locked.join(' / ') }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
