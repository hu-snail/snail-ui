<script setup lang="ts">
/**
 * menu-web-icons — SnMenu with options.icon (component slot per item)
 *
 * Per AGENTS.md §113, UI icons come from the SnIcon registry / lucide-vue-next;
 * never an emoji glyph.
 */
import { ref } from 'vue'
import { markRaw } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'
import { Book, Component as IComp, Palette, Sun } from 'lucide-vue-next'

const items: SnMenuOption[] = [
  { key: 'guide', label: '指南', href: '/guide', icon: markRaw(Book) },
  { key: 'components', label: '组件', href: '/components/web', icon: markRaw(IComp) },
  { key: 'styles', label: '风格包', href: '/style-packs/overview', icon: markRaw(Palette) },
  { key: 'theme', label: '主题', href: '/theme/overview', icon: markRaw(Sun) },
]

const active = ref<string | null>('guide')
</script>

<template>
  <SnMenu mode="horizontal" :options="items" v-model:value="active" />
</template>