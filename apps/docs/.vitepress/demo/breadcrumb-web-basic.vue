<script setup lang="ts">
/**
 * breadcrumb-web-basic — SnBreadcrumb 默认分隔符 / 自定义分隔符 / 末页不可点
 */
import { SnBreadcrumb, SnBreadcrumbItem } from '@snui/vue-web'
</script>

<template>
  <div class="sn-breadcrumb-demo">
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">默认分隔符</p>
      <SnBreadcrumb>
        <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/components/web">组件 · Web</SnBreadcrumbItem>
        <SnBreadcrumbItem>Card</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">自定义分隔符</p>
      <SnBreadcrumb separator="›">
        <SnBreadcrumbItem href="/">snail-aui</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/components/web">Components</SnBreadcrumbItem>
        <SnBreadcrumbItem>Button</SnBreadcrumbItem>
      </SnBreadcrumb>
    </div>
    <div class="sn-breadcrumb-demo__row">
      <p class="sn-breadcrumb-demo__label">深度路径</p>
      <SnBreadcrumb separator="·">
        <SnBreadcrumbItem href="/">首页</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide">指南</SnBreadcrumbItem>
        <SnBreadcrumbItem href="/guide/web">Web 端</SnBreadcrumbItem>
        <SnBreadcrumbItem>介绍</SnBreadcrumbItem>
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