<script setup lang="ts">
/**
 * SnProLayoutClassic — the `classic` admin layout style of @snui/admin-layout.
 *
 * A self-contained layout template (its own component + its own styles) so a
 * host can import just this style and ship only its code:
 *
 *   import { SnProLayoutClassic } from '@snui/admin-layout/layouts/classic';
 *   import '@snui/admin-layout/layouts/classic/style.css';
 *
 * Geometry (README「布局风格」):
 *   [aside]  brand(SnProLogo) / grouped nav(SnMenu) / footer(SnProUser)
 *   [body ]  header(breadcrumb + search + notice + actions slot)
 *            title band (module heading)
 *            content (light full-bleed surface) / optional footer
 *
 * Shared pieces only — every layout of this package reuses the SAME
 * SnProLogo / SnProSearch / SnProNotice / SnProUser, so nothing is duplicated
 * per style and tree-shaking keeps the rest out of the bundle.
 *
 * Boundary (ADR-0006): layout-only. No auth, no request, no store, no route
 * registration. Every interaction emits (`select` / `search-select` /
 * `notice-select` / `user-select`) and the HOST navigates.
 */
import { computed, ref, useSlots } from 'vue';
import { PanelLeft } from 'lucide-vue-next';
import { SnBreadcrumb, SnBreadcrumbItem, SnMenu } from '@snui/vue-web';
import type { SnDropdownKey, SnDropdownOption, SnMenuOption } from '@snui/vue-web';
import SnProLogo from '../pro-logo/SnProLogo.vue';
import SnProSearch from '../pro-search/SnProSearch.vue';
import SnProNotice from '../pro-notice/SnProNotice.vue';
import SnProUser from '../pro-user/SnProUser.vue';
import { menuPathTo } from '../menu/sn-admin-menu';
import type { SnProNoticeItem, SnProUserProfile } from './sn-pro-classic-types';

defineOptions({ name: 'SnProLayoutClassic' });

const props = withDefaults(
  defineProps<{
    /** Menu tree — static-route derived or backend-mapped. */
    menus?: SnMenuOption[] | undefined;
    /** Selected menu key (controlled; usually `route.name`). */
    activeKey?: string | number | null | undefined;
    /** Folded sidebar. `v-model:collapsed`; uncontrolled when omitted. */
    collapsed?: boolean | undefined;
    /** Expanded sidebar width (px). Default 224. */
    siderWidth?: number | undefined;
    /** Folded sidebar width (px). Default 56. */
    siderCollapsedWidth?: number | undefined;
    /** Pin the shell to the viewport (100vh); false → height 100%. Default true. */
    fixed?: boolean | undefined;
    /** Show the sidebar collapse toggle in the header. Default true. */
    showCollapse?: boolean | undefined;
    /** Accessible label of the collapse toggle. Default '折叠侧边栏'. */
    collapseLabel?: string | undefined;
    /** Brand image URL (through to SnProLogo). */
    logo?: string | undefined;
    /** Brand title. */
    title?: string | undefined;
    /** Fallback brand letter. */
    mark?: string | undefined;
    /** Explicit breadcrumb labels. Omitted → derived from the active menu path. */
    breadcrumb?: string[] | undefined;
    /** Module heading shown in the title band (the `#title` slot replaces it). */
    pageTitle?: string | undefined;
    /** Show the built-in menu search box. Default true. */
    showSearch?: boolean | undefined;
    /** Search box placeholder. */
    searchPlaceholder?: string | undefined;
    /** Show the built-in notification bell. Default true. */
    showNotice?: boolean | undefined;
    /** Unread notification count (through to SnProNotice). */
    noticeCount?: number | undefined;
    /** Notification rows (host-owned data). */
    noticeItems?: SnProNoticeItem[] | undefined;
    /** Sidebar-footer profile. Omitted → no user card. */
    user?: SnProUserProfile | undefined;
    /** Rows of the user card's dropdown menu. */
    userMenus?: SnMenuOption[] | undefined;
  }>(),
  {
    menus: () => [],
    activeKey: null,
    // Explicit undefined keeps the collapse uncontrolled (same pattern as
    // SnProLayout) — boolean casting would silently force controlled mode.
    collapsed: undefined,
    siderWidth: 224,
    siderCollapsedWidth: 56,
    fixed: true,
    showCollapse: true,
    collapseLabel: '折叠侧边栏',
    logo: '',
    title: '',
    mark: 'S',
    breadcrumb: undefined,
    pageTitle: '',
    showSearch: true,
    searchPlaceholder: '搜索菜单',
    showNotice: true,
    noticeCount: 0,
    noticeItems: () => [],
    user: undefined,
    userMenus: () => [],
  },
);

