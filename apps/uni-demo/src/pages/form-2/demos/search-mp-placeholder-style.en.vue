<script setup lang="ts">
/**
 * Demo: sn-search — placeholder styling (`placeholderStyle` / `placeholderClass`).
 *
 * `placeholder-style` is an inline declaration string and `placeholder-class`
 * a class name for the placeholder pseudo-element — both affect only the
 * placeholder text, never the typed value.
 *
 * In the browser preview `placeholder-style` / `placeholder-class` are
 * uni-only attributes that a native `<input>` ignores, so the styles below also
 * use `::placeholder` to keep the effect visible.
 */
import { ref } from 'vue';
import SnSearch from '@snui/uni-src/components/sn-search/sn-search.vue';

const inline = ref('');
const classed = ref('');
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnSearch
      v-model="inline"
      placeholder="Inline placeholder style"
      placeholder-style="color: var(--sn-mp-color-feedback-danger); font-size: 26rpx;"
    />
    <text class="sn-demo__meta">placeholderStyle: inline declarations tint the placeholder</text>

    <SnSearch
      v-model="classed"
      placeholder="Placeholder class"
      placeholder-class="sn-demo__placeholder"
    />
    <text class="sn-demo__meta"
      >placeholderClass: the placeholder text is styled through a class</text
    >
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  align-items: stretch;
  width: 100%;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* Visible fallback in the browser preview: uni's placeholder-class targets the pseudo-element. */
.sn-demo :deep(.sn-demo__placeholder)::placeholder,
.sn-demo :deep(input)::placeholder {
  color: var(--sn-mp-color-text-tertiary);
  font-style: italic;
}
</style>
