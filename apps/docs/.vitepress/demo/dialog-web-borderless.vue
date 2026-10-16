<script setup lang="ts">
/**
 * dialog-web-borderless — bordered vs borderless, and with / without icon.
 *
 * One dialog, three configurations: flip the switches and reopen to compare
 * the visual delta on the same content.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

const open = ref(false)
const bordered = ref(true)
const showIcon = ref(true)
</script>

<template>
  <div class="dlg-borderless">
    <div class="dlg-borderless__bar">
      <label class="dlg-borderless__toggle">
        <input v-model="bordered" type="checkbox">
        bordered
      </label>
      <label class="dlg-borderless__toggle">
        <input v-model="showIcon" type="checkbox">
        showIcon
      </label>
      <SnButton type="primary" size="small" @click="open = true">打开对话框</SnButton>
    </div>

    <DialogStage v-model:show="open">
      <SnDialog
        title="磁盘空间不足"
        content="剩余 1.2 GB，建议清理缓存后再重试。"
        type="warning"
        :bordered="bordered"
        :show-icon="showIcon"
        positive-text="去清理"
        negative-text="稍后"
        @positive-click="open = false"
        @negative-click="open = false"
      />
    </DialogStage>
  </div>
</template>

<style scoped>
.dlg-borderless {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-borderless__bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.dlg-borderless__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
