<script setup lang="ts">
/** Demo: SnCode — inline rendering inside a sentence. */
import { SnCode } from '@snui/vue-web'
</script>

<template>
  <div class="sn-demo sn-code-demo">
    <p>
      配置项 <SnCode code='{"mode": "strict"}' language="json" inline /> 表示开启严格模式。
    </p>
    <p>
      命令 <SnCode code="pnpm snui lint" inline /> 会检查全部组件目录。
    </p>
  </div>
</template>

<style scoped>
.sn-code-demo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: var(--sn-web-color-text-primary);
}
</style>
