<script setup lang="ts">
/**
 * alert-web-closable — a closable alert plus one whose `onClose` vetoes
 * the dismissal while an async "save" is pending.
 */
import { ref } from 'vue'
import { SnAlert, SnButton } from '@snui/vue-web'

const log = ref<string[]>([])
const saving = ref(false)

function record(message: string) {
  log.value = [...log.value, `${new Date().toLocaleTimeString()} ${message}`].slice(-5)
}

function onAfterLeave() {
  record('onAfterLeave — 节点已移除')
}

/** Async veto: block the close while `saving` is true. */
async function onCloseVetoable() {
  if (saving.value) {
    record('onClose 返回 false — 已拦截关闭')
    return false
  }
  record('onClose 通过 — 允许关闭')
  return true
}

async function simulateSave() {
  saving.value = true
  record('开始保存…（此时点击关闭会被拦截）')
  await new Promise((resolve) => setTimeout(resolve, 1500))
  saving.value = false
  record('保存结束')
}
</script>

<template>
  <div class="alert-demo">
    <SnAlert type="info" title="可关闭" closable @leave="record('leave 事件')">
      点击右侧 × 即可关闭，节点在离场过渡结束后才被移除。
    </SnAlert>

    <SnAlert
      type="warning"
      title="异步拦截"
      closable
      :on-close="onCloseVetoable"
      @close-click="record('closeClick 事件')"
      @leave="onAfterLeave"
    >
      保存进行中时点击 × 不会关闭 —— <code>onClose</code> 返回 <code>false</code> 拦截了本次关闭。
    </SnAlert>

    <div class="alert-demo__actions">
      <SnButton size="small" @click="simulateSave">模拟保存 1.5s</SnButton>
      <SnButton size="small" quaternary @click="log = []">清空日志</SnButton>
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
