<script setup lang="ts">
/**
 * float-button-web-placement — 八个定位锚点。
 *
 * 每个格子都是一个 `position: relative` 的小舞台，按钮用 `fixed: false` 钉在自己
 * 格子的对应角 / 边中点上，这样一张图就能对照全部方位，而不会所有按钮都叠到浏览器
 * 窗口的右下角。
 *
 * 四角：`top-left` / `top-right` / `bottom-left` / `bottom-right`
 * 四边中点：`top` / `right` / `bottom` / `left`（用 `50%` + translate 居中）
 */
import { Bell } from 'lucide-vue-next'
import { SnFloatButton } from '@snui/vue-web'
import type { SnFloatButtonPlacement } from '@snui/vue-web'

interface Anchor {
  placement: SnFloatButtonPlacement
  label: string
}

const anchors: Anchor[] = [
  { placement: 'top-left', label: 'top-left' },
  { placement: 'top', label: 'top' },
  { placement: 'top-right', label: 'top-right' },
  { placement: 'left', label: 'left' },
  { placement: 'right', label: 'right' },
  { placement: 'bottom-left', label: 'bottom-left' },
  { placement: 'bottom', label: 'bottom' },
  { placement: 'bottom-right', label: 'bottom-right' },
]
</script>

<template>
  <div class="placement-demo">
    <div class="placement-demo__grid">
      <div v-for="anchor in anchors" :key="anchor.placement" class="placement-demo__cell">
        <span class="placement-demo__label">{{ anchor.label }}</span>
        <div class="placement-demo__stage">
          <SnFloatButton
            :fixed="false"
            :placement="anchor.placement"
            :icon="Bell"
            :tooltip="anchor.label"
          />
        </div>
      </div>
    </div>
    <p class="placement-demo__hint">
      格子内是 <code>position: relative</code> 舞台 + <code>fixed: false</code>；
      真实页面里省略 <code>fixed</code> 就是钉到视口对应位置。
    </p>
  </div>
</template>

<style scoped>
.placement-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.placement-demo__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

@media (max-width: 720px) {
  .placement-demo__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.placement-demo__cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.placement-demo__label {
  font-family: ui-monospace, monospace;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.placement-demo__stage {
  position: relative;
  height: 104px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.placement-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.placement-demo__hint code {
  padding: 0 4px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
}
</style>