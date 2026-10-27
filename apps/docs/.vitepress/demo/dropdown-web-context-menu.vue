<script setup lang="ts">
/** Demo: SnDropdown — contextMenu trigger (right-click at pointer). */
import { SnDropdown } from '@snui/vue-web';
import { ref } from 'vue';
const options = [
  { label: '打开', key: 'open' },
  { label: '重命名', key: 'rename' },
  { type: 'divider' as const, key: 'd1' },
  { label: '删除', key: 'delete' },
];
const lastKey = ref('');
</script>

<template>
  <div>
    <p style="margin: 0 0 12px; font-size: 13px; color: var(--sn-web-color-text-secondary, #666)">
      在下方文本上点击右键（select 关闭；再次右键重新定位）：
    </p>
    <SnDropdown trigger="contextMenu" :options="options" @select="(key) => (lastKey = String(key))">
      <p
        style="
          margin: 0;
          padding: 16px;
          border: 1px dashed var(--sn-web-color-border-subtle, #ddd);
          border-radius: 4px;
          line-height: 1.7;
          user-select: none;
        "
      >
        这是一段可以右键的文本。右键它，会在鼠标位置弹出操作菜单 ——
        常见于文件列表、卡片、消息气泡的上下文操作。
      </p>
    </SnDropdown>
    <p v-if="lastKey" style="margin: 12px 0 0; font-size: 13px">最近选择：{{ lastKey }}</p>
  </div>
</template>
