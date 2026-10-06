<script setup lang="ts">
/**
 * menu-web-basic — SnMenu horizontal mode + selected state (v-model:value)
 */
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'

const items: SnMenuOption[] = [
  { key: '/guide', label: '指南', href: '/guide/web/intro' },
  { key: '/components/web', label: '组件 · Web', href: '/components/web/button' },
  { key: '/components/uni', label: '组件 · uni-app', href: '/components/uni/button' },
  { key: '/style-packs', label: '风格包', href: '/style-packs/overview' },
  { key: '/theme', label: '主题', href: '/theme/overview' },
]

const active = ref<string | null>('/guide')
</script>

<template>
  <SnMenu mode="horizontal" :options="items" v-model:value="active" />
</template>