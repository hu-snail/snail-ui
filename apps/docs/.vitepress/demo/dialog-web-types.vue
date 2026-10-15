<script setup lang="ts">
/**
 * dialog-web-types — the five semantic types plus the two icon placements.
 */
import { SnDialog } from '@snui/vue-web'

const types = ['default', 'info', 'success', 'warning', 'error'] as const
</script>

<template>
  <div class="dlg-types">
    <div v-for="type in types" :key="type" class="dlg-types__cell">
      <SnDialog
        :type="type"
        :title="type"
        content="每种 type 都有自己的图标与图标配色。"
        positive-text="确定"
        negative-text="取消"
      />
    </div>

    <div class="dlg-types__cell dlg-types__cell--top">
      <SnDialog
        type="success"
        icon-placement="top"
        title="上传完成"
        content="iconPlacement=&quot;top&quot; 把图标抬到标题上方并居中。"
        positive-text="知道了"
        :closable="false"
      />
    </div>
  </div>
</template>

<style scoped>
.dlg-types {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
}
.dlg-types__cell {
  flex: 1 1 260px;
  min-width: 260px;
  padding: 20px;
  border-radius: 8px;
  background: var(--sn-web-color-background-subtle);
}
.dlg-types__cell--top {
  flex-basis: 100%;
}
</style>
