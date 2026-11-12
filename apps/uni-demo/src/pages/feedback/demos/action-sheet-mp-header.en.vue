<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — English shadow of action-sheet-mp-header.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue';

const open = ref(false);
const picked = ref('—');

const actions = [{ name: 'Option one' }, { name: 'Option two' }, { name: 'Option three' }];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="open = true">Open action panel</SnButton>
    <text class="sn-action-sheet-demo__meta">Picked: {{ picked }}</text>

    <SnActionSheet
      v-model="open"
      title="Title"
      description="This is a description line"
      show-close
      :actions="actions"
      cancel-text="Cancel"
      custom-class="sn-demo-contained"
      @select="picked = $event.item.name ?? ''"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-action-sheet-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
/* #endif */
</style>
