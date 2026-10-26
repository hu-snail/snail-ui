<script setup lang="ts">
/**
 * Demo: sn-empty (uni-end) — image slot + bottom action slot.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-empty from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnEmpty from '@snui/uni-src/components/sn-empty/sn-empty.vue';

const retries = ref(0);

function retry(): void {
  retries.value += 1;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnEmpty tip="Something went wrong">
      <template #bottom>
        <SnButton type="primary" size="small" @click="retry">Reload</SnButton>
      </template>
    </SnEmpty>

    <SnEmpty tip="No work yet">
      <template #image>
        <view class="sn-empty-demo__glyph">
          <text class="sn-empty-demo__glyph-text">0</text>
        </view>
      </template>
      <template #bottom>
        <text class="sn-empty-demo__meta">Custom image slot + retried {{ retries }} times</text>
      </template>
    </SnEmpty>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}
.sn-empty-demo__glyph {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160rpx;
  height: 160rpx;
  border: 4rpx dashed var(--sn-mp-color-border-default);
  border-radius: 80rpx;
}
.sn-empty-demo__glyph-text {
  font-size: 56rpx;
  color: var(--sn-mp-color-text-disabled);
}
.sn-empty-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-secondary);
}
</style>
