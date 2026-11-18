<script setup lang="ts">
/** Demo: sn-picker-view — wheel style multi-column: hour / minute / AM-PM rollers sharing one pill band. */
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
    <text class="sn-demo__meta">Selected: {{ value.join(' : ') }} (all columns share one pill band)</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
