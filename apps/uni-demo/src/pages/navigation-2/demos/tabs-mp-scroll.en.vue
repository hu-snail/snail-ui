<script setup lang="ts">
/**
 * Demo: sn-tabs — scroll navigation and auto scroll-into-view
 * (slidableNum / slidable / scroll-into-view).
 *
 * - `slidable-num` is the tab-count threshold for turning scrolling on: above it
 *   the strip scrolls horizontally, below it the tabs share the full width
 * - `slidable="always"` forces scrolling regardless of the threshold
 * - `show-scrollbar` reveals the `scroll-view` scrollbar
 * - the selected tab (by tap or an external `v-model` write) scrolls into view
 *   through `scroll-into-view`; `animated` makes that scroll transition
 * - `color` / `inactive-color` override the active / inactive label colour inline
 * - `custom-class` / `custom-style` land on the root node
 */
import { ref } from 'vue';
import SnTabs from '@snui/uni-src/components/sn-tabs/sn-tabs.vue';
import SnTab from '@snui/uni-src/components/sn-tabs/sn-tab.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const many = ['For you', 'Following', 'Trending', 'Video', 'Live', 'Local', 'Q&A', 'Columns'];
const activeScroll = ref(0);
const activeFixed = ref(0);

/** An external value write must also pull the target tab into view. */
function jumpToLast(): void {
  activeScroll.value = many.length - 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <text class="sn-demo__label"
      >slidable-num=4 with 8 tabs → the strip scrolls and keeps the selection in view</text
    >
    <SnTabs
      v-model="activeScroll"
      :slidable-num="4"
      animated
      show-scrollbar
      color="var(--sn-mp-color-action-primary)"
      inactive-color="var(--sn-mp-color-text-tertiary)"
      custom-class="sn-demo__tabs"
    >
      <SnTab v-for="(title, index) in many" :key="title" :title="title" :name="index">
        {{ title }} content
      </SnTab>
    </SnTabs>
    <SnButton size="small" @click="jumpToLast">Jump to the last channel</SnButton>

    <text class="sn-demo__label">slidable="always" scrolls even with 3 tabs</text>
    <SnTabs
      v-model="activeFixed"
      slidable="always"
      custom-style="background-color: var(--sn-mp-color-background-subtle);"
    >
      <SnTab title="All" :name="0">All items</SnTab>
      <SnTab title="Unpaid" :name="1">Unpaid items</SnTab>
      <SnTab title="Completed" :name="2">Completed items</SnTab>
    </SnTabs>

    <text class="sn-demo__meta">Active tab: {{ activeScroll }} / {{ activeFixed }}</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-4);
  align-items: stretch;
}
.sn-demo__label {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
/* custom-class lands on the sn-tabs root, so it needs :deep to reach. */
.sn-demo :deep(.sn-demo__tabs) {
  border-radius: var(--sn-mp-radius-sm);
}
</style>
