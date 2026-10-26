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
        title: '李然 提交了设计评审',
        content: '交互稿 v2 已上传，等待你的确认。',
        description: '评审通过后会自动同步到版本库。',
        meta: `提交于 ${new Date().toLocaleTimeString('zh-CN', { hour12: false })}`,
        duration: 0,
        avatar: () => h(SnAvatar, { fallbackText: '李', circle: true, size: 32 }),
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
              () => '标记已读',
            ),
            h(SnButton, { size: 'tiny', onClick: closeHeld }, () => '稍后处理'),
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
          <SnButton type="primary" @click="push">推入一条自定义通知</SnButton>
          <SnButton :disabled="!held" @click="closeHeld">通过持有句柄关闭</SnButton>
        </div>
        <p class="ntf-custom__state">
          句柄状态：<strong>{{ held ? '持有中' : '未持有' }}</strong>
        </p>
        <p class="ntf-custom__hint">
          <SnIcon name="Clock" />
          <span>
            <code>meta</code> 记录触发时刻，<code>footer</code> 提供就地操作；
            <code>duration</code> 为 0，必须手动关闭。
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
