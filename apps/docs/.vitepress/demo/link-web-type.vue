<script setup lang="ts">
/** Demo: SnLink — the six semantic `type` colors side by side. */
import { SnLink } from '@snui/vue-web'

const types = [
  { value: 'default', label: 'default — 正文默认色' },
  { value: 'primary', label: 'primary — 主色，强调可点击' },
  { value: 'info', label: 'info — 信息 / 中性提示' },
  { value: 'success', label: 'success — 成功 / 完成' },
  { value: 'warning', label: 'warning — 警告 / 待确认' },
  { value: 'error', label: 'error — 危险 / 失败' },
] as const
</script>

<template>
  <div class="link-type-demo">
    <section
      v-for="item in types"
      :key="item.value"
      class="link-type-demo__row"
    >
      <span class="link-type-demo__label">{{ item.label }}</span>
      <SnLink :type="item.value" :href="`#link-type-${item.value}`" underline>
        {{ item.value }} 链接
      </SnLink>
    </section>
  </div>
</template>

<style scoped>
.link-type-demo {
  display: grid;
  gap: 12px;
}
.link-type-demo__row {
  display: flex;
  align-items: baseline;
  gap: 16px;
}
.link-type-demo__label {
  flex: 0 0 220px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
