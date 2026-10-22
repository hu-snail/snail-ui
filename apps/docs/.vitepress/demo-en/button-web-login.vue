<script setup lang="ts">
/**
 * button-web-login — 交互场景：模拟登录。
 *
 * 点击「登录」→ loading（spinner + 「登录中…」）→ 成功后按钮收成圆形 +
 * 对勾，2 秒后复位。收窄动画放在外层容器的 `width` 上，`SnButton` 只负责
 * 它自己的 `loading` / `circle` / `icon` 三档视觉，两者互不侵入。
 */
import { onBeforeUnmount, ref } from 'vue'
import { Check } from 'lucide-vue-next'
import { SnButton } from '@snui/vue-web'

type LoginStatus = 'idle' | 'loading' | 'success'

const status = ref<LoginStatus>('idle')
const timers = new Set<number>()

function later(fn: () => void, ms: number): void {
  const id = window.setTimeout(() => {
    timers.delete(id)
    fn()
  }, ms)
  timers.add(id)
}

function login(): void {
  if (status.value !== 'idle') return
  status.value = 'loading'
  later(() => {
    status.value = 'success'
    later(() => {
      status.value = 'idle'
    }, 2000)
  }, 1400)
}

onBeforeUnmount(() => {
  timers.forEach((id) => window.clearTimeout(id))
  timers.clear()
})
</script>

<template>
  <div class="login-demo">
    <div class="login-demo__card">
      <p class="login-demo__title">Simulated sign-in</p>
      <div class="login-demo__field">
        <span>Account</span>
        <code>snail@aui.dev</code>
      </div>
      <div class="login-demo__field">
        <span>Password</span>
        <code>••••••••</code>
      </div>

      <div class="login-demo__action" :data-status="status">
        <SnButton
          v-if="status !== 'success'"
          type="primary"
          block
          :loading="status === 'loading'"
          @click="login"
        >
          {{ status === 'loading' ? 'Signing in…' : 'Sign in' }}
        </SnButton>
        <SnButton v-else type="success" circle :icon="Check" aria-label="Signed in" />
      </div>

      <p class="login-demo__state">
        Current status:<code>{{ status }}</code>
      </p>
    </div>

    <div class="login-demo__card login-demo__card--strip">
      <p class="login-demo__title">Three visual variants compared</p>
      <div class="login-demo__strip">
        <div class="login-demo__strip-item">
          <SnButton type="primary" block>Sign in</SnButton>
          <span>idle</span>
        </div>
        <div class="login-demo__strip-item">
          <SnButton type="primary" block loading>Signing in…</SnButton>
          <span>loading</span>
        </div>
        <div class="login-demo__strip-item login-demo__strip-item--circle">
          <SnButton type="success" circle :icon="Check" aria-label="Signed in" />
          <span>success</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  width: 100%;
}

.login-demo__card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1 1 240px;
  min-width: 220px;
  padding: 16px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 10px;
  background: var(--sn-web-color-background-surface);
}

.login-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-primary);
}

.login-demo__field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.login-demo__field code {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: var(--sn-web-color-text-primary);
}

/* The width morph lives here: 100% while idle/loading, the button's own
 * height once the circular success state takes over. */
.login-demo__action {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 4px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-demo__action[data-status='success'] {
  width: var(--sn-web-button-height-medium, 32px);
}

.login-demo__state {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}

.login-demo__state code {
  font-family: ui-monospace, monospace;
}

.login-demo__strip {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.login-demo__strip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}

.login-demo__strip-item :deep(.sn-button) {
  width: 100%;
}

.login-demo__strip-item--circle {
  flex: 0 0 auto;
}

.login-demo__strip-item--circle :deep(.sn-button) {
  width: auto;
}
</style>