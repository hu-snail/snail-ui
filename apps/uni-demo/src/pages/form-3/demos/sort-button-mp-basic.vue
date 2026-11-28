<script setup lang="ts">
/** Demo: sn-sort-button — sn-sort-button 三态排序：1 升序 / 0 重置 / -1 降序；默认在升序与降序之间切换。 */
import { ref, computed } from 'vue';
import SnSortButton from '@snui/uni-src/components/sn-sort-button/sn-sort-button.vue';

const direction = ref<1 | 0 | -1>(0);
const label = computed(() =>
  direction.value === 1 ? '升序' : direction.value === -1 ? '降序' : '未排序',
);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnSortButton v-model="direction" title="价格" />
    <text class="sn-demo__meta">当前方向：{{ label }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
