<script setup lang="ts">
/**
 * float-button-web-basic — the three variants of a single `SnFloatButton`:
 * a default circle action, a primary circle action and a square action with a
 * `description` line. Each button uses a different corner offset so a single
 * docs page can show all of them in the same viewport corner.
 *
 * `SnFloatButton` is `position: fixed`, so the buttons stay pinned to the
 * viewport corner while the docs page scrolls — exactly how the component is
 * used in a real page shell.
 */
import { FileText, Plus, Search } from 'lucide-vue-next'
import { SnFloatButton } from '@snui/vue-web'
</script>

<template>
  <div class="float-button-demo">
    <p class="float-button-demo__hint">
      右下角从上到下：默认圆形（<code>tooltip</code>）、品牌色圆形（<code>type="primary"</code>）、
      方形带文字（<code>shape="square"</code> + <code>description</code>）。
    </p>

    <SnFloatButton :icon="Plus" tooltip="新建" :right="24" :bottom="24" />
    <SnFloatButton type="primary" :icon="Search" tooltip="搜索" :right="24" :bottom="88" />
    <SnFloatButton
      shape="square"
      :icon="FileText"
      description="文档"
      :right="24"
      :bottom="152"
    />
  </div>
</template>

<style scoped>
.float-button-demo {
  width: 100%;
  min-height: 80px;
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
</style>