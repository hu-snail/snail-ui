<script setup lang="ts">
/**
 * menu-web-horizontal — SnMenu horizontal 模式（顶导航风格）
 */
import { ref } from 'vue';
import { SnMenu } from '@snui/vue-web';
import type { SnMenuOption } from '@snui/vue-web';

const items: SnMenuOption[] = [
  { key: '/guide', label: 'Guide', href: '/guide/web/intro' },
  { key: '/components/web', label: 'Components · Web', href: '/components/web/button' },
  { key: '/components/uni', label: 'Components · uni-app', href: '/components/uni/button' },
  { key: '/style-packs', label: 'Style Packs', href: '/style-packs/overview' },
  { key: '/theme', label: 'Theme', href: '/theme/overview' },
];

const active = ref<string | null>('/components/web');
</script>

<template>
  <SnMenu mode="horizontal" :options="items" v-model:value="active" />
</template>
