<script setup lang="ts">
/**
 * float-button-web-direction — 按钮组的四个展开方向。
 *
 * `direction` 决定堆栈从触发器往哪边长：
 *   up    堆栈在触发器上方（右下角默认）
 *   down  堆栈在触发器下方
 *   left  堆栈在触发器左侧
 *   right 堆栈在触发器右侧
 * 不传 `direction` 时按 `placement` 自动推导（永远朝视口中心展开）。
 *
 * 每个格子用 `fixed: false` 钉在自己的小舞台上，四格互不干扰。
 */
import { Bell, MessageSquare, Star } from 'lucide-vue-next'
import { SnFloatButton, SnFloatButtonGroup } from '@snui/vue-web'
import type { SnFloatButtonGroupDirection, SnFloatButtonPlacement } from '@snui/vue-web'

type OpenDirection = Exclude<SnFloatButtonGroupDirection, 'auto'>

interface Scenario {
  direction: OpenDirection
  /** The anchor that pairs naturally with this direction. */
  placement: SnFloatButtonPlacement
  note: string
}

const scenarios: Scenario[] = [
  { direction: 'up', placement: 'bottom-right', note: '默认：右下角向上展开' },
  { direction: 'down', placement: 'top-right', note: '向下展开' },
  { direction: 'left', placement: 'bottom-right', note: '向左展开' },
  { direction: 'right', placement: 'bottom-left', note: '向右展开' },
]
</script>

<template>
  <div class="direction-demo">
    <div class="direction-demo__grid">
      <div v-for="item in scenarios" :key="item.direction" class="direction-demo__cell">
        <span class="direction-demo__label">direction="{{ item.direction }}"</span>
        <div class="direction-demo__stage">
          <SnFloatButtonGroup
            :fixed="false"
            :direction="item.direction"
            :placement="item.placement"
            :right="12"
            :bottom="12"
            :gap="8"
            trigger-tooltip="展开"
          >
            <SnFloatButton :icon="MessageSquare" tooltip="评论" />
            <SnFloatButton :icon="Bell" tooltip="通知" />
            <SnFloatButton :icon="Star" tooltip="收藏" />
          </SnFloatButtonGroup>
        </div>
        <span class="direction-demo__note">{{ item.note }}</span>
      </div>
    </div>
    <p class="direction-demo__hint">
      点每个格子里的 <code>+</code> 看展开方向；<code>direction</code> 省略时按
      <code>placement</code> 自动选择，永远朝视口中心展开。
    </p>
  </div>
</template>

<style scoped>
.direction-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.direction-demo__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 720px) {
  .direction-demo__grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.direction-demo__cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.direction-demo__label {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.direction-demo__stage {
  position: relative;
  height: 200px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.direction-demo__note {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.direction-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.direction-demo__hint code {
  padding: 0 4px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}
</style>