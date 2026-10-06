<script setup lang="ts">
/**
 * menu-web-inverted — SnMenu inverted variant for dark backdrop navbars
 * (mirrors n-menu `inverted: true`). Colors flip for high-contrast over
 * dark surfaces — used by the docs chrome's SnDocsNav when a colored /
 * dark style pack is active.
 */
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'

const items: SnMenuOption[] = [
  { key: 'guide', label: '指南', href: '/guide' },
  { key: 'components/web', label: '组件 · Web', href: '/components/web' },
  { key: 'components/uni', label: '组件 · uni', href: '/components/uni' },
  { key: 'styles', label: '风格包', href: '/style-packs' },
]

const active = ref<string | null>('components/web')
</script>

<template>
  <div class="dark-nav">
    <SnMenu mode="horizontal" :options="items" v-model:value="active" inverted />
  </div>
</template>

<style scoped>
.dark-nav {
  background: linear-gradient(135deg, #1677ff, #722ed1);
  padding: 12px 24px;
  border-radius: 8px;
}
</style>