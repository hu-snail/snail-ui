<script setup lang="ts">
/**
 * Demo: sn-pagination — 四种按钮风格（button-variant）与 total 推导页数。
 *
 * 每个风格一个分组卡片：标题 + 一个分页器实例，间距 / 描边 / 圆角全部走
 * `--sn-mp-*` token，四组横向对齐、纵向等距。四个实例各自持有页码，
 * 避免互相带动。
 *
 * `total` + `page-size` 优先于 `total-page`：给 95 条 / 每页 10 条即 10 页。
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

/** 每页 10 条共 95 条 → 10 页，四种风格共用同一份数据。 */
const total = 95;
const size = 10;

const pageText = ref(3);
const pageBase = ref(3);
const pagePlain = ref(3);
const pageDashed = ref(3);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__group">
      <text class="sn-demo__group-title">text · 纯文字（默认）</text>
      <SnPagination v-model="pageText" :total="total" :page-size="size" button-variant="text" show-icon />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">base · 描边 + 底色</text>
      <SnPagination v-model="pageBase" :total="total" :page-size="size" button-variant="base" show-icon />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">plain · 主色描边</text>
      <SnPagination v-model="pagePlain" :total="total" :page-size="size" button-variant="plain" show-icon />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">dashed · 虚线描边</text>
      <SnPagination
        v-model="pageDashed"
        :total="total"
        :page-size="size"
        button-variant="dashed"
        show-icon
      />
    </view>

    <text class="sn-demo__meta">
      total=95 / page-size=10 → 10 页；风格只改描边与底色，翻页图标统一走
      --sn-mp-icon-size-medium。
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__group {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  padding: var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__group-title {
  font-size: var(--sn-mp-font-size-xs);
  font-weight: var(--sn-mp-font-weight-medium);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
