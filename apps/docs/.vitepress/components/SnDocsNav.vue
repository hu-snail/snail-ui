<script setup lang="ts">
/**
 * SnDocsNav — top navigation bar for the docs site, built from real
 * @snui/vue-web components (SnMenu + SnButton + SnConfigProvider).
 *
 * Visual intent: a quiet, neutral chrome band. Secondary-toned labels that
 * lift to the primary text tone on hover, transparent surfaces, a single
 * hairline rule, no fills / shadows / decorative separators. The sticky bar
 * shell behind this band owns the page-level background treatment; this
 * component owns a 56px content band with 24px side gutters.
 *
 * Replaces vitepress's default VPNav so the chrome follows Sn* skin/theme
 * switches. Vitepress chrome below this layer (sidebar / footer / outline /
 * scroll spy / page meta / routing) is preserved by wrapping this nav inside
 * `<DefaultTheme.Layout>` via the parent SnDocsLayout.vue — we only override
 * the slot content here.
 *
 * Active route detection uses vitepress's `useRoute()` to set SnMenu v-model.
 */

import { computed, markRaw, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useData, useRoute, useRouter } from 'vitepress';
import {
  Bot,
  ChartLine,
  ChevronDown,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Moon,
  Palette,
  Puzzle,
  Rocket,
  Snail,
  Smartphone,
  Sun,
} from 'lucide-vue-next';
import SnNavSearch from './SnNavSearch.vue';
import { SnButton, SnConfigProvider, SnIcon, SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';
import type { DocsNavItem } from '../config-nav';

type NavItem = DocsNavItem;

const props = withDefaults(
  defineProps<{
    /** Top-nav links (mirrors vitepress `themeConfig.nav`). */
    items?: NavItem[];
    /** 反色导航（首页深色画布专用）：菜单走 SnMenu `inverted`，
     *  品牌字 / 操作按钮 / kbd 提示改为浅色。 */
    inverted?: boolean;
  }>(),
  {
    items: () => [],
    inverted: false,
  },
);

const route = useRoute();
const router = useRouter();
const { isDark } = useData();


/**
 * 每个导航入口一个 lucide 图标（对照参考站点的导航）。
 *
 * 按 link 前缀匹配而不是文案 —— 中英两个 locale 的 `text` 不同，但 link
 * 结构一致（enNav 只是多了 `/en` 前缀，匹配前先剥掉）。
 */
const NAV_ICONS: ReadonlyArray<readonly [prefix: string, icon: unknown]> = [
  ['/guide', Rocket],
  ['/components/web', LayoutGrid],
  ['/components/uni', Smartphone],
  ['/style-packs', Layers],
  ['/theme', Palette],
  ['/ai', Bot],
  ['/ecosystem', Puzzle],
  ['/echarts', ChartLine],
  ['/templates', LayoutTemplate],
];

function navIcon(link: string): unknown {
  const bare = link.replace(/^\/en(?=\/|$)/, '');
  const hit = NAV_ICONS.find(([prefix]) => bare === prefix || bare.startsWith(`${prefix}/`));
  // markRaw：组件对象进 reactive options 会触发 Vue 的性能警告
  return hit ? markRaw(hit[1]) : undefined;
}

/** Map nav items → SnMenu options. Active state is derived from useRoute(). */
/** Map nav items → SnMenu options（icon 按 link 前缀匹配）。 */
function toMenuOptions(items: NavItem[]): SnMenuOption[] {
  return items.map((it) => ({
    key: it.link,
    label: it.text,
    href: it.link,
    icon: navIcon(it.link),
  }));
}

/** 带 children 的合并入口（如「生态」）在导航条上由自定义下拉渲染。 */
const dropdownItem = computed<NavItem | undefined>(() =>
  (props.items ?? []).find((it) => it.children && it.children.length > 0),
);
const dropdownIndex = computed(() =>
  dropdownItem.value ? (props.items ?? []).indexOf(dropdownItem.value) : -1,
);
const menuOptionsBefore = computed<SnMenuOption[]>(() =>
  toMenuOptions(
    (props.items ?? []).slice(0, dropdownIndex.value < 0 ? undefined : dropdownIndex.value),
  ),
);
const menuOptionsAfter = computed<SnMenuOption[]>(() =>
  toMenuOptions(dropdownIndex.value >= 0 ? (props.items ?? []).slice(dropdownIndex.value + 1) : []),
);
const ecoIcon = computed(() => (dropdownItem.value ? navIcon(dropdownItem.value.link) : undefined));

/**
 * Active key = 最长匹配前缀。合并入口（match 额外前缀）与其 children
 * 共用同一 active 判定；en 前缀在匹配前剥掉。
 */
const activeKey = computed<string | null>(() => {
  const bare = route.path.replace(/\.html$/, '').replace(/^\/en(?=\/|$)/, '') || '/';
  let best: { link: string; len: number } | null = null;
  for (const it of props.items ?? []) {
    const prefixes = [
      it.link.replace(/\.html$/, '').replace(/^\/en(?=\/|$)/, ''),
      ...(it.match ?? []),
    ];
    const matched = prefixes.some((p) => bare === p || bare.startsWith(`${p}/`));
    if (matched && (best === null || it.link.length > best.len)) {
      best = { link: it.link, len: it.link.length };
    }
  }
  return best ? best.link : null;
});

/** 二级菜单开合：点击展开，点击外部 / Esc 收起。 */
const ecoOpen = ref(false);
const ecoRoot = ref<HTMLElement | null>(null);
const ecoActive = computed(
  () => dropdownItem.value !== undefined && activeKey.value === dropdownItem.value.link,
);
function toggleEco(): void {
  ecoOpen.value = !ecoOpen.value;
}
function goNavItem(link: string): void {
  ecoOpen.value = false;
  void router.go(link);
}
function onDocClick(event: MouseEvent): void {
  if (ecoOpen.value && ecoRoot.value && !ecoRoot.value.contains(event.target as Node)) {
    ecoOpen.value = false;
  }
}
function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') ecoOpen.value = false;
}

 /** 导航悬浮：body.sn-nav-floating 驱动 §18 的胶囊岛 + 悬浮侧栏面板。
  *  文档页默认即悬浮（不再做滚动判断）；首页保持原行为——滚动超过
  *  8px 后才切到悬浮岛。 */
 const isHome = computed(
   () => route.path === '/' || route.path === '' || route.path === '/en' || route.path === '/en/',
 );
 const navFloating = ref(false);
 function syncFloating(): void {
   navFloating.value = isHome.value ? window.scrollY > 8 : true;
 }
 onMounted(() => {
   syncFloating();
   window.addEventListener('scroll', syncFloating, { passive: true });
   document.addEventListener('click', onDocClick);
   document.addEventListener('keydown', onKeydown);
 });
 onBeforeUnmount(() => {
   window.removeEventListener('scroll', syncFloating);
   document.removeEventListener('click', onDocClick);
   document.removeEventListener('keydown', onKeydown);
   document.body.classList.remove('sn-nav-floating');
 });
 watch(navFloating, (floating) => {
   document.body.classList.toggle('sn-nav-floating', floating);
 });
 /** 路由在首页 ↔ 文档页之间切换时重算——scroll 监听不会因路由变化触发。 */
 watch(isHome, () => syncFloating());
