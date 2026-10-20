/**
 * Sidebar-collapse state for the docs chrome.
 *
 * The left sidebar is vitepress's own `VPSidebar`, driven by `themeConfig.
 * sidebar`. We add a toggle that hides it and lets the article reclaim the
 * freed width:
 *
 *   - the "collapse" control renders inside the sidebar
 *     (`sidebar-nav-before`, wired in theme/Layout.vue)
 *   - the "expand" control renders in the navbar, but only while collapsed,
 *     so the sidebar can always be brought back
 *
 * Both placements read this module-level ref, so they can never disagree.
 * The value is mirrored onto `<html class="sn-sidebar-collapsed">` for
 * custom.css to drive the layout, and persisted in localStorage so the
 * preference survives navigation and reloads.
 */

import { onMounted, ref, watch, type Ref } from 'vue'

const STORAGE_KEY = 'sn-docs-sidebar-collapsed'
const HTML_CLASS = 'sn-sidebar-collapsed'

const collapsed = ref(false)

function applyToHtml(value: boolean): void {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle(HTML_CLASS, value)
}

/** Keep `<html>`, localStorage and the shared ref in sync. */
watch(collapsed, (value) => {
  applyToHtml(value)
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The toggle
    // still works for the current session, so this is intentionally silent.
  }
})

export interface SidebarCollapse {
  collapsed: Ref<boolean>
  toggle: () => void
}

export function useSidebarCollapse(): SidebarCollapse {
  onMounted(() => {
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      stored = null
    }
    // Restore after mount (never during SSR) and re-assert the html class,
    // which vitepress may have replaced on a full page load.
    collapsed.value = stored === '1'
    applyToHtml(collapsed.value)
  })

  return {
    collapsed,
    toggle: () => {
      collapsed.value = !collapsed.value
    },
  }
}
