<script setup lang="ts">
/**
 * collapse-web-trigger — SnCollapse with trigger='hover' (mouseenter expands)
 * + displayDirective='show' (DOM stays mounted, toggle via display:none —
 * cheaper for content with expensive mount cost).
 */
import { ref } from 'vue'
import { SnCollapse, SnCollapseItem } from '@snui/vue-web'

const open = ref<Array<string | number>>(['1'])
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:24px;">
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">
        trigger="hover" — 鼠标移入自动展开
      </p>
      <SnCollapse v-model:expanded-names="open" trigger="hover" arrow-placement="right">
        <SnCollapseItem title="组件" name="1">真实组件，与 Sn* 一一对应。</SnCollapseItem>
        <SnCollapseItem title="Token" name="2">统一底层 @snui/tokens 输出 --aui-* 原始层。</SnCollapseItem>
        <SnCollapseItem title="Style Pack" name="3">跨端共用风格包系统。</SnCollapseItem>
      </SnCollapse>
    </div>
    <div>
      <p style="margin:0 0 8px;font-size:13px;color:var(--vp-c-text-2);">
        displayDirective="show" — DOM 常驻，仅 display 切换
      </p>
      <SnCollapse
        v-model:expanded-names="open"
        display-directive="show"
        bordered
      >
        <SnCollapseItem title="Heavy DOM" name="1">
          <div style="height:60px;background:linear-gradient(45deg,#f0f0ff,#fff0f0);border-radius:4px;"></div>
        </SnCollapseItem>
        <SnCollapseItem title="Heavy DOM 2" name="2">
          <div style="height:60px;background:linear-gradient(45deg,#fff0f0,#f0fff0);border-radius:4px;"></div>
        </SnCollapseItem>
      </SnCollapse>
    </div>
  </div>
</template>