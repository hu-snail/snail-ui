<script setup lang="ts">
/**
 * AUI Preview — real Vue 3 app using @snui/vue-web components.
 *
 * Validates that the component library builds and renders end-to-end.
 * No runtime schema interpretation; just plain Vue SFC usage.
 */

import { ref } from 'vue'
import { SnButton } from '@snui/vue-web'

const count = ref(0)
const isDark = ref(false)

function toggleTheme(): void {
  isDark.value = !isDark.value
  document.documentElement.dataset.theme = isDark.value ? 'dark' : ''
}
</script>

<template>
  <div class="page">
    <header>
      <h1>AUI Preview</h1>
      <p>SnButton 端到端 demo · {{ count }} 次点击</p>
      <SnButton @click="toggleTheme">
        {{ isDark ? '切换到 Light' : '切换到 Dark' }}
      </SnButton>
    </header>

    <section>
      <h2>变体</h2>
      <div class="row">
        <SnButton>Default</SnButton>
        <SnButton type="primary">Primary</SnButton>
        <SnButton type="success">Success</SnButton>
        <SnButton type="warning">Warning</SnButton>
        <SnButton type="error">Danger</SnButton>
        <SnButton type="info">Info</SnButton>
      </div>
    </section>

    <section>
      <h2>尺寸</h2>
      <div class="row">
        <SnButton size="tiny" type="primary">tiny</SnButton>
        <SnButton size="small" type="primary">small</SnButton>
        <SnButton size="medium" type="primary">medium</SnButton>
        <SnButton size="large" type="primary">large</SnButton>
      </div>
    </section>

    <section>
      <h2>状态</h2>
      <div class="row">
        <SnButton disabled>禁用</SnButton>
        <SnButton loading type="primary">加载中</SnButton>
        <SnButton round type="success">圆角</SnButton>
        <SnButton block type="warning">块级</SnButton>
      </div>
    </section>

    <section>
      <h2>交互</h2>
      <SnButton type="primary" @click="count++">点击 +1</SnButton>
      <SnButton @click="count = 0">重置</SnButton>
    </section>
  </div>
</template>

<style>
:root {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--sn-color-text-primary);
  background: var(--sn-color-background-surface);
}
body { margin: 0; }
.page {
  max-width: 880px;
  margin: 0 auto;
  padding: 56px 24px 96px;
}
h1 {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 8px;
}
h2 {
  font-size: 18px;
  font-weight: 500;
  margin: 32px 0 16px;
  color: var(--sn-color-text-secondary);
}
header p {
  color: var(--sn-color-text-secondary);
  margin: 0 0 16px;
}
.row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
section + section {
  border-top: 1px solid var(--sn-color-border-subtle);
  padding-top: 24px;
}
</style>
