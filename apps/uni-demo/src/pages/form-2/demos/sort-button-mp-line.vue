<script setup lang="ts">
/** Demo: sn-sort-button — 下划线：line 给按钮文字加下划线。 */
import { ref } from 'vue';
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue';

const a = ref<1 | 0 | -1>(1);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSortButton v-model="a" title="销量" line />
    <text class="sn-demo__meta">line：文字带下划线</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
