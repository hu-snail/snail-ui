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
    label: `服务节点 ${String(n).padStart(2, '0')}${locked ? '（锁定）' : ''}`,
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
      <span class="transfer-demo__label">选项级 disabled — 锁定项置灰，不可勾选不可迁移</span>
      <SnTransfer v-model:value="movableTarget" :options="options" source-title="全部节点" target-title="启用节点" />
      <p class="transfer-demo__hint">已启用：{{ movableTarget.join('、') || '（空）' }}</p>
    </div>
    <div class="transfer-demo__block">
      <span class="transfer-demo__label transfer-demo__label--icon">
        <SnIcon :icon="Lock" :size="14" />
        组件级 disabled — 整体只读，移动按钮与勾选全部失效
      </span>
      <SnTransfer :value="frozenTarget" :options="options" disabled source-title="全部节点" target-title="启用节点" />
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
