<script setup lang="ts">
/** Demo: SnDropdown — click trigger. */
import { SnButton, SnDropdown } from '@snui/vue-web'
const options = [
  { label: '个人资料', key: 'profile' },
  { label: '偏好设置', key: 'settings' },
  { type: 'divider' as const, key: 'd1' },
  { label: '退出登录', key: 'logout' },
]
</script>

<template>
  <SnDropdown trigger="click" :options="options" @select="(key) => console.log(key)">
    <SnButton>打开菜单 ▾</SnButton>
  </SnDropdown>
</template>
