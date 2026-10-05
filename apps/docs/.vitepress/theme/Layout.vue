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
 * Wrapped in <ClientOnly> because DemoLabFab uses Teleport → document.body,
 * which only makes sense client-side (SSR would otherwise fail on
 * `document.body.appendChild`).
 */

import DefaultTheme from 'vitepress/theme'
import { useRoute } from 'vitepress'
import { computed } from 'vue'
import DemoLabFab from '../components/DemoLabFab.vue'

const route = useRoute()
const showFab = computed(() => route.path.startsWith('/components/'))
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <ClientOnly>
        <DemoLabFab v-if="showFab" />
      </ClientOnly>
    </template>
  </DefaultTheme.Layout>
</template>
