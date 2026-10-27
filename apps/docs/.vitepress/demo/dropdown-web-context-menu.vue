<script setup lang="ts">
/** Demo: SnDropdown — contextMenu trigger + option icons. */
import { SnDropdown } from '@snui/vue-web';
import { FolderOpen, PenLine, Trash2 } from 'lucide-vue-next';
import { ref } from 'vue';
const options = [
  { label: '打开', key: 'open', icon: FolderOpen },
  { label: '重命名', key: 'rename', icon: PenLine },
  { type: 'divider' as const, key: 'd1' },
  { label: '删除', key: 'delete', icon: Trash2 },
];
const lastKey = ref('');
</script>

<template>
  <div>
    <p style="margin: 0 0 12px; font-size: 13px; color: var(--sn-web-color-text-secondary, #666)">
      在下方文本上点击右键（options[].icon 支持任意 Vue 图标组件）：
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
