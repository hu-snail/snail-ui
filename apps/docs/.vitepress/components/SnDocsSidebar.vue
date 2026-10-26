<script setup lang="ts">
/**
 * SnDocsSidebar — sidebar chrome, built from real @snui/vue-web components
 * (SnCollapse + SnCard). Replaces vitepress's default VPSidebar.
 *
 * Renders the locale's sidebar items as collapsible groups. Each top-level
 * sidebar group (e.g. "Basic", "Form") becomes a SnCollapseItem, with
 * leaf items rendered as styled <a> tags inside.
 *
 * Path resolution mirrors vitepress's sidebar matching: longest prefix wins.
 */

import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { SnCard, SnCollapse, SnCollapseItem } from '@snui/vue-web'

interface SidebarItem { text: string; link?: string; items?: SidebarItem[] }
interface SidebarGroup { text: string; items: SidebarItem[] }
interface SidebarLocale { [prefix: string]: SidebarGroup[] }

const props = withDefaults(
  defineProps<{
    /** Vitepress `themeConfig.sidebar` object keyed by path prefix. */
    groups?: SidebarLocale
  }>(),
  {
    groups: () => ({} as SidebarLocale),
  },
)

const route = useRoute()

/** Pick the longest matching sidebar prefix for the current path. */
const matchedGroups = computed<SidebarGroup[]>(() => {
  const path = route.path
  const prefixes = Object.keys(props.groups ?? {}).sort((a, b) => b.length - a.length)
  for (const p of prefixes) {
    const normalized = p.replace(/\/$/, '')
    if (path === p || path.startsWith(p) || path === normalized || path.startsWith(`${normalized}/`)) {
      return props.groups[p] ?? []
    }
  }
  return []
})

/** Default-expand every group on first render for ease of navigation. */
const defaultExpanded = computed<string[]>(() =>
  matchedGroups.value.map((_, gi) => `g-${gi}`),
)

/** Active leaf matching the current route (longest prefix wins). */
function isActive(link: string | undefined): boolean {
  if (!link) return false
  const path = route.path
  return path === link || path === `${link}.html` || path.startsWith(`${link}/`)
}
</script>

<template>
  <aside class="sn-docs-sidebar" aria-label="Documentation sidebar">
    <SnCard variant="outlined" :padding="'sm'" class="sn-docs-sidebar__card">
      <SnCollapse
        :default-expanded-names="defaultExpanded"
        arrow-placement="right"
      >
        <SnCollapseItem
          v-for="(group, gi) in matchedGroups"
          :key="`gr-${gi}`"
          :name="`g-${gi}`"
          :title="group.text"
        >
          <ul class="sn-docs-sidebar__list">
            <li
              v-for="(it, idx) in group.items ?? []"
              :key="`li-${gi}-${idx}`"
              class="sn-docs-sidebar__item"
              :class="{ 'sn-docs-sidebar__item--active': isActive(it.link) }"
            >
              <a
                v-if="it.link"
                :href="it.link"
                :aria-current="isActive(it.link) ? 'page' : undefined"
              >{{ it.text }}</a>
              <span v-else>{{ it.text }}</span>
            </li>
          </ul>
        </SnCollapseItem>
      </SnCollapse>
    </SnCard>
  </aside>
</template>

<style scoped>
.sn-docs-sidebar {
  padding: 12px;
  background: var(--sn-web-color-background-surface);
  color: var(--sn-web-color-text-primary);
  min-width: 240px;
  max-width: 280px;
  border-right: 1px solid var(--sn-web-color-border-default);
}
.sn-docs-sidebar__card {
  border-color: transparent;
  background: transparent;
}
.sn-docs-sidebar__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sn-docs-sidebar__item a {
  display: block;
  padding: 6px 10px;
  border-radius: 4px;
  color: var(--sn-web-color-text-secondary);
  text-decoration: none;
  font-size: 13px;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.sn-docs-sidebar__item a:hover {
  background: rgba(0, 0, 0, 0.04);
  color: var(--sn-web-color-text-primary);
}
.sn-docs-sidebar__item--active a {
  background: var(--sn-web-color-action-primary);
  color: var(--sn-web-color-text-on-primary, #fff);
  font-weight: 500;
}

/* Doodle skin */
.snui-skin-doodle .sn-docs-sidebar {
  border-right-width: 2.5px;
  border-right-color: #1a1a1a;
}
.snui-skin-doodle .sn-docs-sidebar__item--active a {
  border: 2px solid #1a1a1a;
}
</style>