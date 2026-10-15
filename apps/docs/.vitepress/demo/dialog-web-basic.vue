<script setup lang="ts">
/**
 * dialog-web-basic — default panel with a title, body and two buttons.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

const open = ref(true)
const lastAction = ref('—')

function onPositive() {
  lastAction.value = 'positive-click'
}
function onNegative() {
  lastAction.value = 'negative-click'
}
function onClose() {
  open.value = false
  lastAction.value = 'close'
}
</script>

<template>
  <div class="dlg-demo">
    <SnButton @click="open = true">重新打开</SnButton>

    <div v-if="open" class="dlg-demo__host">
      <SnDialog
        title="确认删除"
        content="删除后该应用及其全部页面将无法恢复。"
        positive-text="删除"
        negative-text="取消"
        @positive-click="onPositive"
        @negative-click="onNegative"
        @close="onClose"
      />
    </div>

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
/* SnDialog is the card, not the overlay — the demo supplies the host box. */
.dlg-demo__host {
  width: 100%;
  max-width: 446px;
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.dlg-demo__log {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
