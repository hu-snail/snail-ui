<script setup lang="ts">
/**
 * collapse-web-accordion — 手风琴（一次只一个展开）+ arrowPlacement='right'
 */
import { ref } from 'vue'
import { SnCollapse, SnCollapseItem } from '@snui/vue-web'

const open = ref<Array<string | number>>(['1'])
</script>

<template>
  <SnCollapse
    v-model:expanded-names="open"
    :accordion="true"
    arrow-placement="right"
  >
    <SnCollapseItem title="Step 1 · 引入" name="1">
      <code>pnpm add @snui/vue-web @snui/tokens-web</code>
    </SnCollapseItem>
    <SnCollapseItem title="Step 2 · 导入样式" name="2">
      <code>import '@snui/tokens-web/styles'</code>
    </SnCollapseItem>
    <SnCollapseItem title="Step 3 · 渲染组件" name="3">
      <code>&lt;SnButton variant="primary"&gt;点我&lt;/SnButton&gt;</code>
    </SnCollapseItem>
  </SnCollapse>
</template>