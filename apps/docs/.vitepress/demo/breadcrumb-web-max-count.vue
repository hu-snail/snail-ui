<script setup lang="ts">
/**
 * breadcrumb-web-max-count — SnBreadcrumb `maxCount` prop.
 * When total items exceed the cap, the trail renders as
 * head(1) + ellipsis + tail(maxCount-1) — the middle items fold into
 * a single "… N more …" affordance.
 *
 *   - head always shows the first 1 item
 *   - tail shows the last `maxCount - 1` items
 *   - everything between is collapsed
 *
 * snail-aui extension: a declarative cap on long breadcrumb trails
 * (no dropdown wiring needed on the middle item).
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <p class="sn-breadcrumb-demo__label">全部显示（5 项）</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs">Docs</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs/web">Web</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs/web/sn-breadcrumb">SnBreadcrumb</SnBreadcrumbItem>
      <SnBreadcrumbItem>Current</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">max-count=3 — 折叠中间 2 项</p>
    <SnBreadcrumb :max-count="3">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs">Docs</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs/web">Web</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs/web/sn-breadcrumb">SnBreadcrumb</SnBreadcrumbItem>
      <SnBreadcrumbItem>Current</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">max-count=4 — 折叠中间 1 项</p>
    <SnBreadcrumb :max-count="4">
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs">Docs</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs/web">Web</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/docs/web/sn-breadcrumb">SnBreadcrumb</SnBreadcrumbItem>
      <SnBreadcrumbItem>Current</SnBreadcrumbItem>
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