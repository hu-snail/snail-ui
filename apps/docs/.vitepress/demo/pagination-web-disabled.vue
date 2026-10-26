<script setup lang="ts">
/** Demo: SnPagination — disabled 整体禁用 + pageSlot 收窄出现省略号对照。 */
import { Lock } from 'lucide-vue-next';
import { registerSnIcons, SnIcon, SnPagination } from '@snui/vue-web';

registerSnIcons({ Lock });
</script>

<template>
  <div class="pagination-demo">
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">默认 pageSlot（9）— 8 页全部平铺</span>
      <SnPagination :item-count="80" :default-page="3" />
    </div>
    <div class="pagination-demo__row">
      <span class="pagination-demo__label">pageSlot 收窄为 5 — 首尾保留，中间折叠出省略号</span>
      <SnPagination :item-count="80" :default-page="4" :page-slot="5" />
    </div>
    <div class="pagination-demo__row">
      <span class="pagination-demo__label pagination-demo__label--icon">
        <SnIcon :icon="Lock" :size="14" />
        disabled 整体禁用（页码 / 跳页 / 条数全部不可操作）
      </span>
      <SnPagination
        :item-count="80"
        :default-page="4"
        :page-slot="5"
        show-quick-jumper
        show-size-picker
        disabled
      />
    </div>
  </div>
</template>

<style scoped>
.pagination-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pagination-demo__row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pagination-demo__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
