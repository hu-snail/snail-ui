<script setup lang="ts">
/**
 * dialog-web-controlled — visibility owned by the parent via v-model:show.
 *
 * Shows: controlled mode (`show` + `update:show`) and `closeFocusable`.
 * The dialog itself never writes visible state; it only emits. The stage
 * follows the same contract — it emits, the parent decides.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const open = ref(false);
const closeFocusable = ref(false);
const events = ref<string[]>([]);

function log(name: string): void {
  events.value = [`${name} @ ${new Date().toLocaleTimeString()}`, ...events.value].slice(0, 4);
}
</script>

<template>
  <div class="dlg-ctrl">
    <div class="dlg-ctrl__bar">
      <SnButton type="primary" @click="open = true">Open (controlled)</SnButton>
      <label class="dlg-ctrl__toggle">
        <input v-model="closeFocusable" type="checkbox" />
        closeFocusable
      </label>
    </div>

    <DialogStage v-model:show="open" @close="log('stage-close')">
      <SnDialog
        title="Controlled dialog"
        content="Visibility is owned by the parent; the close button only emits update:show."
        positive-text="OK"
        negative-text="Cancel"
        :close-focusable="closeFocusable"
        @update:show="log('update:show')"
        @positive-click="log('positive-click')"
        @negative-click="log('negative-click')"
        @close="log('close')"
      />
    </DialogStage>

    <ul class="dlg-ctrl__log">
      <li v-for="(e, i) in events" :key="i">
        <code>{{ e }}</code>
      </li>
      <li v-if="!events.length" class="dlg-ctrl__empty">No events</li>
    </ul>
  </div>
</template>

<style scoped>
.dlg-ctrl {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-ctrl__bar {
  display: flex;
  align-items: center;
  gap: 12px;
}
.dlg-ctrl__toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.dlg-ctrl__log {
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
.dlg-ctrl__empty {
  list-style: none;
  margin-left: -18px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
