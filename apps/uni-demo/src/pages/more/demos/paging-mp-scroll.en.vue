<script setup lang="ts">
/**
 * Demo: sn-paging (uni-end) — Plain scroll container with gesture switches.
 *
 * - With `refresher-enabled=false` + `load-more-enabled=false`, sn-paging
 *   degrades into a plain scroll container: free scrolling of long content,
 *   no requests, no footer
 * - Both switches take effect immediately: enable refresh only, load-more
 *   only, or turn both off at any time
 */
import { ref } from 'vue';
import SnPaging from '@snui/uni-src/components/sn-paging/sn-paging.vue';
import SnSwitch from '@snui/uni-src/components/sn-switch/sn-switch.vue';

const rows = Array.from({ length: 40 }, (_, i) => `Row ${i + 1} · plain scroll content`);
const refresherOn = ref(false);
const loadMoreOn = ref(false);
const message = ref('No gestures enabled: the list just scrolls');

function onQuery(): void {
  /* Container mode should never fire; the message proves the switch works live. */
  message.value = 'A gesture triggered query — the switch took effect';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="paging-switches">
      <view class="paging-switches__item">
        <text class="paging-switches__label">Pull to refresh</text>
        <SnSwitch v-model="refresherOn" :size="44" />
      </view>
      <view class="paging-switches__item">
        <text class="paging-switches__label">Load more</text>
        <SnSwitch v-model="loadMoreOn" :size="44" />
      </view>
    </view>
    <text class="sn-demo__meta">{{ message }}</text>

    <view class="paging-frame">
      <SnPaging :refresher-enabled="refresherOn" :load-more-enabled="loadMoreOn" @query="onQuery">
        <view v-for="row in rows" :key="row" class="paging-row">
          <text class="paging-row__label">{{ row }}</text>
        </view>
      </SnPaging>
    </view>
  </view>
</template>

<style scoped>
.paging-switches {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-5);
}

.paging-switches__item {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--sn-mp-spacing-2);
}

.paging-switches__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-sm);
  line-height: var(--sn-mp-font-line-height-normal);
}

.paging-frame {
  box-sizing: border-box;
  height: 520rpx;
  border: 2rpx solid var(--sn-mp-color-border-default);
  border-radius: var(--sn-mp-radius-md);
  overflow: hidden;
}

.paging-row {
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
  background-color: var(--sn-mp-color-background-surface);
}

.paging-row__label {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  line-height: var(--sn-mp-font-line-height-normal);
}
</style>
