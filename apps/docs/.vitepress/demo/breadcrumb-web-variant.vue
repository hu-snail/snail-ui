<script setup lang="ts">
/**
 * breadcrumb-web-variant — SnBreadcrumbItem `variant` prop.
 * Each item can independently pick a background treatment:
 *   - `plain` (default) — transparent, sits inline (naive-ui default)
 *   - `chip` — filled background pill, ideal for compact trail in
 *              dashboards / settings pages
 *   - `outlined` — transparent + thin border, medium emphasis
 * AUI extension beyond n-breadcrumb-item (naive-ui doesn't ship a
 * background variant). Combine with `show-separator=false` on every
 * item for the cleanest chip look.
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
import { Home, Settings, FileText } from 'lucide-vue-next'
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">plain (default)</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide">Guide</SnBreadcrumbItem>
        <SnBreadcrumbItem>Install</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">chip — 每项独立填充背景</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem variant="chip" :icon="Home" href="/">首页</SnBreadcrumbItem>
        <SnBreadcrumbItem variant="chip" :icon="Settings" href="/settings">设置</SnBreadcrumbItem>
        <SnBreadcrumbItem variant="chip" :icon="FileText" :show-separator="false">详情</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">outlined — 透明 + 边框</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem variant="outlined" href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem variant="outlined" href="/guide">Guide</SnBreadcrumbItem>
        <SnBreadcrumbItem variant="outlined" :show-separator="false">Install</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">mix — 当前页 outlined / 其他 plain</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem variant="chip" :icon="Home" href="/">Home</SnBreadcrumbItem>
        <SnBreadcrumbItem variant="chip" :icon="Settings" href="/settings">Settings</SnBreadcrumbItem>
        <SnBreadcrumbItem variant="outlined" :show-separator="false">Profile</SnBreadcrumbItem>
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