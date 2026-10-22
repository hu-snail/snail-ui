<script setup lang="ts">
/**
 * dialog-web-action — custom action row replaces the built-in button pair.
 *
 * Shows: the `action` slot. The slot receives no payload; the host owns the
 * buttons entirely, including their types and layout.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

// Closed on load — a dialog must not appear before the reader asks for it.
const open = ref(false)
const picked = ref('—')

function pick(choice: string): void {
  picked.value = choice
  open.value = false
}
</script>

<template>
  <div class="dlg-action">
    <SnButton type="primary" @click="open = true">Open dialog</SnButton>

    <DialogStage v-model:show="open">
      <SnDialog title="Choose how to save" content="Where should this draft be saved?">
        <template #action>
          <div class="dlg-action__row">
            <SnButton quaternary @click="pick('Local only')">Local only</SnButton>
            <SnButton tertiary @click="pick('Export files')">Export files</SnButton>
            <SnButton type="primary" @click="pick('Cloud sync')">Cloud sync</SnButton>
          </div>
        </template>
      </SnDialog>
    </DialogStage>

    <p class="dlg-action__log">
      Selected:<code>{{ picked }}</code>
    </p>
  </div>
</template>

<style scoped>
.dlg-action {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
/* Three-way choice: the action slot owns the row layout. */
.dlg-action__row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
}
.dlg-action__log {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
