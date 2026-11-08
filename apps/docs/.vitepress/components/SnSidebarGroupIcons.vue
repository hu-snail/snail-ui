<script setup lang="ts">
/**
 * SnSidebarGroupIcons — 给侧栏一级分类（VPSidebar level-0 组标题）注入图标。
 *
 * VitePress 的组标题没有 slot，因此采用轻量 DOM 注入：
 *   - 扫 `#VPSidebarNav` 下每个 `.group` 的标题文本；
 *   - 按前缀关键词匹配 lucide 图标（zh / en 两套组名共用关键词）；
 *   - 把图标 span 插到标题文本前，`data-sn-group-icon` 标记保证幂等。
 *
 * 注入器挂在 Layout 的 `layout-top`（侧栏外层），路由切换 / 侧栏重建时由
 * MutationObserver 触发补注。纯展示行为，不影响侧栏折叠 / 滚动逻辑。
 */
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';
import {
  Bot,
  Briefcase,
  ChartLine,
  Compass,
  GraduationCap,
  Home,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LayoutTemplate,
  MessageSquareWarning,
  Palette,
  PanelsTopLeft,
  Puzzle,
  Rocket,
  TextCursorInput,
} from 'lucide-vue-next';
import { h, markRaw, render, type Component } from 'vue';

/** 关键词 → 图标（顺序敏感：更特异的先判）。zh / en 组名共用前缀匹配。 */
const GROUP_ICONS: ReadonlyArray<readonly [pattern: RegExp, icon: Component]> = [
  [/^(ai\b|ai 生态|ai suite|ai 套件)/i, markRaw(Bot)],
  [/^(echarts|图表|chart)/i, markRaw(ChartLine)],
  [/^(basic|基础)/i, markRaw(LayoutGrid)],
  [/^(form|表单|录入)/i, markRaw(TextCursorInput)],
  [/^(layout|布局)/i, markRaw(PanelsTopLeft)],
  [/^(navigation|导航)/i, markRaw(Compass)],
  [/^(feedback|反馈)/i, markRaw(MessageSquareWarning)],
  [/^(data display|数据展示|display|展示)/i, markRaw(LayoutDashboard)],
  [/^(business|业务)/i, markRaw(Briefcase)],
  [/^(overview|概览|总览)/i, markRaw(Home)],
  [/^(快速开始|getting started|quick start)/i, markRaw(Rocket)],
  [/^(进阶|advanced)/i, markRaw(GraduationCap)],
  [/^(主题|theme|token)/i, markRaw(Palette)],
  [/^(风格包|style pack)/i, markRaw(Layers)],
  [/^(模板|套件|templates)/i, markRaw(LayoutTemplate)],
  [/^(生态|ecosystem)/i, markRaw(Puzzle)],
];

function iconFor(text: string): Component | null {
  const hit = GROUP_ICONS.find(([pattern]) => pattern.test(text.trim()));
  return hit ? hit[1] : null;
}

/** 一次完整扫描：给所有未标记的 level-0 组标题插入图标。 */
function injectIcons(): void {
  if (typeof document === 'undefined') return;
  const groups = document.querySelectorAll<HTMLDivElement>('#VPSidebarNav .group');
  for (const group of groups) {
    const titleEl = group.querySelector<HTMLElement>(
      ':scope > .items > .VPSidebarItem.level-0 > .item > .text, :scope > .VPSidebarItem.level-0 > .item > .text',
    );
    if (!titleEl || titleEl.dataset.snGroupIcon === '1') continue;
    const icon = iconFor(titleEl.textContent ?? '');
    if (!icon) {
      titleEl.dataset.snGroupIcon = 'none';
      continue;
    }
    const holder = document.createElement('span');
    holder.className = 'sn-sidebar-group-icon';
    holder.setAttribute('aria-hidden', 'true');
    titleEl.dataset.snGroupIcon = '1';
    titleEl.insertBefore(holder, titleEl.firstChild);
    render(h(icon, { size: 14, strokeWidth: 2 }), holder);
  }
}

let observer: MutationObserver | undefined;

onMounted(() => {
  void nextTick(injectIcons);
  // 侧栏内容随路由 / 折叠 / locale 切换重建时自动补注。
  observer = new MutationObserver(() => injectIcons());
  const nav = document.getElementById('VPSidebarNav');
  if (nav) observer.observe(nav, { childList: true, subtree: true });
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = undefined;
});

// 路由变化兜底（部分重建不触发 subtree childList 时仍能补上）。
const route = useRoute();
watch(
  () => route.path,
  () => void nextTick(injectIcons),
);
</script>

<template>
  <!-- 无渲染输出：纯 DOM 注入器 -->
  <span style="display: none" aria-hidden="true" />
</template>
