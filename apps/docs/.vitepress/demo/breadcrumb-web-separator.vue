<script setup lang="ts">
/**
 * breadcrumb-web-separator — SnBreadcrumb custom separator glyph variants.
 * `separator` is plain string — use unicode / emoji / ASCII as needed.
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <SnBreadcrumb separator="/">
      <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components/web">组件 · Web</SnBreadcrumbItem>
      <SnBreadcrumbItem>Card</SnBreadcrumbItem>
    </SnBreadcrumb>
    <SnBreadcrumb separator="›">
      <SnBreadcrumbItem href="/">snail-aui</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
      <SnBreadcrumbItem>Button</SnBreadcrumbItem>
    </SnBreadcrumb>
    <SnBreadcrumb separator="·">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
      <SnBreadcrumbItem>介绍</SnBreadcrumbItem>
    </SnBreadcrumb>
    <SnBreadcrumb separator="→">
      <SnBreadcrumbItem href="/">snail-aui</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/style-packs">Style Packs</SnBreadcrumbItem>
      <SnBreadcrumbItem>iOS</SnBreadcrumbItem>
    </SnBreadcrumb>
  </div>
</template>