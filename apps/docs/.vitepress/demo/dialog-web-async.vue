<script setup lang="ts">
/**
 * dialog-web-async — confirm button enters loading until the async task settles.
 *
 * Shows: `loading` prop + `positiveButtonProps.disabled` interplay. The host
 * keeps the dialog mounted until the promise resolves, then closes it.
 */
import { ref } from 'vue'
import { SnButton, SnDialog } from '@snui/vue-web'

const open = ref(false)
const loading = ref(false)
const done = ref('—')

async function confirm(): Promise<void> {
  loading.value = true
  done.value = '提交中…'
  await new Promise((resolve) => setTimeout(resolve, 1400))
  loading.value = false
  done.value = '已完成'
  open.value = false
}
</script>

<template>
  <div class="dlg-async">
    <SnButton type="primary" @click="open = true">提交订单</SnButton>

    <div v-if="open" class="dlg-async__host">
      <SnDialog
        title="确认提交"
        content="提交后订单将进入处理流程，无法直接修改。"
        positive-text="提交"
        negative-text="再想想"
        :loading="loading"
        @positive-click="confirm"
        @negative-click="open = false"
        @close="open = false"
      />
    </div>

    <p class="dlg-async__log">
      状态：<code>{{ done }}</code>
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
.dlg-async__host {
  width: 100%;
  max-width: 446px;
  padding: 24px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.dlg-async__log {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
