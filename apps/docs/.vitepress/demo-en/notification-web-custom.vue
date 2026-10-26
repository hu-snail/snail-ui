<script setup lang="ts">
/**
 * notification-web-custom — 自定义内容：avatar 头像、meta 时间、footer 操作按钮，
 * 以及持有 create() 返回的句柄后手动 destroy()。
 *
 * useNotification() / create() 必须在 Provider 后代组件的 setup 中调用，
 * 因此这里把触发与句柄托管放在内层子组件，通过作用域插槽暴露状态与操作。
 * 图标走 lucide + registerSnIcons + SnIcon（禁止 emoji）。
 */
import { defineComponent, h, ref } from 'vue';
import { Check, Clock } from 'lucide-vue-next';
import {
  registerSnIcons,
  SnAvatar,
  SnButton,
  SnIcon,
  SnNotificationProvider,
  useNotification,
} from '@snui/vue-web';
import type { NotificationReactive } from '@snui/vue-web';

registerSnIcons({ Check, Clock });

const CustomTrigger = defineComponent({
  name: 'NotificationCustomTrigger',
  setup(_props, { slots }) {
    const notification = useNotification();
    const held = ref(false);
    let handle: NotificationReactive | undefined;

    /** 手动关闭当前持有的那条通知。 */
    const closeHeld = (): void => {
      handle?.destroy();
      handle = undefined;
      held.value = false;
    };

    const push = (): void => {
      // 先关掉上一条，保证屏幕上只有一条自定义通知。
      closeHeld();
      handle = notification.create({
        title: 'Li Ran submitted the design review',
        content: 'Interactive mockups v2 uploaded, awaiting your confirmation.',
        description: 'Once approved, it syncs to the repo automatically.',
        meta: `Submitted at ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`,
        duration: 0,
        avatar: () => h(SnAvatar, { fallbackText: 'Li', circle: true, size: 32 }),
        footer: () =>
          h('div', { style: 'display: flex; gap: 8px; margin-top: 2px' }, [
            h(
              SnButton,
              {
                size: 'tiny',
                type: 'primary',
                icon: () => h(SnIcon, { name: 'Check' }),
                onClick: closeHeld,
              },
              () => 'Mark as read',
            ),
            h(SnButton, { size: 'tiny', onClick: closeHeld }, () => 'Handle later'),
          ]),
        onClose: () => {
          held.value = false;
        },
      });
      held.value = true;
    };

    return () => slots.default?.({ push, closeHeld, held: held.value });
  },
});
</script>

<template>
  <div class="ntf-custom">
    <SnNotificationProvider>
      <CustomTrigger v-slot="{ push, closeHeld, held }">
        <div class="ntf-custom__actions">
          <SnButton type="primary" @click="push">Push a custom notification</SnButton>
          <SnButton :disabled="!held" @click="closeHeld">Close via the held handle</SnButton>
        </div>
        <p class="ntf-custom__state">
          Handle state:<strong>{{ held ? 'Held' : 'Released' }}</strong>
        </p>
        <p class="ntf-custom__hint">
          <SnIcon name="Clock" />
          <span>
            <code>meta</code> logs when it was triggered,<code>footer</code> offers in-place
            actions; <code>duration</code> is 0, so it must be closed manually.
          </span>
        </p>
      </CustomTrigger>
    </SnNotificationProvider>
  </div>
</template>

<style scoped>
.ntf-custom {
  width: 100%;
}

.ntf-custom__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntf-custom__state {
  margin: 12px 0 4px;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.ntf-custom__state strong {
  color: var(--sn-web-color-text-primary);
}

.ntf-custom__hint {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: var(--sn-web-color-text-tertiary);
}
</style>
