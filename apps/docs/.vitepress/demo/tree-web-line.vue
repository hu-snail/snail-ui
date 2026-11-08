<script setup lang="ts">
/** Demo: SnTree — connector lines, solid vs dashed, with data-level icons. */
import { Folder, FolderOpen, FileCode, FileText, FileJson } from 'lucide-vue-next';
import { SnTree } from '@snui/vue-web';
import type { SnTreeOption } from '@snui/vue-web';

const expanded = ['src', 'components', 'hooks'];

/** `icon` lives on each node: icon component, VNode, render fn or icon name. */
const data: SnTreeOption[] = [
  {
    key: 'src',
    label: 'src',
    icon: FolderOpen,
    children: [
      {
        key: 'components',
        label: 'components',
        icon: FolderOpen,
        children: [
          { key: 'button-tsx', label: 'button.tsx', icon: FileCode },
          { key: 'button-css', label: 'button.module.css', icon: FileText },
          { key: 'input-tsx', label: 'input.tsx', icon: FileCode },
        ],
      },
      {
        key: 'hooks',
        label: 'hooks',
        icon: Folder,
        children: [{ key: 'use-tree', label: 'use-tree.ts', icon: FileCode }],
      },
      { key: 'page', label: 'page.tsx', icon: FileCode },
    ],
  },
  {
    key: 'public',
    label: 'public',
    icon: Folder,
    children: [{ key: 'favicon', label: 'favicon.svg', icon: FileText }],
  },
  { key: 'readme', label: 'README.md', icon: FileText },
  { key: 'package', label: 'package.json', icon: FileJson },
  { key: 'tsconfig', label: 'tsconfig.json', icon: FileJson },
];
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      每个节点的 icon 字段可传图标组件、VNode、渲染函数或已注册的图标名；连接线支持线型、拐角形状与颜色配置。
    </p>
    <section class="sn-demo__col">
      <p class="sn-demo__label">直角 + 实线（默认）</p>
      <SnTree :data="data" :default-expanded-keys="expanded" show-line />
    </section>
    <section class="sn-demo__col">
      <p class="sn-demo__label">直角 + 虚线</p>
      <SnTree :data="data" :default-expanded-keys="expanded" show-line line-style="dashed" />
    </section>
    <section class="sn-demo__col">
      <p class="sn-demo__label">圆角 + 自定义颜色</p>
      <SnTree
        :data="data"
        :default-expanded-keys="expanded"
        show-line
        line-corner="rounded"
        line-color="#7c5cff"
      />
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 24px 32px;
}
.sn-demo__hint {
  flex: 1 1 100%;
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-demo__col {
  flex: 1 1 240px;
  max-width: 280px;
}
.sn-demo__label {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
