<script setup lang="ts">
/**
 * Custom VitePress Layout — extends the default Layout and injects the
 * DemoLabFab into the doc-after slot so the FAB appears on every page but
 * only mounts itself when the route is under `/components/**` (route check
 * lives inside DemoLabFab).
 *
 * Per AUI-DOCS-018, the FAB is the cross-page "Demo Lab" entry — Style
 * switcher + Theme snippet + Demo preview all in one bottom-right popover.
 *
 * Per AUI-DOCS-019, CommandPalette is mounted globally via Teleport — Cmd/Ctrl+K
 * opens a fuzzy-search popover for jumping to components & demos.
 *
 * We also inject a NavSearchTrigger into the navbar's `nav-bar-content-after`
 * slot so users see a clear, always-visible "搜索组件 ⌘ K" button next to
 * the locale switcher — clicking it opens CommandPalette. This sits on top
 * of (and is more obvious than) VitePress's default DocSearch-Button, whose
 * built-in click handler is also intercepted in CommandPalette's capture-
 * phase listener.
 *
 * Wrapped in <ClientOnly> because DemoLabFab uses Teleport → document.body,
 * which only makes sense client-side (SSR would otherwise fail on
 * `document.body.appendChild`).
 */

import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import DemoLabFab from '../components/DemoLabFab.vue'
import CommandPalette from '../components/CommandPalette.vue'
import NavSearchTrigger from '../components/NavSearchTrigger.vue'

const route = useRoute()
const showFab = computed(() => route.path.startsWith('/components/'))
</script>

<template>
  <DefaultTheme.Layout>
    <template #nav-bar-content-after>
      <ClientOnly>
        <NavSearchTrigger />
      </ClientOnly>
    </template>

    <template #doc-after>
      <ClientOnly>
        <DemoLabFab v-if="showFab" />
        <CommandPalette />
      </ClientOnly>
    </template>
  </DefaultTheme.Layout>
</template>
