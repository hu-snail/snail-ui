<script setup lang="ts">
/**
 * dialog-web-controlled — visibility owned by the parent via v-model:show.
 *
 * Shows: controlled mode (`show` + `update:show`) and `closeFocusable`.
 * The dialog itself never writes visible state; it only emits.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

const open = ref(false)
const closeFocusable = ref(false)
const events = ref<string[]>([])

function log(name: string): void {
  events.value = [`${name} @ ${new Date().toLocaleTimeString()}`, ...events.value].slice(0, 4)
}
</script>

<template>
  <div class="dlg-ctrl">
    <div class="dlg-ctrl__bar">
      <SnButton type="primary" @click="open = true">打开（受控）</SnButton>
      <label class="dlg-ctrl__toggle">
        <input v-model="closeFocusable" type="checkbox">
        closeFocusable
      </label>
    </div>

    <div v-if="open" class="dlg-ctrl__host">
      <SnDialog
        v-model:show="open"
        title="受控对话框"
        content="显示状态由父组件持有，关闭按钮只发出 update:show 事件。"
        positive-text="确定"
        negative-text="取消"
        :close-focusable="closeFocusable"
        @update:show="log('update:show')"
        @positive-click="log('positive-click')"
        @negative-click="log('negative-click')"
        @close="log('close')"
      />
    </div>

    <ul class="dlg-ctrl__log">
      <li v-for="(e, i) in events" :key="i">
        <code>{{ e }}</code>
      </li>
      <li v-if="!events.length" class="dlg-ctrl__empty">暂无事件</li>
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
.dlg-ctrl__host {
  width: 100%;
  max-width: 446px;
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
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
