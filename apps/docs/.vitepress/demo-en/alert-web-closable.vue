<script setup lang="ts">
/**
 * alert-web-closable — a closable alert plus one whose `onClose` vetoes
 * the dismissal while an async "save" is pending.
 */
import { ref } from 'vue';
import { SnAlert, SnButton } from '@snui/vue-web';

const log = ref<string[]>([]);
const saving = ref(false);

function record(message: string) {
  log.value = [...log.value, `${new Date().toLocaleTimeString()} ${message}`].slice(-5);
}

function onAfterLeave() {
  record('onAfterLeave — node removed');
}

/** Async veto: block the close while `saving` is true. */
async function onCloseVetoable() {
  if (saving.value) {
    record('onClose returned false — close blocked');
    return false;
  }
  record('onClose passed — close allowed');
  return true;
}

async function simulateSave() {
  saving.value = true;
  record('Saving started… (clicking close now will be blocked)');
  await new Promise((resolve) => setTimeout(resolve, 1500));
  saving.value = false;
  record('Save finished');
}
</script>

<template>
  <div class="alert-demo">
    <SnAlert type="info" title="Closable" closable @leave="record('leave event')">
      Click the × on the right to close; the node is removed only after the leave transition ends.
    </SnAlert>

    <SnAlert
      type="warning"
      title="Async interception"
      closable
      :on-close="onCloseVetoable"
      @close-click="record('closeClick event')"
      @leave="onAfterLeave"
    >
      Clicking × while a save is in progress won't close it — <code>onClose</code> returns
      <code>false</code> blocked this close.
    </SnAlert>

    <div class="alert-demo__actions">
      <SnButton size="small" @click="simulateSave">Simulate save 1.5s</SnButton>
      <SnButton size="small" quaternary @click="log = []">Clear log</SnButton>
    </div>

    <pre v-if="log.length" class="alert-demo__log">{{ log.join('\n') }}</pre>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}
.alert-demo__actions {
  display: flex;
  gap: 8px;
}
.alert-demo__log {
  margin: 0;
  padding: 10px 12px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
  line-height: 1.7;
  white-space: pre-wrap;
  color: var(--vp-c-text-2);
}
</style>
