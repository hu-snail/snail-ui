<script setup lang="ts">
/**
 * dialog-web-async — confirm button enters loading until the async task settles.
 *
 * Shows: `loading` prop + `positiveButtonProps.disabled` interplay. The host
 * keeps the dialog mounted until the promise resolves, then closes it.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

const open = ref(false);
const loading = ref(false);
const done = ref('—');

async function confirm(): Promise<void> {
  loading.value = true;
  done.value = 'Submitting…';
  await new Promise((resolve) => setTimeout(resolve, 1400));
  loading.value = false;
  done.value = 'Done';
  open.value = false;
}
</script>

<template>
  <div class="dlg-async">
    <SnButton type="primary" @click="open = true">Submit order</SnButton>

    <DialogStage v-model:show="open" :mask-closable="!loading">
      <SnDialog
        title="Confirm submission"
        content="Once submitted, the order enters processing and cannot be modified directly."
        positive-text="Submit"
        negative-text="Maybe later"
        :loading="loading"
        @positive-click="confirm"
        @negative-click="open = false"
        @close="open = false"
      />
    </DialogStage>

    <p class="dlg-async__log">
      Status:<code>{{ done }}</code>
    </p>
  </div>
</template>

<style scoped>
.dlg-async {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
.dlg-async__log {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
