<script setup lang="ts">
/**
 * menu-web-pop-button — SnMenu `mode="popButton"` (Floating Action
 * Button menu / Speed Dial).
 *
 * 三种交互状态：
 *   1. 默认          — 只有 trigger button（options 最后一项）显示
 *   2. hover 整个    — 其余圆形按钮淡入上滑展开（视觉）
 *   3. hover 单项   — 该项用 SnTooltip 显示文本
 *
 * 没有 viewport 固定定位 — 容器自带 `position: relative`，所以 demo
 * 里浮窗就停在卡片里；生产场景用同样的方式把 fab 嵌到你的面板/边栏里。
 */
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import { Lightbulb, Lightbulb as LightbulbOff, Plus } from 'lucide-vue-next'

const active = ref<string | number | null>('ideas')

const items = [
  { key: 'ideas',  label: 'Ideas',  icon: Lightbulb },
  { key: 'camera', label: 'Camera', icon: LightbulbOff },
  // Last item is the always-visible trigger.
  { key: 'new',    label: '新建',   icon: Plus },
]
</script>

<template>
  <div class="sn-pop-button-demo">
    <div class="sn-pop-button-demo__stage">
      <span class="sn-pop-button-demo__hint">
        hover 右下角的 <code>+</code> → 上面 2 项展开 → hover 单项出 Tooltip
      </span>

      <div class="sn-pop-button-demo__anchor">
        <SnMenu mode="popButton" :options="items" v-model:value="active" />
      </div>
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
  align-items: stretch;
}
.sn-pop-button-demo__stage {
  position: relative;
  width: 100%;
  height: 260px;
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  overflow: hidden;
}
.sn-pop-button-demo__hint {
  position: absolute;
  top: 16px;
  left: 16px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  user-select: none;
}
.sn-pop-button-demo__hint code {
  background: var(--vp-c-bg);
  padding: 1px 6px;
  border-radius: 3px;
  font-family: ui-monospace, monospace;
}
.sn-pop-button-demo__anchor {
  position: absolute;
  right: 24px;
  bottom: 24px;
  /* parent is `position: relative` so SnMenu sits here instead of the
   * viewport. (SnMenu root is `display: inline-flex`.) */
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