/** Toggle dark mode by inverting the reactive `isDark` ref from vitepress.
 * Vitepress handles persistence (localStorage) + `<html class="dark">` for us,
 * so we just flip the boolean. */
function toggleTheme(): void {
  isDark.value = !isDark.value;
}

/* openSearch 已由 SnNavSearch 组件内聚（派发 ⌘K 触发 VitePress 搜索）。 */

/** Locale switch — the docs site ships a zh root locale plus an `/en/` locale. */
const isEn = computed<boolean>(() => route.path === '/en' || route.path.startsWith('/en/'));

/** Counterpart URL of the current page in the other locale. */
const localeSwitchHref = computed<string>(() => {
  const clean = route.path.replace(/\.html$/, '').replace(/\/+$/, '') || '/';
  const inEn = clean === '/en' || clean.startsWith('/en/');
  const bare = inEn ? clean.slice('/en'.length) || '/' : clean;
  if (isEn.value) return bare === '/' ? '/' : bare;
  return bare === '/' ? '/en/' : `/en${bare}`;
});

/** Show the *target* locale — the usual switcher convention. */
const localeSwitchLabel = computed<string>(() => (isEn.value ? '中文' : 'EN'));
const localeSwitchAria = computed<string>(() => (isEn.value ? '切换到中文' : 'Switch to English'));

