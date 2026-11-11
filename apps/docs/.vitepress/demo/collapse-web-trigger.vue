<script setup lang="ts">
/**
 * collapse-web-trigger — SnCollapse with trigger='hover' (mouseenter expands).
 */
import { ref } from 'vue';
import { SnCollapse, SnCollapseItem } from '@snui/vue-web';

const open = ref<Array<string | number>>(['1']);
</script>

<template>
  <!-- The centered flex demo stage shrink-to-fits its children; pin the wrapper
       so the collapse group keeps a stable, parent-driven width. -->
  <div style="display: flex; flex-direction: column; gap: 24px; width: 100%; min-width: 0">
    <div>
      <p style="margin: 0 0 8px; font-size: 13px; color: var(--vp-c-text-2)">
        trigger="hover" — 鼠标移入自动展开
      </p>
      <SnCollapse v-model:expanded-names="open" trigger="hover" arrow-placement="right">
        <SnCollapseItem title="组件" name="1">真实组件，与 Sn* 一一对应。</SnCollapseItem>
        <SnCollapseItem title="Token" name="2"
          >统一底层 @snui/tokens 输出 --aui-* 原始层。</SnCollapseItem
        >
        <SnCollapseItem title="Style Pack" name="3">跨端共用风格包系统。</SnCollapseItem>
      </SnCollapse>
    </div>
  </div>
</template>
