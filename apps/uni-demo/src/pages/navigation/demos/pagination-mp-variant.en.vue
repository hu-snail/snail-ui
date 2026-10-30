<script setup lang="ts">
/**
 * Demo: sn-pagination — the four button variants and total-derived pages.
 *
 * One grouped card per variant: a title plus a single pager instance, with
 * spacing / border / radius all coming from `--sn-mp-*` tokens so the four
 * groups line up horizontally and sit flush vertically. Each instance keeps
 * its own page so they never drag each other around.
 *
 * `total` + `page-size` wins over `total-page`: 95 records at 10 per page
 * gives 10 pages.
 */
import { ref } from 'vue';
import SnPagination from '@snui/uni-src/components/sn-pagination/sn-pagination.vue';

/** 95 records at 10 per page → 10 pages, shared by all four variants. */
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
      <text class="sn-demo__group-title">text · plain text (default)</text>
      <SnPagination
        v-model="pageText"
        :total="total"
        :page-size="size"
        button-variant="text"
        show-icon
      />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">base · border + fill</text>
      <SnPagination
        v-model="pageBase"
        :total="total"
        :page-size="size"
        button-variant="base"
        show-icon
      />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">plain · brand border</text>
      <SnPagination
        v-model="pagePlain"
        :total="total"
        :page-size="size"
        button-variant="plain"
        show-icon
      />
    </view>

    <view class="sn-demo__group">
      <text class="sn-demo__group-title">dashed · dashed border</text>
      <SnPagination
        v-model="pageDashed"
        :total="total"
        :page-size="size"
        button-variant="dashed"
        show-icon
      />
    </view>

    <text class="sn-demo__meta">
      total=95 with page-size=10 gives 10 pages; the variant only changes border
      and fill, and the step icons always take --sn-mp-icon-size-medium.
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
