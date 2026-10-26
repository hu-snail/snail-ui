<script setup lang="ts">
/**
 * breadcrumb-web-variant — SnBreadcrumbItem `variant` prop.
 * Each item can independently pick a background treatment:
 *   - `plain` (default) — transparent, sits inline
 *   - `chip` — filled background pill, ideal for compact trail in
 *              dashboards / settings pages
 *   - `outlined` — transparent + thin border, medium emphasis
 * snail-aui extension: a per-item background variant. Combine with
 * `show-separator=false` on every item for the cleanest chip look.
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web';
import { Home, Settings, FileText } from 'lucide-vue-next';
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <p class="sn-breadcrumb-demo__label">plain (default)</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
      <SnBreadcrumbItem>Install</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">chip — filled background per item</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem variant="chip" :icon="Home" href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="chip" :icon="Settings" href="/settings">Settings</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="chip" :icon="FileText" :show-separator="false"
        >Details</SnBreadcrumbItem
      >
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">outlined — transparent + border</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem variant="outlined" href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="outlined" href="/guide">Guide</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="outlined" :show-separator="false">Install</SnBreadcrumbItem>
    </SnBreadcrumb>

    <p class="sn-breadcrumb-demo__label">mix — current page outlined, others plain</p>
    <SnBreadcrumb>
      <SnBreadcrumbItem variant="chip" :icon="Home" href="/">Home</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="chip" :icon="Settings" href="/settings">Settings</SnBreadcrumbItem>
      <SnBreadcrumbItem variant="outlined" :show-separator="false">Profile</SnBreadcrumbItem>
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
