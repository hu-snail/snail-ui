<script setup lang="ts">
/**
 * dialog-web-borderless — bordered vs borderless, and with / without icon.
 *
 * Shows: `bordered` + `showIcon` combinations on the same content so the
 * visual delta is directly comparable.
 */
import { SnDialog } from '@snui/vue-web'
</script>

<template>
  <div class="dlg-borderless">
    <div class="dlg-borderless__cell">
      <span class="dlg-borderless__cap">bordered（默认）</span>
      <SnDialog
        title="磁盘空间不足"
        content="剩余 1.2 GB，建议清理缓存后再重试。"
        type="warning"
        positive-text="去清理"
        negative-text="稍后"
      />
    </div>

    <div class="dlg-borderless__cell">
      <span class="dlg-borderless__cap">:bordered="false"</span>
      <SnDialog
        title="磁盘空间不足"
        content="剩余 1.2 GB，建议清理缓存后再重试。"
        type="warning"
        :bordered="false"
        positive-text="去清理"
        negative-text="稍后"
      />
    </div>

    <div class="dlg-borderless__cell">
      <span class="dlg-borderless__cap">:show-icon="false"</span>
      <SnDialog
        title="磁盘空间不足"
        content="剩余 1.2 GB，建议清理缓存后再重试。"
        type="warning"
        :show-icon="false"
        positive-text="去清理"
        negative-text="稍后"
      />
    </div>
  </div>
</template>

<style scoped>
.dlg-borderless {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}
.dlg-borderless__cell {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1 1 300px;
  max-width: 360px;
}
.dlg-borderless__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
