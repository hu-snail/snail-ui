<script setup lang="ts">
/**
 * dialog-web-bordered — bordered on/off; flip the switch and reopen to
 * compare the outline delta on the same content.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const open = ref(false);
const bordered = ref(true);
</script>

<template>
  <div class="dlg-bordered">
    <div class="dlg-bordered__bar">
      <label class="dlg-bordered__toggle">
        <input v-model="bordered" type="checkbox" />
        bordered
      </label>
      <SnButton type="primary" size="small" @click="open = true">Open dialog</SnButton>
    </div>

    <DialogStage v-model:show="open">
      <SnDialog
        title="Disk space is low"
        content="1.2 GB left. Free up some cache and try again."
        type="warning"
        :bordered="bordered"
        positive-text="Clean up"
        negative-text="Later"
        @positive-click="open = false"
        @negative-click="open = false"
      />
    </DialogStage>
  </div>
</template>

<style scoped>
.dlg-bordered {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-bordered__bar {
  display: flex;
  align-items: center;
  gap: 16px;
}
.dlg-bordered__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
