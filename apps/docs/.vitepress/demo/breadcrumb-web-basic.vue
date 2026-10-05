<script setup lang="ts">
/**
 * breadcrumb-web-basic — SnBreadcrumb 默认分隔符 / 自定义分隔符 / 末项不可点
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div>
      <p style="margin:0 0 4px;font-size:12px;color:var(--vp-c-text-2);">默认分隔符</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/components/web">组件 · Web</SnBreadcrumbItem>
        <SnBreadcrumbItem>Card</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div>
      <p style="margin:0 0 4px;font-size:12px;color:var(--vp-c-text-2);">自定义分隔符</p>
      <SnBreadcrumb separator="›">
        <SnBreadcrumbItem href="/">snail-aui</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
        <SnBreadcrumbItem>Button</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div>
      <p style="margin:0 0 4px;font-size:12px;color:var(--vp-c-text-2);">深度路径</p>
      <SnBreadcrumb separator="·">
        <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide">指南</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
        <SnBreadcrumbItem>介绍</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
  </div>
</template>