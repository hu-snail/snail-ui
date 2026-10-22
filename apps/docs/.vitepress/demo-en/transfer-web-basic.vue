<script setup lang="ts">
/** Demo: SnTransfer — 双面板穿梭 + 移动按钮 + 已选回显。 */
import { ref } from 'vue'
import { SnTransfer } from '@snui/vue-web'

const options = Array.from({ length: 8 }, (_, i) => ({
  value: `opt-${i + 1}`,
  label: `Option ${i + 1}`,
}))

const target = ref<string[]>(['opt-1'])
</script>

<template>
  <div class="transfer-demo">
    <SnTransfer v-model:value="target" :options="options" />
    <p class="transfer-demo__hint">Selected: {{ target.join(', ') || '(empty)' }}</p>
  </div>
</template>

<style scoped>
.transfer-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transfer-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
