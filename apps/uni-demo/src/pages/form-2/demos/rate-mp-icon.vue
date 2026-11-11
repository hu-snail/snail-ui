<script setup lang="ts">
/**
 * Demo: sn-rate — 自定义图标：icon / activeIcon 是注册表名字（这里先注册 Heart），
 * iconPrefix 仅为对齐用的信息字段，color / activeColor 覆盖未选中与选中颜色。
 */
import { ref } from 'vue';
import SnRate from '@snui/uni-src/components/sn-rate/sn-rate.vue';
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import { Heart } from '@snui/uni-src/components/sn-icon/sn-icon-set';

registerSnIcons({ Heart });

const hearts = ref<number | null>(3);
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnRate
      v-model="hearts"
      icon="Heart"
      active-icon="Heart"
      icon-prefix="demo-icon"
      color="var(--sn-mp-color-text-tertiary)"
      active-color="var(--sn-mp-color-feedback-danger)"
    />
    <text class="sn-demo__meta">icon / activeIcon 走注册表（Heart），iconPrefix 仅为对齐保留</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
