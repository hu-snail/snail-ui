<script setup lang="ts">
/**
 * dialog-web-borderless — bordered vs borderless, and with / without icon.
 *
 * One dialog, three configurations: flip the switches and reopen to compare
 * the visual delta on the same content.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const open = ref(false);
const bordered = ref(true);
const showIcon = ref(true);
</script>

<template>
  <div class="dlg-borderless">
    <div class="dlg-borderless__bar">
      <label class="dlg-borderless__toggle">
        <input v-model="bordered" type="checkbox" />
        bordered
      </label>
      <label class="dlg-borderless__toggle">
        <input v-model="showIcon" type="checkbox" />
        showIcon
      </label>
      <SnButton type="primary" size="small" @click="open = true">Open dialog</SnButton>
    </div>

    <DialogStage v-model:show="open">
      <SnDialog
        title="Disk space is low"
        content="1.2 GB left. Free up some cache and try again."
        type="warning"
        :bordered="bordered"
        :show-icon="showIcon"
        positive-text="Clean up"
        negative-text="Later"
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
