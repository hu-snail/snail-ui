<script setup lang="ts">
/**
 * Demo: SnDialogProvider + useDialog — 命令式弹窗。
 * useDialog 必须在 Provider 子树中调用；返回的 API 携带
 * info / success / warning / error / create / destroyAll。
 */
import { defineComponent, h } from 'vue';
import { SnButton, SnDialogProvider, useDialog } from '@snui/vue-web';

/** Provider 内的消费者：useDialog 只能在这里（子树中）调用。 */
const DialogButtons = defineComponent({
  setup() {
    const dialog = useDialog();
    const btn = (label: string, onClick: () => void) =>
      h(SnButton, { size: 'small', onClick }, { default: () => label });

    return () => [
      btn('success', () =>
        dialog.success({ title: '成功', content: '厉害', positiveText: '哇' }),
      ),
      btn(
        'warning',
        () =>
          dialog.warning({
            title: '警告',
            content: '你确定?',
            positiveText: '确定',
            negativeText: '不确定',
            onPositiveClick() {
              dialog.success({ title: '成功', content: '已确认', positiveText: '哇' });
            },
          }),
      ),
      btn('error', () => dialog.error({ title: '错误', content: '错了', positiveText: '嗯' })),
      btn('info', () =>
        dialog.info({ title: '提示', content: '这是一条信息', positiveText: '知道' }),
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
