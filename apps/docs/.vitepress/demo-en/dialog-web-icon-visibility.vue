<script setup lang="ts">
/**
 * dialog-web-icon-visibility — showIcon on/off; flip the switch and reopen
 * to compare the leading icon delta on the same content.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const open = ref(false);
const showIcon = ref(true);
</script>

<template>
  <div class="dlg-icon-vis">
    <div class="dlg-icon-vis__bar">
      <label class="dlg-icon-vis__toggle">
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
.dlg-icon-vis {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-icon-vis__bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.dlg-icon-vis__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
