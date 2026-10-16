<script setup lang="ts">
/**
 * dialog-web-basic — default panel with a title, body and two buttons.
 *
 * The dialog card is wrapped in `<DialogStage>`, which supplies the modal
 * chrome (mask + teleport + centring) the library's overlay provider will
 * eventually own. See DialogStage.vue for the scope note.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

const open = ref(true)
const lastAction = ref('—')

function onPositive() {
  lastAction.value = 'positive-click'
  open.value = false
}
function onNegative() {
  lastAction.value = 'negative-click'
  open.value = false
}
function onClose() {
  lastAction.value = 'close'
  open.value = false
}
</script>

<template>
  <div class="dlg-demo">
    <SnButton type="primary" @click="open = true">打开对话框</SnButton>

    <DialogStage v-model:show="open">
      <SnDialog
        title="确认删除"
        content="删除后该应用及其全部页面将无法恢复。"
        positive-text="删除"
        negative-text="取消"
        closable
        @positive-click="onPositive"
        @negative-click="onNegative"
        @close="onClose"
      />
    </DialogStage>

    <p class="dlg-demo__log">
      最后一次事件：<code>{{ lastAction }}</code>
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
