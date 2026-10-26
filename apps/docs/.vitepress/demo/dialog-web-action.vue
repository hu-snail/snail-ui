<script setup lang="ts">
/**
 * dialog-web-action — custom action row replaces the built-in button pair.
 *
 * Shows: the `action` slot. The slot receives no payload; the host owns the
 * buttons entirely, including their types and layout.
 */
import { ref } from 'vue';
import { SnButton, SnDialog } from '@snui/vue-web';

// Closed on load — a dialog must not appear before the reader asks for it.
const open = ref(false);
const picked = ref('—');

function pick(choice: string): void {
  picked.value = choice;
  open.value = false;
}
</script>

<template>
  <div class="dlg-action">
    <SnButton type="primary" @click="open = true">打开对话框</SnButton>

    <DialogStage v-model:show="open">
      <SnDialog title="选择保存方式" content="这份草稿要保存到哪里？">
        <template #action>
          <div class="dlg-action__row">
            <SnButton quaternary @click="pick('仅本地')">仅本地</SnButton>
            <SnButton tertiary @click="pick('导出文件')">导出文件</SnButton>
            <SnButton type="primary" @click="pick('云端同步')">云端同步</SnButton>
          </div>
        </template>
      </SnDialog>
    </DialogStage>

    <p class="dlg-action__log">
      已选：<code>{{ picked }}</code>
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
