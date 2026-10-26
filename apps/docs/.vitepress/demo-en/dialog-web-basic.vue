<script setup lang="ts">
/**
 * dialog-web-basic — default panel with a title, body and two buttons.
 *
 * The dialog card is wrapped in `<DialogStage>`, which supplies the modal
 * chrome (mask + teleport + centring) the library's overlay provider will
 * eventually own. See DialogStage.vue for the scope note.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

// Closed on load — a dialog must not appear before the reader asks for it.
const open = ref(false);
const lastAction = ref('—');

function onPositive() {
  lastAction.value = 'positive-click';
  open.value = false;
}
function onNegative() {
  lastAction.value = 'negative-click';
  open.value = false;
}
function onClose() {
  lastAction.value = 'close';
  open.value = false;
}
</script>

<template>
  <div class="dlg-demo">
    <SnButton type="primary" @click="open = true">Open dialog</SnButton>

    <DialogStage v-model:show="open">
      <SnDialog
        title="Confirm deletion"
        content="Once deleted, the app and all its pages cannot be recovered."
        positive-text="Delete"
        negative-text="Cancel"
        closable
        @positive-click="onPositive"
        @negative-click="onNegative"
        @close="onClose"
      />
    </DialogStage>

    <p class="dlg-demo__log">
      Last event:<code>{{ lastAction }}</code>
    </p>
  </div>
</template>

<style scoped>
.dlg-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-demo__log {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