/**
 * Switch locale through VitePress's client router instead of letting the
 * browser follow the `href`.
 *
 * The anchor alone is not enough: VitePress intercepts same-origin `<a>`
 * clicks with a delegated window listener installed by `createRouter()`, i.e.
 * only once the app bundle has run and the page has hydrated. Until then a
 * click falls through to the browser's native navigation and reloads the whole
 * document — which is exactly what the locale switch must not do.
 *
 * `router.go()` performs the SPA transition (history.pushState + component
 * swap + scroll handling) regardless of hydration timing, so calling it here
 * and preventing the default keeps the switch a pure client-side route change.
 *
 * Modified clicks (⌘/Ctrl/Shift/Alt, non-primary button) are deliberately left
 * to the browser so "open in new tab" keeps working.
 */
function onLocaleClick(event: MouseEvent): void {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)
    return;
  // VitePress's delegated listener (capture phase on `window`) runs first once
  // the app has hydrated and already called `preventDefault()` + `router.go()`.
  // Skip in that case to avoid a second, redundant page-module fetch.
  if (event.defaultPrevented) return;
  event.preventDefault();
  void router.go(localeSwitchHref.value);
}
</script>

<template>
  <SnConfigProvider skin="">
    <div class="sn-docs-nav" :class="{ 'sn-docs-nav--inverted': inverted }">
      <a class="sn-docs-nav__brand" :href="isEn ? '/en/' : '/'" aria-label="Home">
        <SnIcon class="sn-docs-nav__brand-icon" :icon="Snail" />
        <span class="sn-docs-nav__brand-text">snail-aui</span>
      </a>
      <div class="sn-docs-nav__search-slot">
        <SnNavSearch />
      </div>
      <div class="sn-docs-nav__menu">
        <SnMenu
          mode="horizontal"
          :options="menuOptionsBefore"
          :value="activeKey"
          :inverted="inverted"
          @update:value="() => {}"
        />
        <div v-if="dropdownItem" ref="ecoRoot" class="sn-docs-nav__dd">
          <button
            type="button"
            class="sn-docs-nav__dd-trigger"
            :class="{
              'sn-docs-nav__dd-trigger--active': ecoActive,
              'sn-docs-nav__dd-trigger--open': ecoOpen,
            }"
            :aria-expanded="ecoOpen"
            aria-haspopup="menu"
            @click="toggleEco"
          >
            <SnIcon v-if="ecoIcon" class="sn-docs-nav__dd-icon" :icon="ecoIcon" :size="15" />
            {{ dropdownItem.text }}
            <SnIcon class="sn-docs-nav__dd-chevron" :icon="ChevronDown" :size="14" />
          </button>
          <Transition name="sn-dd">
            <div v-if="ecoOpen" class="sn-docs-nav__dd-panel" role="menu">
              <a
                v-for="child in dropdownItem.children"
                :key="child.link"
                role="menuitem"
                class="sn-docs-nav__dd-item"
                :href="child.link"
                @click.prevent="goNavItem(child.link)"
              >
                {{ child.text }}
              </a>
            </div>
          </Transition>
        </div>
        <SnMenu
          v-if="menuOptionsAfter.length > 0"
          mode="horizontal"
          :options="menuOptionsAfter"
          :value="activeKey"
          :inverted="inverted"
          @update:value="() => {}"
        />
      </div>
      <div class="sn-docs-nav__actions">
        <SnButton
          class="sn-docs-nav__action sn-docs-nav__locale"
          tag="a"
          variant="ghost"
          size="small"
          :href="localeSwitchHref"
          :aria-label="localeSwitchAria"
          @click="onLocaleClick"
        >
          {{ localeSwitchLabel }}
        </SnButton>
        <SnButton
          class="sn-docs-nav__action"
          variant="ghost"
          size="small"
          aria-label="Toggle theme"
          @click="toggleTheme"
        >
          <SnIcon class="sn-docs-nav__action-icon" :icon="isDark ? Sun : Moon" />
        </SnButton>
      </div>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
