<script setup lang="ts">
/**
 * notification-web-max — max 数量限制：Provider 设置 max=3 后，
 * 连续触发观察最旧的一条被挤出，屏幕上始终不超过 3 条。
 *
 * useNotification() 必须在 Provider 后代组件的 setup 中调用，因此计数与
 * 触发逻辑放在内层子组件里，并通过作用域插槽把状态与调用入口交回模板。
 */
import { defineComponent, ref } from 'vue'
import { SnButton, SnNotificationProvider, useNotification } from '@snui/vue-web'

/** 屏幕同时可见的最大条数 —— 与 Provider 的 max prop 保持一致。 */
const MAX_ON_SCREEN = 3

const MaxTrigger = defineComponent({
  name: 'NotificationMaxTrigger',
  setup(_props, { slots }) {
    const notification = useNotification()
    const pushed = ref(0)

    const push = (): void => {
      pushed.value += 1
      const index = pushed.value
      notification.success({
        title: `Notification ${index}`,
        content:
          index <= MAX_ON_SCREEN
            ? `${index} on screen, not at the limit yet.`
            : `Only the latest ${MAX_ON_SCREEN} stay on screen; item ${index - MAX_ON_SCREEN} has been removed.`,
        duration: 0,
      })
    }

    const clearAll = (): void => {
      pushed.value = 0
      notification.destroyAll()
    }

    return () => slots.default?.({ pushed: pushed.value, push, clearAll })
  },
})
</script>

<template>
  <div class="ntf-max">
    <SnNotificationProvider :max="MAX_ON_SCREEN">
      <MaxTrigger v-slot="{ pushed, push, clearAll }">
        <div class="ntf-max__actions">
          <SnButton type="primary" @click="push">Push one more</SnButton>
          <SnButton @click="clearAll">Close all and reset</SnButton>
        </div>
        <p class="ntf-max__stat">
          Queued: <strong>{{ pushed }}</strong> messages · max visible:
          <strong>{{ MAX_ON_SCREEN }}</strong> 
        </p>
        <p class="ntf-max__hint">
          The notification's <code>duration</code> set to 0 never auto-dismisses — handy for watching the push-out order.
        </p>
      </MaxTrigger>
    </SnNotificationProvider>
  </div>
</template>

<style scoped>
.ntf-max {
  width: 100%;
}

.ntf-max__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntf-max__stat {
  margin: 12px 0 4px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.ntf-max__stat strong {
  color: var(--sn-web-color-text-primary);
}

.ntf-max__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
