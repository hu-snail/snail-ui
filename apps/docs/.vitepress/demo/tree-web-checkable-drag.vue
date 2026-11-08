<script setup lang="ts">
/** Demo: SnTree — checkboxes + drag & drop on the indent-guide file tree. */
import { ref } from 'vue';
import { FileCode, FileJson, FileText, Folder } from 'lucide-vue-next';
import { SnTree } from '@snui/vue-web';
import type { SnTreeDropInfo, SnTreeKey, SnTreeOption } from '@snui/vue-web';

const folder = (key: string, label: string, children: SnTreeOption[]): SnTreeOption => ({
  key,
  label,
  icon: Folder,
  children,
});

const file = (key: string, label: string, icon = FileCode): SnTreeOption => ({ key, label, icon });

const initialData: SnTreeOption[] = [
  folder('src', 'src', [
    folder('components', 'components', [
      file('modal.tsx', 'modal.tsx'),
      folder('button.tsx', 'button.tsx', [file('card.tsx', 'card.tsx')]),
    ]),
    folder('utils', 'utils', [
      file('compose.ts', 'compose.ts'),
      file('cn.ts', 'cn.ts'),
      file('index.ts', 'index.ts'),
    ]),
    file('package.json', 'package.json', FileJson),
    file('tsconfig.json', 'tsconfig.json', FileJson),
    file('README.md', 'README.md', FileText),
  ]),
];

/** Clone the data but keep the icon component refs (no JSON round-trip). */
function cloneNodes(nodes: SnTreeOption[]): SnTreeOption[] {
  return nodes.map((node) => ({
    ...node,
    children: node.children ? cloneNodes(node.children) : undefined,
  }));
}

interface NodeLocation {
  list: SnTreeOption[];
  index: number;
}

/** Find a node's owning list + index (null when absent). */
function locate(nodes: SnTreeOption[], key: SnTreeKey): NodeLocation | null {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index]!;
    if (node.key === key) return { list: nodes, index };
    if (node.children) {
      const found = locate(node.children, key);
      if (found) return found;
    }
  }
  return null;
}

const treeData = ref(cloneNodes(initialData));
const expandedKeys = ref<SnTreeKey[]>(['src', 'components', 'button.tsx', 'utils']);
const checkedKeys = ref<SnTreeKey[]>(['button.tsx']);

function handleDrop(info: SnTreeDropInfo): void {
  const dragKey = info.dragNode.key;
  const targetKey = info.node.key;
  if (dragKey === undefined || targetKey === undefined) return;

  const next = cloneNodes(treeData.value);
  const source = locate(next, dragKey);
  if (!source) return;
  const [moved] = source.list.splice(source.index, 1);
  if (!moved) return;

  if (info.dropPosition === 'inside') {
    const target = locate(next, targetKey);
    if (!target) return;
    const parent = target.list[target.index]!;
    parent.children = [...(parent.children ?? []), moved];
    if (!expandedKeys.value.includes(targetKey)) {
      expandedKeys.value = [...expandedKeys.value, targetKey];
    }
  } else {
    const target = locate(next, targetKey);
    if (!target) return;
    const insertAt = target.index + (info.dropPosition === 'after' ? 1 : 0);
    target.list.splice(insertAt, 0, moved);
  }
  treeData.value = next;
}
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      复选框与拖拽可同时使用：拖到行上 /
      下缘调整同级顺序，拖到文件夹中部移入该文件夹；缩进引导线只画竖线。
    </p>
    <div class="sn-demo__tree">
      <SnTree
        v-model:checked-keys="checkedKeys"
        v-model:expanded-keys="expandedKeys"
        :data="treeData"
        checkable
        block-line
        draggable
        show-line
        line-mode="guide"
        :indent="20"
        @drop="handleDrop"
      />
    </div>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sn-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-demo__tree {
  max-width: 280px;
}
</style>