const emit = defineEmits<{
  (e: 'update:collapsed', collapsed: boolean): void;
  /** Menu click — the HOST navigates. */
  (e: 'select', key: string | number | null, item: SnMenuOption): void;
  /** Search-result click — the HOST navigates. */
  (e: 'search-select', key: string | number, item: SnMenuOption): void;
  /** Notification row click — the HOST navigates / marks read. */
  (e: 'notice-select', key: string | number, item: SnProNoticeItem): void;
  /** "Mark all read" — the HOST performs it. */
  (e: 'notice-read-all'): void;
  /** User-card menu click — the HOST decides what it means. */
  (e: 'user-select', key: SnDropdownKey, item: SnDropdownOption): void;
}>();

defineSlots<{
  /** Routed content (usually `<RouterView />`). */
  default?(): unknown;
  /** Brand content replacement (forwarded to SnProLogo default slot). */
  logo?(): unknown;
  /** Module heading replacement (replaces `pageTitle`). */
  title?(): unknown;
  /** Search area replacement (replaces the built-in SnProSearch). */
  search?(): unknown;
  /** Notification area replacement (replaces the built-in SnProNotice). */
  notice?(): unknown;
  /** Extra right-hand header actions, after search + notice. */
  actions?(): unknown;
  /** Sidebar-footer replacement (replaces the built-in SnProUser). */
  user?(): unknown;
  /** Optional footer under the content area. */
  footer?(): unknown;
}>();

const slots = useSlots();

// ── Collapse: v-model:collapsed with an uncontrolled fallback ────────────
const innerCollapsed = ref(false);
const isCollapsed = computed(() => props.collapsed ?? innerCollapsed.value);

function toggleCollapsed(): void {
  const next = !isCollapsed.value;
  innerCollapsed.value = next;
  emit('update:collapsed', next);
}

// ── Breadcrumb: explicit prop wins, else the active menu path ────────────
const breadcrumbItems = computed<string[]>(() => {
  if (props.breadcrumb !== undefined) return props.breadcrumb;
  return menuPathTo(props.menus, props.activeKey).map((node) => node.label);
});

/** The title band renders when there is a heading to show (prop or slot). */
const hasTitleBand = computed(() => slots.title !== undefined || props.pageTitle !== '');

// ── Event forwarding (navigation stays in the host) ──────────────────────
function onSelect(key: string | number | null, item: SnMenuOption): void {
  emit('select', key, item);
}

function onSearchSelect(key: string | number, item: SnMenuOption): void {
  emit('search-select', key, item);
}

function onNoticeSelect(key: string | number, item: SnProNoticeItem): void {
  emit('notice-select', key, item);
}

function onUserSelect(key: SnDropdownKey, item: SnDropdownOption): void {
  emit('user-select', key, item);
}
</script>

