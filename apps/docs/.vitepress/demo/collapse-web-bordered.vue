<script setup lang="ts">
/**
 * collapse-web-bordered — SnCollapse bordered variant (card-like outline
 * with shared lines between items). Mirrors n-collapse `bordered: true`.
 */
import { ref } from 'vue'
import { SnCollapse, SnCollapseItem } from '@snui/vue-web'

const open = ref<Array<string | number>>(['1'])
</script>

<template>
  <SnCollapse v-model:expanded-names="open" bordered>
    <SnCollapseItem title="概览" name="1">
      端云一组功能、组件清单、Token 用法。
    </SnCollapseItem>
    <SnCollapseItem title="架构" name="2">
      pnpm workspace + 双端别名包（@snui/vue-web / @snui/uni）。
    </SnCollapseItem>
    <SnCollapseItem title="FAQ" name="3">
      常见问题与故障排查。
    </SnCollapseItem>
  </SnCollapse>
</template>