/* ─────────── Band ───────────
 * 56px content band. `align-self: stretch` lets the band reach the bottom
 * edge of the sticky bar shell so the hairline below lands on that edge
 * instead of floating above it (the shell is taller than the band). */
.sn-docs-nav {
  align-self: stretch;
  display: flex;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;
  width: 100%;
  min-height: 56px;
  padding: 0 24px;
  background: transparent;
  color: var(--sn-web-color-text-primary);
  /* `border-default` is the hairline tone that still reads as a line in both
   * light and dark; `border-subtle` is a wash, not an edge. */
  border-bottom: 1px solid var(--sn-web-color-border-default);
}

/* ─────────── Brand ─────────── */
.sn-docs-nav__brand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: var(--sn-web-color-text-primary);
  text-decoration: none;
  white-space: nowrap;
}
/* Only the mark carries the brand accent; the wordmark stays neutral so the
 * band reads as chrome rather than as a coloured banner. */
.sn-docs-nav__brand-icon {
  color: var(--sn-web-color-action-primary);
}

/* ─────────── Menu ───────────
 * SnMenu ships its own item chrome (filled active pill, larger type). The
 * overrides below re-dress its items as quiet text rows: no fill, tighter
 * type, wash-on-hover. */
.sn-docs-nav__search-slot {
  display: inline-flex;
  flex-shrink: 0;
}
.sn-docs-nav__menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
}
.sn-docs-nav__menu :deep(.sn-menu__list) {
  display: flex;
  align-items: center;
  gap: 2px;
}
.sn-docs-nav__menu :deep(.sn-menu-item) {
  display: inline-flex;
  align-items: center;
  height: 32px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 13.5px;
  font-weight: 400;
  line-height: 32px;
  color: var(--sn-web-color-text-secondary);
}
.sn-docs-nav__menu
  :deep(.sn-menu-item:hover:not(.sn-menu-item--disabled):not(.sn-menu-item--active)) {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
/* ─────────── 选中态 ───────────
 * 主题色浅底 + 主题色文字（对照参考站点的导航胶囊）。图标与文字一起
 * 走 brand 色；inverted（首页深色画布）下保持浅色文字、底色用白 10% 透明。 */
.sn-docs-nav__menu :deep(.sn-menu-item--active) {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.sn-docs-nav__menu :deep(.sn-menu-item--active .sn-menu-item__icon) {
  color: var(--vp-c-brand-1);
}
.sn-docs-nav--inverted .sn-docs-nav__menu :deep(.sn-menu-item--active) {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}
.sn-docs-nav--inverted .sn-docs-nav__menu :deep(.sn-menu-item--active .sn-menu-item__icon) {
  color: #ffffff;
}

/* ─────────── Actions ───────────
 * Icon-only ghost buttons: 32×32, 6px radius, wash-on-hover. */
.sn-docs-nav__actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  white-space: nowrap;
}
.sn-docs-nav__actions :deep(.sn-button) {
  height: 32px;
  min-width: 32px;
  padding: 0 6px;
  gap: 6px;
  border-radius: 6px;
  border-color: transparent;
  background: transparent;
  color: var(--sn-web-color-text-secondary);
  font-size: 13px;
}
.sn-docs-nav__actions :deep(.sn-button:hover:not(.sn-button--disabled):not(.sn-button--loading)) {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-nav__actions :deep(.sn-button__content) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
/* Icon boxes are driven by the shared icon size token; the inner svg follows
 * the box so a token override stays consistent. */
.sn-docs-nav__brand-icon,
.sn-docs-nav__action-icon {
  width: var(--sn-web-icon-size-medium);
  height: var(--sn-web-icon-size-medium);
}
.sn-docs-nav__brand-icon :deep(svg),
.sn-docs-nav__action-icon :deep(svg) {
  width: 100%;
  height: 100%;
}
/* The search affordance carries a label, so it is wider than a square icon
 * button but keeps the same 32px height / 6px radius. */
.sn-docs-nav__actions :deep(.sn-docs-nav__search) {
  padding: 0 8px;
}
.sn-docs-nav__search-label {
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-docs-nav__kbd {
  font-family: inherit;
  font-size: 11px;
  line-height: 1;
  padding: 3px 5px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 4px;
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-tertiary);
}

/* ─────────── Narrow viewports ───────────
 * Below 960px SnMenu overflows the band, so collapse it to the icon-only
 * search + theme toggle. Vitepress's built-in `VPNavBarHamburger` becomes
 * visible at ≤768px and re-exposes the nav items via the default mobile
 * screen drawer (themeConfig.nav). */
@media (max-width: 960px) {
  .sn-docs-nav__menu {
    display: none;
  }
  .sn-docs-nav__search-label,
  .sn-docs-nav__kbd {
    display: none;
  }
}
@media (max-width: 767px) {
  .sn-docs-nav {
    gap: 12px;
    padding: 0 16px;
  }
}

/* ─────────── Inverted (home landing canvas) ───────────
 * 首页是固定的深色画布（见 SnDocsHome），导航必须融入背景：
 * 菜单用 SnMenu 自带的 inverted（浅色文字），品牌字 / 操作按钮 / kbd
 * 提示在此覆盖为浅色；菜单自带的深底色改为透明，让画布透出来。 */
.sn-docs-nav--inverted :deep(.sn-menu--inverted) {
  background: transparent;
}
.sn-docs-nav--inverted .sn-docs-nav__brand-text {
  color: #f2f5fb;
}
.sn-docs-nav--inverted :deep(.sn-docs-nav__actions .sn-button) {
  color: rgba(240, 244, 252, 0.86);
  background: transparent;
  border-color: transparent;
}
.sn-docs-nav--inverted
  :deep(.sn-docs-nav__actions .sn-button:hover:not(.sn-button--disabled):not(.sn-button--loading)) {
  color: #ffffff;
  background: rgb(255 255 255 / 0.1);
  border-color: transparent;
}
.sn-docs-nav--inverted .sn-docs-nav__kbd {
  border-color: rgb(255 255 255 / 0.24);
  background: rgb(255 255 255 / 0.08);
  color: rgb(240 244 252 / 0.62);
}
/* ─────────── 二级菜单（生态：点击展开） ───────────
 * 触发器与 SnMenu 横向项同规格；面板为玻璃卡片，浅深色均由主题变量驱动。 */
.sn-docs-nav__dd {
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
}
.sn-docs-nav__dd-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 13.5px;
  font-weight: 400;
  line-height: 32px;
  color: var(--sn-web-color-text-secondary);
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
}
.sn-docs-nav__dd-trigger:hover,
.sn-docs-nav__dd-trigger--open {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-nav__dd-trigger--active {
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-weight: 600;
}
.sn-docs-nav--inverted .sn-docs-nav__dd-trigger--active {
  background: rgba(255, 255, 255, 0.14);
  color: #ffffff;
}
.sn-docs-nav__dd-chevron {
  transition: transform 0.2s ease;
}
.sn-docs-nav__dd-trigger--open .sn-docs-nav__dd-chevron {
  transform: rotate(180deg);
}
.sn-docs-nav__dd-panel {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 176px;
  padding: 6px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 12px;
  background: color-mix(in srgb, var(--vp-c-bg) 92%, transparent);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow:
    0 12px 32px -8px rgb(15 23 42 / 0.14),
    0 2px 8px -2px rgb(15 23 42 / 0.06);
}
.sn-docs-nav__dd-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  color: var(--sn-web-color-text-secondary);
  text-decoration: none;
  white-space: nowrap;
  transition:
    background 0.14s,
    color 0.14s;
}
.sn-docs-nav__dd-item:hover {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-nav--inverted .sn-docs-nav__dd-panel {
  border-color: rgba(255, 255, 255, 0.12);
  background: color-mix(in srgb, #0f172a 88%, transparent);
}
.sn-docs-nav--inverted .sn-docs-nav__dd-item {
  color: rgba(255, 255, 255, 0.8);
}
.sn-docs-nav--inverted .sn-docs-nav__dd-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}
.sn-dd-enter-active,
.sn-dd-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}
.sn-dd-enter-from,
.sn-dd-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-6px);
}

/* 悬浮态下，band 的发丝线交给胶囊边框接管 */
:global(body.sn-nav-floating) .sn-docs-nav {
  border-bottom-color: transparent;
}
</style>
