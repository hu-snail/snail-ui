<script setup lang="ts">
/**
 * float-button-web-basic — the three variants of a single `SnFloatButton`:
 * a default circle action, a primary circle action and a square action with a
 * `description` line.
 *
 * `fixed: false` keeps the buttons inside the demo stage below (they pin to
 * the stage's corner, not to the browser window) — that is the mode to use
 * whenever the button belongs to a block instead of the whole page. The
 * viewport-pinned mode is demonstrated on its own in the 定位 section, in a
 * bordered stage that mimics a browser window.
 */
import { FileText, Plus, Search } from 'lucide-vue-next'
import { SnFloatButton } from '@snui/vue-web'
</script>

<template>
  <div class="float-button-demo">
    <p class="float-button-demo__hint">
      舞台右下角（模块内定位）：默认圆形（<code>tooltip</code>）、品牌色圆形
      （<code>type="primary"</code>）、方形带文字（<code>shape="square"</code> +
      <code>description</code>）。
    </p>

    <div class="float-button-demo__stage">
      <span class="float-button-demo__stage-label">position: relative 的容器</span>
      <SnFloatButton :fixed="false" :icon="Plus" tooltip="新建" :right="16" :bottom="16" />
      <SnFloatButton
        :fixed="false"
        type="primary"
        :icon="Search"
        tooltip="搜索"
        :right="16"
        :bottom="72"
      />
      <SnFloatButton
        :fixed="false"
        shape="square"
        :icon="FileText"
        description="文档"
        :right="16"
        :bottom="128"
      />
    </div>
  </div>
</template>

<style scoped>
.float-button-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.float-button-demo__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.8;
  color: var(--vp-c-text-2);
}

.float-button-demo__hint code {
  padding: 0 4px;
  border-radius: 4px;
  background: var(--vp-c-bg-soft);
  font-size: 12px;
}

/* The positioning context: the buttons below pin to THIS box. */
.float-button-demo__stage {
  position: relative;
  min-height: 220px;
  padding: 12px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  overflow: hidden;
}

.float-button-demo__stage-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>