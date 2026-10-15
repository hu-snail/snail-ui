<script setup lang="ts">
/**
 * dialog-web-action — custom action row replaces the built-in button pair.
 *
 * Shows: the `action` slot. The slot receives no payload; the host owns the
 * buttons entirely, including their types and layout.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

const open = ref(true)
const picked = ref('—')

function pick(choice: string): void {
  picked.value = choice
  open.value = false
}
</script>

<template>
  <div class="dlg-action">
    <SnButton @click="open = true">重新打开</SnButton>

    <div v-if="open" class="dlg-action__host">
      <SnDialog title="选择保存方式" content="这份草稿要保存到哪里？">
        <template #action>
          <div class="dlg-action__row">
            <SnButton quaternary @click="pick('仅本地')">仅本地</SnButton>
            <SnButton tertiary @click="pick('导出文件')">导出文件</SnButton>
            <SnButton type="primary" @click="pick('云端同步')">云端同步</SnButton>
          </div>
        </template>
      </SnDialog>
    </div>

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
.dlg-action__host {
  width: 100%;
  max-width: 446px;
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
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
