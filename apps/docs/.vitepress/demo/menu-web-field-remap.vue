<script setup lang="ts">
/**
 * menu-web-field-remap — SnMenu with API-shaped tree remap
 * (label-field / key-field / children-field). Useful when consumer data
 * uses different naming than the SnMenuOption default (key/label/children).
 */
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'

/* This shape mirrors a typical REST API response. */
interface ApiNavNode {
  uid: number | string
  title: string
  link?: string
  items?: ApiNavNode[]
}

const apiTree: ApiNavNode[] = [
  { uid: 'guide', title: 'Guide', link: '/guide' },
  {
    uid: 'components',
    title: 'Components',
    items: [
      { uid: 'web', title: 'Web', link: '/components/web' },
      { uid: 'uni', title: 'uni-app', link: '/components/uni' },
    ],
  },
  { uid: 'styles', title: 'Style Packs', link: '/style-packs' },
]

const active = ref<string | number | null>('web')
</script>

<template>
  <SnMenu
    mode="vertical"
    :options="(apiTree as unknown as SnMenuOption[])"
    :key-field="'uid'"
    :label-field="'title'"
    :children-field="'items'"
    :default-expanded-keys="['components']"
    v-model:value="active"
  />
</template>