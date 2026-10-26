<script setup lang="ts">
/** Demo: sn-sort-button — allowReset 把 0 纳入循环；descFirst 首次点击进入降序；line 加下划线。 */
import { ref } from 'vue';
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue';

const a = ref<1 | 0 | -1>(0);
const b = ref<1 | 0 | -1>(0);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSortButton v-model="a" title="销量" allow-reset line />
    <SnSortButton v-model="b" title="评分" desc-first allow-reset />
    <text class="sn-demo__meta">销量：{{ a }} / 评分：{{ b }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
