<script setup lang="ts">
/**
 * Custom VitePress Layout — composes real @snui/vue-web components for the
 * chrome (SnDocsNav / SnDocsFooter / SnDocsHome / SnDocsSidebar) on top of
 * vitepress's DefaultTheme.
 *
 * Phase 1 chrome replacement (per WBS AUI-DOCS-019):
 *   - SnDocsNav: SnMenu + SnDivider + SnButton (search + locale switch + theme toggle)
 *   - SnDocsSidebarToggle: collapse / expand the left nav (navbar keeps an
 *     expand control while collapsed)
 *   - SnDocsFooter: SnDivider + SnCard
 *   - SnDocsHome: SnGrid + SnCard + SnButton (mounted on home-hero-after)
 *   - SnDocsSidebar: SnCollapse + SnCard (consumed via SnDocsPage wrapper
 *     on each page that opts into it)
 *
 * Vitepress's default routing / page meta / search modal / scroll spy /
 * outline panel are preserved (we override chrome slots, not the layout
 * framework). Skin class propagation rides on SnConfigProvider via
 * StyleSwitcher / DemoLabFab, which already manage the body class.
 *
 * Per AUI-DOCS-018, the DemoLabFab is still injected via doc-after slot so
 * the FAB appears on every page (mounts only when route is under
 * `/components/**`, gated inside the FAB itself).
 */

import { computed, onMounted, watch } from 'vue';
import DefaultTheme from 'vitepress/theme';
import { useRoute } from 'vitepress';
import SnSidebarGroupIcons from '../components/SnSidebarGroupIcons.vue';
import SnSidebarBrand from '../components/SnSidebarBrand.vue';
import SnSidebarEndSwitch from '../components/SnSidebarEndSwitch.vue';
import DemoLabFab from '../components/DemoLabFab.vue';
import DemoDock from '../components/DemoDock.vue';
import { resetDock } from '../utils/demo-dock';
import SnDocsNav from '../components/SnDocsNav.vue';
import SnDocsFooter from '../components/SnDocsFooter.vue';
import SnDocsHome from '../components/SnDocsHome.vue';
import SnDocsSidebarToggle from '../components/SnDocsSidebarToggle.vue';
import SnDocsDocActions from '../components/SnDocsDocActions.vue';
import SnDocsTemplateEnd from '../components/SnDocsTemplateEnd.vue';
import SnHomeThemeDock from '../components/SnHomeThemeDock.vue';
import { applyStoredSiteTheme } from '../utils/theme-editor/state';
import { enNav, nav } from '../config-nav';
import { useData } from 'vitepress';
import { SnConfigProvider, enUS } from '@snui/vue-web';
import type { SnLocaleInput } from '@snui/vue-web';

const route = useRoute();
/** 首页 = zh 根路径 + /en/ 首页（两个 locale 的 layout:home 页共用 SnDocsHome）。 */
const isHome = computed(
  () => route.path === '/' || route.path === '' || route.path === '/en' || route.path === '/en/',
);
const showFab = computed(() => route.path.startsWith('/components/'));
const showTemplateEnd = computed(() => route.path.startsWith('/templates/'));
/**
 * 端切换胶囊只在组件页显示：/components/web ↔ /components/uni 互跳是它
 * 唯一的语义，指南 / 主题 / 模板 / 生态等页没有「端」概念，不需要它。
 */
const showEndSwitch = computed(() => route.path.startsWith('/components/'));

/**
 * 主题编辑器页（/theme/editor）的侧栏移除与全宽画布由 **frontmatter** 承担
 * （`sidebar: false` / `aside: false`，见 theme/editor.md）—— 这是 VitePress
 * 的原生机制：`useSidebar()` 据此返回空分组，`VPContent` 直接不带
 * `has-sidebar`，布局位移无需任何 CSS 覆盖。
 */

/** The `/en/` locale mirrors the root locale; swap the nav list with it. */
const isEn = computed(() => route.path === '/en' || route.path.startsWith('/en/'));
const navItems = computed(() => (isEn.value ? enNav : nav));

/**
 * 站点级组件 locale —— 跟随 VitePress 语言切换（root=zh-CN → 内置 zhCN，
 * /en/ → enUS）。嵌套的 `<SnConfigProvider skin>` 会透传该值（见组件内
 * parentLocale 逻辑），所有示例组件随站点语言自动切换文案。
 */
const { lang, isDark } = useData();
const siteLocale = computed<SnLocaleInput | undefined>(() =>
  lang.value === 'en-US' ? enUS : undefined,
);

