<script setup lang="ts">
/**
 * alert-web-title-bordered — contrasts the default bordered look with
 * `bordered="false"` (bare fill, no outline).
 */
import { SnAlert } from '@snui/vue-web';
</script>

<template>
  <div class="alert-demo">
    <p class="alert-demo__label">bordered（默认 true）</p>
    <SnAlert type="info" title="带边框"> 默认绘制 1px 描边，描边颜色由 type 派生。 </SnAlert>

    <p class="alert-demo__label">:bordered="false"</p>
    <SnAlert type="info" title="无边框" :bordered="false">
      去掉外边框，只保留底色与前置图标。
    </SnAlert>

    <p class="alert-demo__label">无 title（仅正文）</p>
    <SnAlert type="warning">只有正文内容时，标题行不渲染。</SnAlert>
  </div>
</template>

<style scoped>
.alert-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.alert-demo__label {
  margin: 8px 0 0;
  font-size: 12px;
  color: var(--vp-c-text-2);
  font-family: ui-monospace, monospace;
}
</style>
