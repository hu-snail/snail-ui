<script setup lang="ts">
/**
 * notification-web-placement — 六个堆叠方位：先在按钮组里选定角落，
 * 再触发通知，观察通知条真实移动到所选方位。
 *
 * placement 是 Provider 的 prop，切换后堆叠容器整体移动到新的角落；
 * bottom 系列自下而上生长（新通知出现在下方）。
 */
import { defineComponent, ref } from 'vue'
import { SnButton, SnNotificationProvider, useNotification } from '@snui/vue-web'

type Placement =
  | 'top'
  | 'top-right'
  | 'top-left'
  | 'bottom'
  | 'bottom-right'
  | 'bottom-left'

interface PlacementOption {
  value: Placement
  label: string
}

const PLACEMENTS: PlacementOption[] = [
  { value: 'top', label: '上中' },
  { value: 'top-right', label: '右上' },
  { value: 'top-left', label: '左上' },
  { value: 'bottom', label: '下中' },
  { value: 'bottom-right', label: '右下' },
  { value: 'bottom-left', label: '左下' },
]

const placement = ref<Placement>('top-right')

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
    const notification = useNotification()
    let pushed = 0

    const push = (): void => {
      pushed += 1
      notification.info({
        title: `第 ${pushed} 条通知`,
        content: `堆叠方位：${props.placement}`,
        meta: '切换方位后再触发，通知会出现在新的角落',
      })
    }

    const clearAll = (): void => {
      pushed = 0
      notification.destroyAll()
    }

    return () => slots.default?.({ push, clearAll })
  },
})
</script>

<template>
  <div class="ntf-place">
    <div class="ntf-place__picker" role="group" aria-label="通知堆叠方位">
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
          <SnButton type="primary" @click="push">在此方位触发一条</SnButton>
          <SnButton @click="clearAll">全部关闭</SnButton>
        </div>
      </PlacementTrigger>
    </SnNotificationProvider>

    <p class="ntf-place__hint">
      当前方位 <code>{{ placement }}</code>：通知容器整体吸附到该角落，已在屏的通知也会一起移动。
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
