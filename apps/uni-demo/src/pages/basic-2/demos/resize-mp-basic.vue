<script setup lang="ts">
/**
 * Demo: sn-resize — report the measured box when content changes size.
 *
 * Tapping "add" grows the content, which the observer picks up on the next
 * poll and reports through `resize`.
 */
import { ref } from 'vue';
import SnResize from '@snui/uni-src/components/sn-resize/sn-resize.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

const rows = ref(2);
const box = ref('—');

function onResize(rect: { width: number; height: number }): void {
  box.value = `${rect.width} × ${rect.height}`;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnResize custom-container-class="sn-resize-demo__box" @resize="onResize">
      <view class="sn-resize-demo__content">
        <view v-for="i in rows" :key="i" class="sn-resize-demo__row">第 {{ i }} 行</view>
      </view>
    </SnResize>

    <view class="sn-resize-demo__meta">测量结果：{{ box }}</view>

    <view class="sn-resize-demo__actions">
      <SnButton size="small" @tap="rows += 1">增加一行</SnButton>
      <SnButton size="small" plain @tap="rows = 2">重置</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-resize-demo__box {
  padding: 8px;
  border: 1px dashed var(--sn-mp-color-border-default);
  border-radius: 8px;
}

.sn-resize-demo__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sn-resize-demo__row {
  padding: 6px 10px;
  border-radius: 6px;
  background: var(--sn-mp-color-background-subtle);
  font-size: 13px;
  color: var(--sn-mp-color-text-primary);
}

.sn-resize-demo__meta {
  font-family: var(--sn-mp-font-family-mono, monospace);
  font-size: 12px;
  color: var(--sn-mp-color-text-secondary);
}

.sn-resize-demo__actions {
  display: flex;
  gap: 8px;
}
</style>
