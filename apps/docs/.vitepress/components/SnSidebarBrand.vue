<script setup lang="ts">
/**
 * SnSidebarBrand — 悬浮侧栏面板顶部的「文档目录」标签行。
 *
 * 品牌（logo + snail-aui 标题）已迁移到文档页导航岛左缘（SnDocsNav 的
 * `.sn-docs-nav__brand`，custom.css 不再在 :not(.home) 下隐藏它）；本组件
 * 只承担侧栏菜单的分区标题：中文「文档目录」/ 英文「Contents」。
 *
 * 仅在桌面悬浮态（≥960px 且 body.sn-nav-floating）显示，随面板吸顶；
 * 胶囊（SnSidebarEndSwitch）的吸顶线由 custom.css 按 --sn-sidebar-brand-h
 * 下移一行，两段吸顶条堆叠、零滑动。保留原类名（.sn-sidebar-brand*）——
 * custom.css §18 的吸顶几何按这些类名定位。
 */
import { computed } from 'vue';
import { useData } from 'vitepress';

const { lang } = useData();
const label = computed(() => (lang.value === 'en-US' ? 'Contents' : '文档目录'));
</script>

<template>
  <div class="sn-sidebar-brand" role="heading" aria-level="2">
    <span class="sn-sidebar-brand__title">{{ label }}</span>
  </div>
</template>

<style scoped>
/* 默认隐藏：仅 custom.css §18 的桌面悬浮态规则将其展开为吸顶标签行 */
.sn-sidebar-brand {
  display: none;
}
</style>
