<script setup lang="ts">
/**
 * Demo: sn-loadmore (uni-end) — the three states + retry.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-loadmore from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnLoadmore from '@snui/uni-src/components/sn-loadmore/sn-loadmore.vue';

type State = '' | 'loading' | 'finished' | 'error';
const state = ref<State>('loading');
const retries = ref(0);

function reload(): void {
  retries.value += 1;
  state.value = 'loading';
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-loadmore-demo__row">
      <SnButton size="small" @tap="state = 'loading'">loading</SnButton>
      <SnButton size="small" @tap="state = 'finished'">finished</SnButton>
      <SnButton size="small" @tap="state = 'error'">error</SnButton>
    </view>

    <SnLoadmore :state="state" @reload="reload" />
    <text class="sn-loadmore-demo__meta">Retried {{ retries }} time(s)</text>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-loadmore-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-loadmore-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
</style>
