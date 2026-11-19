<script setup lang="ts">
/**
 * Demo: sn-notify (uni-end) — multi-message deck stacking and the bottom
 * anchor.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-notify from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnNotify from '@snui/uni-src/components/sn-notify/sn-notify.vue';
import type { SnNotifyInstance } from '@snui/uni-src/components/sn-notify/sn-notify-types';

const top = ref<SnNotifyInstance | null>(null);
const bottom = ref<SnNotifyInstance | null>(null);

/** Fire three messages: the newest fronts the deck, older cards peek below. */
function showStack(): void {
  top.value?.show({
    title: 'Third notification',
    description: 'Deepest in the deck — only its bottom edge peeks out',
  });
  top.value?.show({
    title: 'Second notification',
    description: 'Slots into the middle and pushes the others down',
    type: 'warning',
  });
  top.value?.show({
    title: 'Newest notification',
    description: 'Slides in smoothly from the top edge',
    type: 'success',
  });
}

function showBottom(): void {
  bottom.value?.show({
    title: 'Slid in from the bottom',
    description: 'Bottom-anchored stack, swipe-to-dismiss works here too',
    type: 'primary',
  });
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" variant="soft" block @tap="showStack">Stack three toasts</SnButton>
    <SnButton block variant="soft" @tap="top?.hideAll()">Hide top toasts</SnButton>
    <SnButton type="primary" variant="soft" block @tap="showBottom">Bottom toast (position="bottom")</SnButton>
    <SnButton block variant="soft" @tap="bottom?.hideAll()">Hide bottom toasts</SnButton>

    <text class="sn-demo__meta">
      maxVisible defaults to 3: the oldest card closes with reason overflow when
      a fourth arrives; the front card supports horizontal swipe-to-dismiss.
    </text>

    <SnNotify ref="top" custom-class="sn-demo-contained" />
    <SnNotify ref="bottom" position="bottom" custom-class="sn-demo-contained" />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-notify.sn-demo-contained {
  position: absolute;
}
</style>
