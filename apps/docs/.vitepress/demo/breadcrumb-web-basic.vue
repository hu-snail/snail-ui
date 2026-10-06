<script setup lang="ts">
/**
 * breadcrumb-web-basic — SnBreadcrumb 默认分隔符 / 自定义分隔符 / 末页不可点
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <p class="sn-breadcrumb-demo__label">默认分隔符</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components/web">组件 · Web</SnBreadcrumbItem>
      <SnBreadcrumbItem>Card</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">自定义分隔符</p>
    <SnBreadcrumb separator="›">
      <SnBreadcrumbItem href="/">snail-aui</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
      <SnBreadcrumbItem>Button</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">深度路径</p>
    <SnBreadcrumb separator="·">
      <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide">指南</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
      <SnBreadcrumbItem>介绍</SnBreadcrumbItem>
    </SnBreadcrumb>
  </div>
</template>

<style scoped>
/*
 * Use text-align: center on the wrapper and display: inline-flex on the
 * breadcrumb nav. Both the description label and the nav are then
 * horizontally centered by the parent's text-align rule, and the
 * baselines of the label text and the breadcrumb text fall on the
 * same line — no flexbox align-items ambiguity. The previous flex-
 * column layout had box centers aligned but text baselines offset
 * because the breadcrumb nav is taller than a single text line.
 */
.sn-breadcrumb-demo {
  text-align: center;
}
.sn-breadcrumb-demo__label {
  margin: 0 0 4px;
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.sn-breadcrumb-demo :deep(.sn-breadcrumb),
.sn-breadcrumb-demo .sn-breadcrumb {
  display: inline-flex;
  margin: 0 auto 16px;
}
.sn-breadcrumb-demo :deep(.sn-breadcrumb:last-of-type),
.sn-breadcrumb-demo .sn-breadcrumb:last-of-type {
  margin-bottom: 0;
}
</style>