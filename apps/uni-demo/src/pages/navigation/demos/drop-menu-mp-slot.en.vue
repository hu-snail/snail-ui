<script setup lang="ts">
/**
 * Demo: sn-drop-menu — English shadow of drop-menu-mp-slot.
 *
 * The default slot replaces the option list (the panel and animation are reused).
 *
 * Docs-preview only: `custom-class="sn-demo-contained"` keeps the panel's
 * positioning context inside the demo.
 */
import { ref } from 'vue';
import SnDropMenu from '@snui/uni-src/components/sn-drop-menu/sn-drop-menu.vue';

const customValue = ref('7d');

const customOptions = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnDropMenu
      v-model="customValue"
      :options="customOptions"
      title="Custom panel"
      custom-class="sn-demo-contained"
    >
      <view class="sn-demo__custom">
        <text
          v-for="option in customOptions"
          :key="option.value"
          class="sn-demo__custom-item"
          @tap="customValue = option.value"
        >
          {{ option.label }}{{ customValue === option.value ? ' ✓' : '' }}
        </text>
      </view>
    </SnDropMenu>

    <text class="sn-demo__meta">Selected: {{ customValue }}</text>
  </view>
</template>

<style scoped>
.sn-demo__meta {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-tertiary);
}
.sn-demo__custom {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
}
.sn-demo__custom-item {
  font-size: 24rpx;
  color: var(--sn-mp-color-text-primary);
}
/* Docs-preview only — the panel is absolutely positioned inside the root. */
.sn-demo :deep(.sn-drop-menu.sn-demo-contained) {
  position: relative;
}
</style>
