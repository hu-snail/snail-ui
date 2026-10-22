<script setup lang="ts">
/** Demo: SnTransfer — 选项级 disabled 不可迁移 + 组件级 disabled 整体禁用对照。 */
import { ref } from 'vue'
import { Lock } from 'lucide-vue-next'
import { registerSnIcons, SnIcon, SnTransfer } from '@snui/vue-web'

interface DemoOption {
  label: string
  value: string
  disabled?: boolean
}

registerSnIcons({ Lock })

/** 本地造 18 条服务节点数据，含 3 条锁定（disabled）项。 */
const LOCKED = new Set([3, 7, 12])

function toOption(n: number): DemoOption {
  const locked = LOCKED.has(n)
  const option: DemoOption = {
    label: `Service node ${String(n).padStart(2, '0')}${locked ? ' (locked)' : ''}`,
    value: `node-${n}`,
  }
  if (locked) option.disabled = true
  return option
}

const options: DemoOption[] = Array.from({ length: 18 }, (_, i) => toOption(i + 1))

const movableTarget = ref<string[]>(['node-1', 'node-3'])
const frozenTarget = ref<string[]>(['node-2', 'node-5'])
</script>

<template>
  <div class="transfer-demo">
    <div class="transfer-demo__block">
      <span class="transfer-demo__label">Option-level disabled — locked items are greyed out and can neither be checked nor moved</span>
      <SnTransfer v-model:value="movableTarget" :options="options" source-title="All nodes" target-title="Enabled nodes" />
      <p class="transfer-demo__hint">Enabled:{{ movableTarget.join(',') || '(empty)' }}</p>
    </div>
    <div class="transfer-demo__block">
      <span class="transfer-demo__label transfer-demo__label--icon">
        <SnIcon :icon="Lock" :size="14" />
        Component-level disabled — read-only as a whole; move buttons and check-all no longer work
      </span>
      <SnTransfer :value="frozenTarget" :options="options" disabled source-title="All nodes" target-title="Enabled nodes" />
    </div>
  </div>
</template>

<style scoped>
.transfer-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.transfer-demo__block {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transfer-demo__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.transfer-demo__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