<template>
  <div
    class="sn-pro-classic"
    :class="{ 'sn-pro-classic--fixed': props.fixed, 'sn-pro-classic--collapsed': isCollapsed }"
  >
    <aside
      class="sn-pro-classic__sider"
      :style="{
        '--sn-pro-classic-sider-width': `${props.siderWidth}px`,
        '--sn-pro-classic-sider-collapsed-width': `${props.siderCollapsedWidth}px`,
      }"
    >
      <div class="sn-pro-classic__brand">
        <SnProLogo :logo="props.logo" :title="props.title" :mark="props.mark" :collapsed="isCollapsed">
          <slot name="logo" />
        </SnProLogo>
      </div>

      <nav class="sn-pro-classic__nav">
        <SnMenu
          mode="vertical"
          :options="props.menus"
          :value="props.activeKey"
          :collapsed="isCollapsed"
          :collapsed-width="props.siderCollapsedWidth"
          @select="onSelect"
        />
      </nav>

      <!-- Sidebar footer: the user card (the screenshot's bottom profile). -->
      <div v-if="slots.user !== undefined || props.user !== undefined" class="sn-pro-classic__foot">
        <slot name="user">
          <SnProUser
            v-if="props.user !== undefined"
            :name="props.user.name"
            :description="props.user.description"
            :avatar="props.user.avatar"
            :collapsed="isCollapsed"
            :menus="props.userMenus"
            @select="onUserSelect"
          />
        </slot>
      </div>
    </aside>

    <section class="sn-pro-classic__body">
      <header class="sn-pro-classic__header">
        <button
          v-if="props.showCollapse"
          type="button"
          class="sn-pro-classic__toggle"
          :aria-label="props.collapseLabel"
          :title="props.collapseLabel"
          @click="toggleCollapsed"
        >
          <PanelLeft :size="18" aria-hidden="true" />
        </button>

        <SnBreadcrumb v-if="breadcrumbItems.length > 0" class="sn-pro-classic__crumb">
          <SnBreadcrumbItem v-for="item in breadcrumbItems" :key="item" :clickable="false">
            {{ item }}
          </SnBreadcrumbItem>
        </SnBreadcrumb>

        <div class="sn-pro-classic__actions">
          <slot name="search">
            <SnProSearch
              v-if="props.showSearch"
              class="sn-pro-classic__search"
              :menus="props.menus"
              :placeholder="props.searchPlaceholder"
              size="small"
              @select="onSearchSelect"
            />
          </slot>
          <slot name="notice">
            <SnProNotice
              v-if="props.showNotice"
              :count="props.noticeCount"
              :items="props.noticeItems"
              @select="onNoticeSelect"
              @read-all="emit('notice-read-all')"
            />
          </slot>
          <slot name="actions" />
        </div>
      </header>

      <div v-if="hasTitleBand" class="sn-pro-classic__title-band">
        <slot name="title">
          <h1 class="sn-pro-classic__heading">{{ props.pageTitle }}</h1>
        </slot>
      </div>

      <div class="sn-pro-classic__content">
        <slot />
      </div>

      <footer v-if="slots.footer !== undefined" class="sn-pro-classic__footer">
        <slot name="footer" />
      </footer>
    </section>
  </div>
</template>

<style scoped>
/*
 * Style-specific surface hooks (AGENTS.md §112 additive pattern): any ancestor
 * can re-point them without touching this component. All values default to
 * `--sn-web-*` tokens, so dark mode follows the host automatically.
 */
.sn-pro-classic {
  --sn-pro-classic-sider-bg: var(--sn-web-color-background-elevated);
  --sn-pro-classic-sider-border-color: var(--sn-web-color-border-subtle);
  --sn-pro-classic-header-bg: var(--sn-web-color-background-elevated);
  /* Light full-bleed body: header sits on white, the title band + content
     share one light surface (the screenshot's 浅色通屏). */
  --sn-pro-classic-body-bg: var(--sn-web-color-background-surface);

  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  min-height: 0;
}

.sn-pro-classic--fixed {
  height: 100vh;
}

/* ── Sidebar ───────────────────────────────────────────────────────────── */
.sn-pro-classic__sider {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
  width: var(--sn-pro-classic-sider-width);
  overflow: hidden;
  border-right: 1px solid var(--sn-pro-classic-sider-border-color);
  background-color: var(--sn-pro-classic-sider-bg);
  transition: width 180ms ease;
}

.sn-pro-classic--collapsed .sn-pro-classic__sider {
  width: var(--sn-pro-classic-sider-collapsed-width);
}

.sn-pro-classic__brand {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
  height: 56px;
  padding: 0 16px;
  border-bottom: 1px solid var(--sn-pro-classic-sider-border-color);
}

.sn-pro-classic__nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.sn-pro-classic__foot {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: var(--sn-web-spacing-2);
  border-top: 1px solid var(--sn-pro-classic-sider-border-color);
}

/* ── Body ──────────────────────────────────────────────────────────────── */
.sn-pro-classic__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
  min-height: 0;
  background-color: var(--sn-pro-classic-body-bg);
}

.sn-pro-classic__header {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-4);
  flex-shrink: 0;
  box-sizing: border-box;
  height: 56px;
  padding: 0 var(--sn-web-spacing-6);
  border-bottom: 1px solid var(--sn-web-color-border-subtle);
  background-color: var(--sn-pro-classic-header-bg);
}

.sn-pro-classic__toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
}

.sn-pro-classic__toggle:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-pro-classic__crumb {
  flex: 1;
  min-width: 0;
  color: var(--sn-web-color-text-tertiary);
}

.sn-pro-classic__actions {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  flex-shrink: 0;
  margin-left: auto;
}

.sn-pro-classic__search {
  width: 220px;
}

.sn-pro-classic__title-band {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: var(--sn-web-spacing-6) var(--sn-web-spacing-6) 0;
}

.sn-pro-classic__heading {
  margin: 0;
  font-size: var(--sn-web-font-size-xl);
  font-weight: var(--sn-web-font-weight-semibold);
  color: var(--sn-web-color-text-primary);
}

.sn-pro-classic__content {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--sn-web-spacing-6);
}

.sn-pro-classic__footer {
  flex-shrink: 0;
  box-sizing: border-box;
  padding: var(--sn-web-spacing-4) var(--sn-web-spacing-6);
  border-top: 1px solid var(--sn-web-color-border-subtle);
}
</style>
