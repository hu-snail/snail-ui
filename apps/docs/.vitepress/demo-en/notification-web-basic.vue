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
  info: 'New version released',
  success: 'File uploaded',
  warning: 'Storage almost full',
  error: 'Sync failed',
};

const CONTENTS: Record<SemanticType, string> = {
  info: 'v0.2.0 ships brand-new notification and loading-bar components.',
  success: 'design-assets.zip (2.4 MB) uploaded.',
  warning: 'Your plan has used 90% of its space; clean up old files.',
  error: 'Network connection lost. Check it and retry.',
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
        meta: 'Just now',
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
        title: 'Persistent notification',
        content: 'duration is 0 — click the button again to close.',
        duration: 0,
      });
    };

    const clearAll = (): void => {
      stickyHandle = undefined;
      notification.destroyAll();
    };

    return () =>
      h('div', { class: 'notification-basic__row' }, [
        h(SnButton, { onClick: () => notify('info') }, () => 'Info notification'),
        h(SnButton, { onClick: () => notify('success') }, () => 'Success notification'),
        h(SnButton, { onClick: () => notify('warning') }, () => 'Warning notification'),
        h(SnButton, { onClick: () => notify('error') }, () => 'Error notification'),
        h(SnButton, { onClick: toggleSticky }, () => 'Persistent notification'),
        h(SnButton, { onClick: clearAll }, () => 'Close all'),
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
