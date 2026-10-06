<script setup lang="ts">
/**
 * breadcrumb-web-item-count — SnBreadcrumb `itemCount` truncation
 * (mirrors n-breadcrumb `itemCount`). When total items exceed the cap,
 * head + tail portions are kept with a "X more" affordance in the middle.
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px;">
    <div>
      <p style="margin:0 0 6px;font-size:13px;color:var(--vp-c-text-2);">全部显示（6 项）</p>
      <SnBreadcrumb separator="/">
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/quick-start">Quick Start</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/install">Install</SnBreadcrumbItem>
        <SnBreadcrumbItem>pnpm</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div>
      <p style="margin:0 0 6px;font-size:13px;color:var(--vp-c-text-2);">itemCount=3（中间隐藏 2 项）</p>
      <SnBreadcrumb separator="/" :item-count="3">
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/quick-start">Quick Start</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/install">Install</SnBreadcrumbItem>
        <SnBreadcrumbItem>pnpm</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div>
      <p style="margin:0 0 6px;font-size:13px;color:var(--vp-c-text-2);">itemCount=4（中间隐藏 4 项）</p>
      <SnBreadcrumb separator="/" :item-count="4">
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/quick-start">Quick Start</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/install">Install</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/install/pnpm">pnpm</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web/install/pnpm/cmd">cmd</SnBreadcrumbItem>
        <SnBreadcrumbItem>install</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
  </div>
</template>