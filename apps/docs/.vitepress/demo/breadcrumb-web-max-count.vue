<script setup lang="ts">
/**
 * breadcrumb-web-max-count — SnBreadcrumb `maxCount` prop.
 * When total items exceed the cap, the trail renders as
 * head(1) + ellipsis + tail(maxCount-1) — the middle items fold into
 * a single "… N more …" affordance.
 *
 * Algorithm mirrors Element Plus `max-count` / NextUI `maxItems`:
 *   - head always shows the first 1 item
 *   - tail shows the last `maxCount - 1` items
 *   - everything between is collapsed
 *
 * AUI extension beyond n-breadcrumb (naive-ui handles long breadcrumbs
 * via a dropdown slot on the middle item; this prop gives consumers a
 * faster declarative cap).
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">全部显示（5 项）</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs">Docs</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs/web">Web</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs/web/sn-breadcrumb">SnBreadcrumb</SnBreadcrumbItem>
        <SnBreadcrumbItem>Current</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">max-count=3 — 折叠中间 2 项</p>
      <SnBreadcrumb :max-count="3">
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs">Docs</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs/web">Web</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs/web/sn-breadcrumb">SnBreadcrumb</SnBreadcrumbItem>
        <SnBreadcrumbItem>Current</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">max-count=4 — 折叠中间 1 项</p>
      <SnBreadcrumb :max-count="4">
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs">Docs</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs/web">Web</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/docs/web/sn-breadcrumb">SnBreadcrumb</SnBreadcrumbItem>
        <SnBreadcrumbItem>Current</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
  </div>
</template>

<style scoped>
.sn-breadcrumb-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}
.sn-breadcrumb-demo__row {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.sn-breadcrumb-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-align: center;
}
</style>