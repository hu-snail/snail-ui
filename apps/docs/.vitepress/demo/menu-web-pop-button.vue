<script setup lang="ts">
/**
 * menu-web-pop-button — SnMenu `mode="popButton"` (Floating Action
 * Button menu / Speed Dial).
 *
 * The menu anchors to the bottom-right of the viewport. Each item is a
 * 48×48 circular icon button; on hover the icon's label slides in from
 * the right (Material Design Speed Dial style).
 *
 * Use cases: secondary actions that shouldn't be in the main nav but
 * need persistent access — quick-add, AI helper, capture, etc.
 *
 * NOTE on the demo: the SnMenu root is `position: fixed` so the menu
 * floats at the page's bottom-right in a real app. Inside a docs demo
 * card that lives in the article flow, the fixed element would anchor
 * to the viewport (outside the demo card). To show it inside the demo
 * stage we override position to `absolute` via inline style — this is
 * purely a demo concern; in production the menu stays viewport-fixed.
 */
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import { Lightbulb, Camera, Plus } from 'lucide-vue-next'

const active = ref<string | number | null>(null)

const items = [
  { key: 'ideas', label: 'Ideas', icon: Lightbulb },
  { key: 'camera', label: 'Camera', icon: Camera },
  { key: 'new', label: '新建', icon: Plus },
]
</script>

<template>
  <div class="sn-pop-button-demo">
    <div class="sn-pop-button-demo__stage">
      <span class="sn-pop-button-demo__target">悬停右下角悬浮按钮 → 展开 label</span>
      <SnMenu
        mode="popButton"
        :options="items"
        v-model:value="active"
        style="position: absolute;"
      />
    </div>
    <p class="sn-pop-button-demo__active">
      当前选中：<code>{{ active ?? '(无)' }}</code>
    </p>
  </div>
</template>

<style scoped>
.sn-pop-button-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.sn-pop-button-demo__stage {
  position: relative;
  width: 100%;
  height: 220px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.sn-pop-button-demo__target {
  user-select: none;
}
.sn-pop-button-demo__active {
  margin: 0;
  font-size: 13px;
  color: var(--vp-c-text-1);
}
.sn-pop-button-demo__active code {
  background: var(--vp-c-bg-soft);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
}
</style>