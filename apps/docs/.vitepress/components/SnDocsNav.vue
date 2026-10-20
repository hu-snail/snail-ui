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

import { computed } from 'vue'
import { useData, useRoute } from 'vitepress'
import { Moon, Search, Snail, Sun } from 'lucide-vue-next'
import { SnButton, SnConfigProvider, SnIcon, SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'
import SnDocsSidebarToggle from './SnDocsSidebarToggle.vue'
import { useSidebarCollapse } from '../utils/sidebar-collapse'

interface NavItem { text: string; link: string }

const props = withDefaults(
  defineProps<{
    /** Top-nav links (mirrors vitepress `themeConfig.nav`). */
    items?: NavItem[]
  }>(),
  {
    items: () => [],
  },
)

const route = useRoute()
const { isDark } = useData()

/** Sidebar state — the navbar hosts the expand control while collapsed. */
const { collapsed } = useSidebarCollapse()

/** Map nav items → SnMenu options. Active state is derived from useRoute(). */
const menuOptions = computed<SnMenuOption[]>(() =>
  (props.items ?? []).map((it) => ({
    key: it.link,
    label: it.text,
    href: it.link,
  })),
)

/** Active key = longest matching nav link prefix. */
const activeKey = computed<string | null>(() => {
  const path = route.path
  let best: string | null = null
  for (const it of props.items ?? []) {
    if (path === it.link || path.startsWith(`${it.link}/`) || path === `${it.link}.html`) {
      if (best === null || it.link.length > best.length) best = it.link
    }
  }
  return best
})

/** Toggle dark mode by inverting the reactive `isDark` ref from vitepress.
 * Vitepress handles persistence (localStorage) + `<html class="dark">` for us,
 * so we just flip the boolean. */
function toggleTheme(): void {
  isDark.value = !isDark.value
}

function openSearch(): void {
  // Trigger vitepress's built-in search modal via keyboard shortcut handler.
  const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, ctrlKey: true, bubbles: true })
  window.dispatchEvent(event)
}

/** Locale switch — the docs site ships a zh root locale plus an `/en/` locale. */
const isEn = computed<boolean>(() => route.path === '/en' || route.path.startsWith('/en/'))

/** Counterpart URL of the current page in the other locale. */
const localeSwitchHref = computed<string>(() => {
  const clean = route.path.replace(/\.html$/, '').replace(/\/+$/, '') || '/'
  const inEn = clean === '/en' || clean.startsWith('/en/')
  const bare = inEn ? clean.slice('/en'.length) || '/' : clean
  if (isEn.value) return bare === '/' ? '/' : bare
  return bare === '/' ? '/en/' : `/en${bare}`
})

/** Show the *target* locale — the usual switcher convention. */
const localeSwitchLabel = computed<string>(() => (isEn.value ? '中文' : 'EN'))
const localeSwitchAria = computed<string>(() => (isEn.value ? '切换到中文' : 'Switch to English'))
</script>

<template>
  <SnConfigProvider skin="">
    <div class="sn-docs-nav">
      <SnDocsSidebarToggle v-if="collapsed" />
      <a class="sn-docs-nav__brand" href="/" aria-label="Home">
        <SnIcon class="sn-docs-nav__brand-icon" :icon="Snail" />
        <span class="sn-docs-nav__brand-text">snail-aui</span>
      </a>
      <div class="sn-docs-nav__menu">
        <SnMenu
          mode="horizontal"
          :options="menuOptions"
          :value="activeKey"
          @update:value="() => {}"
        />
      </div>
      <div class="sn-docs-nav__actions">
        <SnButton class="sn-docs-nav__action sn-docs-nav__search" variant="ghost" size="small" aria-label="Search docs" @click="openSearch">
          <SnIcon class="sn-docs-nav__action-icon" :icon="Search" />
          <span class="sn-docs-nav__search-label">搜索文档</span>
          <span class="sn-docs-nav__kbd" aria-hidden="true">⌘K</span>
        </SnButton>
        <SnButton
          class="sn-docs-nav__action sn-docs-nav__locale"
          tag="a"
          variant="ghost"
          size="small"
          :href="localeSwitchHref"
          :aria-label="localeSwitchAria"
        >
          {{ localeSwitchLabel }}
        </SnButton>
        <SnButton class="sn-docs-nav__action" variant="ghost" size="small" aria-label="Toggle theme" @click="toggleTheme">
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
.sn-docs-nav__menu {
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
.sn-docs-nav__menu :deep(.sn-menu-item:hover:not(.sn-menu-item--disabled):not(.sn-menu-item--active)) {
  background: var(--sn-web-color-background-subtle);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-nav__menu :deep(.sn-menu-item--active) {
  background: transparent;
  color: var(--sn-web-color-text-primary);
  font-weight: 500;
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
</style>