/**
 * 首页导航反色 = 首页 && 站点深色主题。首页画布深浅由 SnDocsHome 的
 * `sn-home--dark` 修饰类跟随 isDark 切换，导航的 inverted 与之保持同步。
 */
const homeNavInverted = computed(() => isHome.value && isDark.value);

/**
 * 站点级主题色：只跟随「用户存过的自定义主题」。
 *
 * 放在 Layout（每页都会挂载）而不是色块自身，是为了让自定义主题色在换页、
 * 硬刷新后依然生效；没自定义过的访客这里不会注入任何覆盖。
 */
const resolvedMode = computed<'light' | 'dark'>(() => (isDark.value ? 'dark' : 'light'));
onMounted(() => {
  applyStoredSiteTheme(resolvedMode.value);
});
watch(resolvedMode, (mode) => {
  applyStoredSiteTheme(mode);
});

/**
 * The demo registry is per-page state, so a route change must clear it.
 *
 * Without this, navigating from `tag` to `badge` would leave the previous
 * page's section tabs in the dock (and a stale `active` name pointing at a
 * demo that no longer exists). `flush: 'post'` runs the reset after the old
 * page's demos have unmounted, so the new page starts from an empty registry
 * rather than racing its own registrations.
 */
watch(
  () => route.path,
  () => {
    resetDock();
  },
  { flush: 'post' },
);
</script>

<template>
  <SnConfigProvider :locale="siteLocale">
    <DefaultTheme.Layout>
      <!-- Replace the default top nav with SnDocsNav (real @snui/vue-web). -->
      <template #nav-bar-content-before>
        <SnDocsNav :items="navItems" :inverted="homeNavInverted" />
      </template>

      <template #sidebar-nav-before>
        <SnSidebarBrand />
        <SnSidebarEndSwitch v-if="showEndSwitch" />
        <SnDocsTemplateEnd v-if="showTemplateEnd" />
      </template>

      <!-- Sidebar collapse handle: one tab glued to the sidebar's LEFT edge,
         which stays in place in both states (collapsed it becomes the expand
         affordance — no hunting for a button at the navbar's left). It is
         mounted here, through `layout-top` — i.e. OUTSIDE VPSidebar —
         because that element is `overflow: hidden` (a child would be clipped
         at the edge it sits on) and carries a transform (which turns it into
         the containing block for fixed children, so `position: fixed` inside
         it would resolve against the sidebar box, not the viewport).
         custom.css §12 shows it on desktop whenever a sidebar is rendered,
         in both states, and animates the panel slide on collapse/expand. -->
      <template #layout-top>
        <SnSidebarGroupIcons />
        <div class="sn-docs-sidebar-handle">
          <SnDocsSidebarToggle placement="handle" />
        </div>
        <!-- 首页专属：底部居中的悬浮主题色块（fixed，Teleport 到 body） -->
        <ClientOnly>
          <SnHomeThemeDock v-if="isHome" />
        </ClientOnly>
      </template>

      <!-- Mount the custom home page (only rendered on /, inside the home
         layout's hero-after slot, so vitepress's default VPHero / VPFeatures
         shells still wrap it and the layout's mobile / theme hooks work). -->
      <template v-if="isHome" #home-hero-after>
        <SnDocsHome />
      </template>

      <!-- Replace the default footer with SnDocsFooter. VitePress 1.6.x exposes
         `layout-bottom` (there is no `layout-footer`), and the default
         VPFooter is suppressed in custom.css. -->
      <template #layout-bottom>
        <SnDocsFooter />
      </template>

      <!-- Article title row: copy the page source + open it on GitHub. The
         row is taken out of flow in custom.css §11 so it shares the line
         with the <h1> instead of pushing it down. -->
      <template #doc-before>
        <SnDocsDocActions />
      </template>

      <!--
      doc-after hosts two page-level widgets:
        - DemoLabFab: the style / theme / preview FAB (AUI-DOCS-018)
        - DemoDock:   the fixed device preview panel on uni component pages

      DemoDock renders itself through a Teleport to the document body because
      it is position:fixed; placing it here only decides *when* it mounts, not
      where it paints.
    -->
      <template #doc-after>
        <ClientOnly>
          <DemoLabFab v-if="showFab" />
          <DemoDock />
        </ClientOnly>
      </template>
    </DefaultTheme.Layout>
  </SnConfigProvider>
</template>
