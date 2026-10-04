<script setup lang="ts">
/**
 * Demo: SnIcon (web-end) — registry pattern.
 *
 * Register a small icon pack once via `registerSnIcons({...})`, then
 * reference icons by string `name` anywhere in the app. Useful for
 * data-driven menus / route configs that ship icon names as strings.
 *
 * The bundler still statically analyzes the named `import { ... }`
 * line below and only those four icons end up in the production
 * chunk — even though the registry is keyed by string.
 */
import { Bell, ChevronRight, Search, User } from 'lucide-vue-next'
import SnIcon from '@snui/vue-web-src/icon/SnIcon.vue'
// `registerSnIcons` lives in a separate module because Vue SFCs don't
// expose non-default named exports from `<script setup>` blocks. The
// runtime module-level registry is shared across all SnIcon consumers.
import { registerSnIcons } from '@snui/vue-web-src/icon/sn-icon-registry'

registerSnIcons({ Bell, ChevronRight, Search, User })
</script>

<template>
  <div class="sn-demo">
    <SnIcon name="Bell" :size="24" />
    <SnIcon name="ChevronRight" :size="24" />
    <SnIcon name="Search" :size="24" />
    <SnIcon name="User" :size="24" />
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  font-size: 24px;
}
</style>