<script setup lang="ts">
/** Demo: sn-picker-view — wheel 风格多列：时 / 分 / AM-PM 三列滚轮，胶囊高亮带横跨整行。 */
import { ref } from 'vue';
import SnPickerView from '@snui/uni-src/components/sn-picker-view/sn-picker-view.vue';

const hours = [7, 8, 9, 10, 11];
const minutes = [28, 29, 30, 31, 32];
const meridiem = ['AM', 'PM'];
const value = ref<Array<string | number>>([9, 30, 'AM']);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnPickerView v-model="value" :columns="[hours, minutes, meridiem]" wheel :visible-item-count="5" />
    <text class="sn-demo__meta">已选：{{ value.join(' : ') }}（三列共享同一条胶囊高亮带）</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
