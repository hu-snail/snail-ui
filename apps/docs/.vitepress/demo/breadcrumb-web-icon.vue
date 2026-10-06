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
  <div class="sn-breadcrumb-demo">
    <p class="sn-breadcrumb-demo__label">首项带 icon</p>
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem :icon="Home" href="/">首页</SnBreadcrumbItem>
      <SnBreadcrumbItem :icon="Settings" href="/settings">设置</SnBreadcrumbItem>
      <SnBreadcrumbItem :icon="FileText">文档</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">icon + chip variant（居中、每项背景）</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem variant="chip" :icon="Home" href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="chip" :icon="Settings" href="/settings">Settings</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="chip" :icon="ChevronRight" :show-separator="false">Profile</SnBreadcrumbItem>
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
</style>