<script setup lang="ts">
/**
 * Demo: SnDialogProvider + useDialog — imperative dialogs.
 * useDialog must be called inside the provider subtree; the API carries
 * info / success / warning / error / create / destroyAll.
 */
import { defineComponent, h } from 'vue';
import { SnButton, SnDialogProvider, useDialog } from '@snui/vue-web';

/** Consumer inside the provider: useDialog only works in this subtree. */
const DialogButtons = defineComponent({
  setup() {
    const dialog = useDialog();
    const btn = (label: string, onClick: () => void) =>
      h(SnButton, { size: 'small', onClick }, { default: () => label });

    return () => [
      btn('success', () =>
        dialog.success({ title: 'Success', content: 'Nice', positiveText: 'Wow' }),
      ),
      btn(
        'warning',
        () =>
          dialog.warning({
            title: 'Warning',
            content: 'Are you sure?',
            positiveText: 'OK',
            negativeText: 'Cancel',
            onPositiveClick() {
              dialog.success({ title: 'Success', content: 'Confirmed', positiveText: 'Wow' });
            },
          }),
      ),
      btn('error', () => dialog.error({ title: 'Error', content: 'It failed', positiveText: 'Got it' })),
      btn('info', () =>
        dialog.info({ title: 'Info', content: 'A piece of information', positiveText: 'Got it' }),
      ),
    ];
  },
});
</script>

<template>
  <SnDialogProvider>
    <div class="dlg-use-dialog">
      <DialogButtons />
    </div>
  </SnDialogProvider>
</template>

<style scoped>
.dlg-use-dialog {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
