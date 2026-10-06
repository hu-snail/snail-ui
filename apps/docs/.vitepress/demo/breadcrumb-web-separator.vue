<script setup lang="ts">
/**
 * breadcrumb-web-separator — SnBreadcrumb / SnBreadcrumbItem custom
 * separator. Parent-level `separator` is the default for every item;
 * any item can override via its own `separator` prop or `<template
 * #separator>` slot (the slot wins).
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <p class="sn-breadcrumb-demo__label">默认 /</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
      <SnBreadcrumbItem>Install</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">parent separator="›"</p>
    <SnBreadcrumb separator="›">
      <SnBreadcrumbItem href="/">snail-aui</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
      <SnBreadcrumbItem>Breadcrumb</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">per-item separator 覆盖（中间用 ~）</p>
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem separator="~" href="/guide">Guide</SnBreadcrumbItem>
      <SnBreadcrumbItem>Install</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">slot 完全自定义分隔符（lucide 图标）</p>
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide">
        Guide
        <template #separator>
          <span class="sn-breadcrumb-demo__icon-sep">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
          </span>
        </template>
      </SnBreadcrumbItem>
      <SnBreadcrumbItem>Install</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">末项 showSeparator=false</p>
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
      <SnBreadcrumbItem :show-separator="false">Install</SnBreadcrumbItem>
    </SnBreadcrumb>
  </div>
</template>

<style scoped>
.sn-breadcrumb-demo {
  text-align: center;
}
.sn-breadcrumb-demo__label {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.sn-breadcrumb-demo :deep(.sn-breadcrumb) {
  display: inline-flex;
  margin: 0 auto 16px;
}
.sn-breadcrumb-demo :deep(.sn-breadcrumb:last-of-type) {
  margin-bottom: 0;
}
.sn-breadcrumb-demo__icon-sep {
  display: inline-flex;
  align-items: center;
}
</style>