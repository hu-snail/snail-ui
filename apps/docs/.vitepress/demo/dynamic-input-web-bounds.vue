<script setup lang="ts">
/** Demo: SnDynamicInput — min / max bounds. */
import { ref } from 'vue';
import { SnDynamicInput } from '@snui/vue-web';
const items = ref<string[]>(['固定 A', '固定 B']);
</script>

<template>
  <div class="demo-col">
    <SnDynamicInput v-model="items" :preset="() => ''" :min="1" :max="3" style="max-width: 360px" />
    <span class="demo-log">min=1 max=3，到界隐藏 −/+（当前 {{ items.length }} 项）</span>
  </div>
</template>

<style scoped>
.demo-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}
.demo-log {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
