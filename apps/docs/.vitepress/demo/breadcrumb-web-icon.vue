<script setup lang="ts">
/**
 * breadcrumb-web-icon — SnBreadcrumbItem `icon` prop (SnIcon-wrapped).
 * Replaces the naive-ui `cB('icon')` slot pattern with a typed prop
 * so consumers get the full lucide / iconify / @vicons tree-shake
 * benefits without manually wrapping each glyph in <SnIcon>.
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
import { Home, ChevronRight, Settings, FileText } from 'lucide-vue-next'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:16px;">
    <div>
      <p style="margin:0 0 6px;font-size:13px;color:var(--vp-c-text-2);">首项带 icon</p>
      <SnBreadcrumb separator="/">
        <SnBreadcrumbItem :icon="Home" href="/">首页</SnBreadcrumbItem>
        <SnBreadcrumbItem :icon="Settings" href="/settings">设置</SnBreadcrumbItem>
        <SnBreadcrumbItem :icon="FileText">文档</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div>
      <p style="margin:0 0 6px;font-size:13px;color:var(--vp-c-text-2);">icon + 自定义 color (currentColor)</p>
      <SnBreadcrumb separator="›">
        <SnBreadcrumbItem :icon="Home" href="/" style="--sn-color-action-primary: #2563eb;">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem :icon="ChevronRight" href="/components">Components</SnBreadcrumbItem>
        <SnBreadcrumbItem>Breadcrumb</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
  </div>
</template>