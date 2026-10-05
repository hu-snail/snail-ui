<script setup lang="ts">
/**
 * SnDocsNav — top navigation bar for the docs site, built from real
 * @snui/vue-web components (SnMenu + SnButton + SnDivider + SnConfigProvider).
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
import { SnButton, SnConfigProvider, SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'

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
</script>

<template>
  <SnConfigProvider skin="">
    <div class="sn-docs-nav">
      <a class="sn-docs-nav__brand" href="/" aria-label="Home">
        <span class="sn-docs-nav__brand-mark">snail-aui</span>
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
        <SnButton variant="ghost" size="small" aria-label="Search docs" @click="openSearch">
          <span class="sn-docs-nav__search-glyph" aria-hidden="true">⌕</span>
          <span class="sn-docs-nav__search-label">搜索文档</span>
          <span class="sn-docs-nav__kbd" aria-hidden="true">⌘K</span>
        </SnButton>
        <SnButton variant="ghost" size="small" aria-label="Toggle theme" @click="toggleTheme">
          <span aria-hidden="true">◐</span>
        </SnButton>
      </div>
    </div>
  </SnConfigProvider>
</template>

<style scoped>
.sn-docs-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 12px 32px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-primary);
  border-bottom: 1px solid var(--sn-web-color-border-default);
}
@media (max-width: 767px) {
  .sn-docs-nav {
    padding: 10px 16px;
  }
}

/* Tablet (≤960px) and phone: SnMenu overflows the narrow container,
 * so collapse it to icon-only search + theme toggle. Vitepress's built-in
 * `VPNavBarHamburger` becomes visible at ≤768px and re-exposes the nav
 * items via the default mobile screen drawer (themeConfig.nav). */
@media (max-width: 960px) {
  .sn-docs-nav__menu {
    display: none;
  }
  .sn-docs-nav__search-label,
  .sn-docs-nav__kbd {
    display: none;
  }
}
.sn-docs-nav__brand {
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
  color: var(--sn-web-color-action-primary);
  margin-right: 12px;
  white-space: nowrap;
}
.sn-docs-nav__brand-mark {
  font-family: inherit;
}
.sn-docs-nav__menu {
  flex: 1 1 auto;
  min-width: 0;
}
.sn-docs-nav__actions {
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}
.sn-docs-nav__search-glyph {
  font-size: 14px;
  margin-right: 4px;
}
.sn-docs-nav__search-label {
  font-size: 13px;
}
.sn-docs-nav__kbd {
  font-size: 11px;
  font-family: monospace;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 3px;
  padding: 0 4px;
  margin-left: 6px;
  background: rgba(0, 0, 0, 0.03);
}

/* Doodle skin */
.snui-skin-doodle .sn-docs-nav {
  border-bottom: 2.5px solid #1a1a1a;
}
.snui-skin-doodle .sn-docs-nav__brand {
  color: #1a1a1a;
  font-family: 'Comic Sans MS', 'Marker Felt', sans-serif;
}
.snui-skin-doodle .sn-docs-nav__kbd {
  border: 2px solid #1a1a1a;
  background: #fff;
}
</style>