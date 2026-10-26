<script setup lang="ts">
/**
 * notification-web-placement — 六个堆叠方位：先在按钮组里选定角落，
 * 再触发通知，观察通知条真实移动到所选方位。
 *
 * placement 是 Provider 的 prop，切换后堆叠容器整体移动到新的角落；
 * bottom 系列自下而上生长（新通知出现在下方）。
 */
import { defineComponent, ref } from 'vue';
import { SnButton, SnNotificationProvider, useNotification } from '@snui/vue-web';

type Placement = 'top' | 'top-right' | 'top-left' | 'bottom' | 'bottom-right' | 'bottom-left';

interface PlacementOption {
  value: Placement;
  label: string;
}

const PLACEMENTS: PlacementOption[] = [
  { value: 'top', label: 'Top center' },
  { value: 'top-right', label: 'Top right' },
  { value: 'top-left', label: 'Top left' },
  { value: 'bottom', label: 'Bottom center' },
  { value: 'bottom-right', label: 'Bottom right' },
  { value: 'bottom-left', label: 'Bottom left' },
];

const placement = ref<Placement>('top-right');

const PlacementTrigger = defineComponent({
  name: 'NotificationPlacementTrigger',
  props: {
    /** 当前选中的堆叠方位，仅用于通知文案。 */
    placement: {
      type: String as () => Placement,
      required: true,
    },
  },
  setup(props, { slots }) {
    const notification = useNotification();
    let pushed = 0;

    const push = (): void => {
      pushed += 1;
      notification.info({
        title: `Notification ${pushed}`,
        content: `Stacking placement: ${props.placement}`,
        meta: 'Trigger again after switching; the notification appears in the new corner',
      });
    };

    const clearAll = (): void => {
      pushed = 0;
      notification.destroyAll();
    };

    return () => slots.default?.({ push, clearAll });
  },
});
</script>

<template>
  <div class="ntf-place">
    <div class="ntf-place__picker" role="group" aria-label="Notification stacking placement">
      <SnButton
        v-for="item in PLACEMENTS"
        :key="item.value"
        size="small"
        :type="placement === item.value ? 'primary' : 'default'"
        @click="placement = item.value"
      >
        {{ item.label }}
      </SnButton>
    </div>

    <SnNotificationProvider :placement="placement">
      <PlacementTrigger v-slot="{ push, clearAll }">
        <div class="ntf-place__actions">
          <SnButton type="primary" @click="push">Trigger one here</SnButton>
          <SnButton @click="clearAll">Close all</SnButton>
        </div>
      </PlacementTrigger>
    </SnNotificationProvider>

    <p class="ntf-place__hint">
      Current placement <code>{{ placement }}</code
      >: the notification container snaps to that corner as a whole, and on-screen notifications
      move with it.
    </p>
  </div>
</template>

<style scoped>
.ntf-place {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.ntf-place__picker,
.ntf-place__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ntf-place__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}

.ntf-place__hint code {
  color: var(--sn-web-color-text-primary);
}
</style>
