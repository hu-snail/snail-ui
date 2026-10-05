<script setup lang="ts">
/**
 * menu-web-vertical — SnMenu vertical 模式（侧边栏风格）+ accordion
 */
import { ref } from 'vue'
import { SnMenu } from '@snui/vue-web'
import type { SnMenuOption } from '@snui/vue-web'

const items: SnMenuOption[] = [
  {
    key: 'basic', label: 'Basic 基础组件',
    children: [
      { key: 'button', label: 'Button 按钮', href: '/components/web/button' },
      { key: 'divider', label: 'Divider 分割线', href: '/components/web/divider' },
      { key: 'icon', label: 'Icon 图标', href: '/components/web/icon' },
    ],
  },
  {
    key: 'form', label: 'Form 表单组件',
    children: [
      { key: 'input', label: 'Input 输入框', href: '/components/web/input' },
      { key: 'form', label: 'Form 表单', href: '/components/web/form' },
    ],
  },
  {
    key: 'layout', label: 'Layout 布局组件',
    children: [
      { key: 'card', label: 'Card 卡片', href: '/components/web/card' },
    ],
  },
]

const active = ref<string | null>('button')
const expanded = ref<Array<string | number>>(['basic'])
</script>

<template>
  <div style="max-width:280px;">
    <SnMenu
      mode="vertical"
      :options="items"
      v-model:value="active"
      v-model:expanded-keys="expanded"
      :accordion="true"
    />
  </div>
</template>