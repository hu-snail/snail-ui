<script setup lang="ts">
/**
 * Demo: SnPopconfirm — async confirm callback (Promise semantics).
 */
import { ref } from 'vue'
import { SnButton, SnPopconfirm } from '@snui/vue-web'

type Phase = 'idle' | 'pending' | 'done' | 'failed'
const phase = ref<Phase>('idle')

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function onPositive(): Promise<boolean> {
  phase.value = 'pending'
  await sleep(1200)
  // 模拟 50% 成功率：失败时解析为 false，弹层保持打开。
  const ok = Math.random() > 0.5
  phase.value = ok ? 'done' : 'failed'
  return ok
}

const phaseText: Record<Phase, string> = {
  idle: '(not confirmed yet)',
  pending: 'Request in progress; popover stays open…',
  done: 'Request succeeded; popover closed',
  failed: 'Request failed; popover stays open for retry',
}
</script>

<template>
  <div class="popconfirm-async-demo">
    <div class="popconfirm-async-demo__row">
      <SnPopconfirm
        content="A release request will be sent to the server; the popover stays open until it returns."
        positive-text="Confirm release"
        @positive-click="onPositive"
      >
        <SnButton type="primary">Release new version</SnButton>
      </SnPopconfirm>
      <span
        class="popconfirm-async-demo__phase"
        :class="{ 'popconfirm-async-demo__phase--warn': phase === 'failed' }"
      >
        {{ phaseText[phase] }}
      </span>
    </div>
    <p class="popconfirm-async-demo__hint">
      When the callback returns a Promise: the popover stays open if it resolves to false (or until reject) — fits request-first, close-later flows.
    </p>
  </div>
</template>

<style scoped>
.popconfirm-async-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popconfirm-async-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popconfirm-async-demo__phase {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}

.popconfirm-async-demo__phase--warn {
  color: var(--sn-web-color-feedback-danger, #d03050);
}

.popconfirm-async-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
