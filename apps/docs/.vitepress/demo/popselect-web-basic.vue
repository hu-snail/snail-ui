<script setup lang="ts">
/**
 * Demo: SnPopselect — single select, selected state, disabled and groups.
 */
import { ref } from 'vue'
import { SnButton, SnPopselect } from '@snui/vue-web'

const options = [
  { label: '产品', value: 'group-product', children: [
    { label: '需求池', value: 'demand' },
    { label: '缺陷池', value: 'bug' },
  ] },
  { label: '研发', value: 'group-dev', children: [
    { label: '迭代任务', value: 'iteration' },
    { label: '技术债', value: 'debt', disabled: true },
  ] },
]

const selected = ref<string | null>(null)

const valueText: Record<string, string> = {
  demand: '需求池',
  bug: '缺陷池',
  iteration: '迭代任务',
  debt: '技术债（禁用）',
}
</script>

<template>
  <div class="popselect-demo">
    <div class="popselect-demo__row">
      <SnPopselect v-model:value="selected" :options="options">
        <SnButton>{{ selected ? `已选：${valueText[selected] ?? selected}` : '选择任务类型' }}</SnButton>
      </SnPopselect>
      <span class="popselect-demo__state">value = {{ selected ?? 'null' }}</span>
    </div>
    <p class="popselect-demo__hint">
      选中行以主色文字 + 对勾标记；选择后菜单关闭。「技术债」为禁用项，键盘高亮会自动跳过。
    </p>
  </div>
</template>

<style scoped>
.popselect-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popselect-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popselect-demo__state {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}

.popselect-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
