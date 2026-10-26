<script setup lang="ts">
/**
 * notification-web-basic — <SnNotificationProvider> + useNotification():
 * the four semantic types, a manually-closable (duration: 0) card driven by
 * the returned handle, and destroyAll(). The API must be captured inside a
 * descendant of the provider, so the trigger lives in an inline child
 * component.
 */
import { defineComponent, h } from 'vue';
import { SnButton, SnNotificationProvider, useNotification } from '@snui/vue-web';

type SemanticType = 'info' | 'success' | 'warning' | 'error';

const TITLES: Record<SemanticType, string> = {
  info: '新版本已发布',
  success: '文件已上传',
  warning: '存储空间将满',
  error: '同步失败',
};

const CONTENTS: Record<SemanticType, string> = {
  info: 'v0.2.0 包含全新的通知与加载条组件。',
  success: '设计稿.zip（2.4 MB）上传完成。',
  warning: '当前套餐空间已使用 90%，建议清理旧文件。',
  error: '网络连接中断，请检查后重试。',
};

const NotificationTrigger = defineComponent({
  name: 'NotificationTrigger',
  setup() {
    const notification = useNotification();
    let stickyHandle: { destroy: () => void } | undefined;

    const notify = (type: SemanticType): void => {
      notification[type]({
        title: TITLES[type],
        content: CONTENTS[type],
        meta: '刚刚',
      });
    };

    /** duration: 0 — 只能通过返回的 handle 手动关闭。 */
    const toggleSticky = (): void => {
      if (stickyHandle) {
        stickyHandle.destroy();
        stickyHandle = undefined;
        return;
      }
      stickyHandle = notification.create({
        title: '常驻通知',
        content: 'duration 为 0，再点一次按钮即可关闭。',
        duration: 0,
      });
    };

    const clearAll = (): void => {
      stickyHandle = undefined;
      notification.destroyAll();
    };

    return () =>
      h('div', { class: 'notification-basic__row' }, [
        h(SnButton, { onClick: () => notify('info') }, () => '信息通知'),
        h(SnButton, { onClick: () => notify('success') }, () => '成功通知'),
        h(SnButton, { onClick: () => notify('warning') }, () => '警告通知'),
        h(SnButton, { onClick: () => notify('error') }, () => '错误通知'),
        h(SnButton, { onClick: toggleSticky }, () => '常驻通知'),
        h(SnButton, { onClick: clearAll }, () => '全部关闭'),
      ]);
  },
});
</script>

<template>
  <div class="notification-basic">
    <SnNotificationProvider>
      <NotificationTrigger />
    </SnNotificationProvider>
  </div>
</template>

<style scoped>
.notification-basic {
  width: 100%;
}

.notification-basic__row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
