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
  idle: '（尚未确认）',
  pending: '请求进行中，弹层保持打开…',
  done: '请求成功，弹层已关闭',
  failed: '请求失败，弹层保持打开，可重试',
}
</script>

<template>
  <div class="popconfirm-async-demo">
    <div class="popconfirm-async-demo__row">
      <SnPopconfirm
        content="将向服务端提交发布请求，请求返回前弹层保持打开。"
        positive-text="确认发布"
        @positive-click="onPositive"
      >
        <SnButton type="primary">发布新版本</SnButton>
      </SnPopconfirm>
      <span
        class="popconfirm-async-demo__phase"
        :class="{ 'popconfirm-async-demo__phase--warn': phase === 'failed' }"
      >
        {{ phaseText[phase] }}
      </span>
    </div>
    <p class="popconfirm-async-demo__hint">
      回调返回 Promise：解析为 false（或 reject 前保持打开）时不关闭，适合先请求后关闭的流程。
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
