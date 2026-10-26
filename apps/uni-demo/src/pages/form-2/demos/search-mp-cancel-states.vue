<script setup lang="ts">
/** Demo: sn-search — 取消文案 / 隐藏取消 / 禁用 / 左对齐占位。 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const query = ref('snail');
const lastCancel = ref('—');
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__title">cancelTxt + cancel 事件</text>
    <SnSearch v-model="query" cancel-txt="清空搜索" @cancel="lastCancel = $event" />
    <text class="sn-demo__meta">cancel 载荷：{{ lastCancel }}</text>

    <text class="sn-demo__title">hideCancel</text>
    <SnSearch v-model="query" hide-cancel placeholder="无右侧文案" />

    <text class="sn-demo__title">placeholderLeft</text>
    <SnSearch v-model="query" placeholder-left placeholder="占位文本左对齐" />

    <text class="sn-demo__title">disabled</text>
    <SnSearch v-model="query" disabled placeholder="禁用态" />
  </view>
</template>

<style scoped>
.sn-demo__title {
  font-size: 26rpx;
  font-weight: 600;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
