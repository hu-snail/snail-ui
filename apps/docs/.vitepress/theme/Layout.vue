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

import { computed } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import DemoLabFab from '../components/DemoLabFab.vue'
import SnDocsNav from '../components/SnDocsNav.vue'
import SnDocsFooter from '../components/SnDocsFooter.vue'
import SnDocsHome from '../components/SnDocsHome.vue'
import SnDocsSidebarToggle from '../components/SnDocsSidebarToggle.vue'
import SnDocsCopyDoc from '../components/SnDocsCopyDoc.vue'
import { enNav, nav } from '../config-nav'

const route = useRoute()
const isHome = computed(() => route.path === '/' || route.path === '')
const showFab = computed(() => route.path.startsWith('/components/'))

/** The `/en/` locale mirrors the root locale; swap the nav list with it. */
const isEn = computed(() => route.path === '/en' || route.path.startsWith('/en/'))
const navItems = computed(() => (isEn.value ? enNav : nav))
</script>

<template>
  <DefaultTheme.Layout>
    <!-- Replace the default top nav with SnDocsNav (real @snui/vue-web). -->
    <template #nav-bar-content-before>
      <SnDocsNav :items="navItems" />
    </template>

    <!-- Top of the left nav: the sidebar collapse control. It lives inside
         VPSidebar (via `sidebar-nav-before`), so it disappears together with
         the sidebar; SnDocsNav renders the matching expand control. -->
    <template #sidebar-nav-before>
      <div class="sn-docs-sidebar-head">
        <SnDocsSidebarToggle />
      </div>
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

    <!-- Top of the article: copy this page's markdown source. -->
    <template #doc-before>
      <SnDocsCopyDoc />
    </template>

    <!-- doc-after still hosts the FAB (existing Phase-2 contract). -->
    <template #doc-after>
      <ClientOnly>
        <DemoLabFab v-if="showFab" />
      </ClientOnly>
    </template>
  </DefaultTheme.Layout>
</template>