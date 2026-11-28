<script setup lang="ts">
/** Demo: SnButton (Web) — text / ghost / dashed 变体 × 语义类型全矩阵。 */
import { SnButton } from '@snui/vue-web';

type ButtonType = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';

/** 三档变体的分组标签（括号内为 API 名）。 */
const variants = [
  { key: 'text', label: '文字（text）' },
  { key: 'ghost', label: '幽灵（ghost）' },
  { key: 'dashed', label: '虚线（dashed）' },
] as const;

/** 每组展示的语义类型。 */
const types: Array<{ key: ButtonType; label: string }> = [
  { key: 'default', label: '默认按钮' },
  { key: 'primary', label: '主要按钮' },
  { key: 'success', label: '成功按钮' },
  { key: 'info', label: '信息按钮' },
  { key: 'warning', label: '警告按钮' },
  { key: 'error', label: '危险按钮' },
];
</script>

<template>
  <div class="sn-demo sn-demo--stack">
    <div v-for="variant in variants" :key="variant.key" class="sn-demo__group">
      <p class="sn-demo__label">{{ variant.label }}</p>
      <div class="sn-demo__row">
        <SnButton
          v-for="item in types"
          :key="item.key"
          :type="item.key"
          :text="variant.key === 'text'"
          :ghost="variant.key === 'ghost'"
          :dashed="variant.key === 'dashed'"
        >
          {{ variant.key === 'text' ? '按钮' : item.label }}
        </SnButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.sn-demo__group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
</style>
