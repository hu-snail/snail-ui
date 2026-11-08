<script setup lang="ts">
/** Demo: SnTreeSelect — connector lines, solid vs dashed, with data-level icons. */
import { ref } from 'vue';
import { Folder, FolderOpen, FileCode, FileText } from 'lucide-vue-next';
import { SnTreeSelect } from '@snui/vue-web';

const solidValue = ref<string | null>(null);
const dashedValue = ref<string | null>(null);
const roundedValue = ref<string | null>(null);

/** `icon` is an ordinary option field — no render prop needed. */
const options = [
  {
    label: 'src',
    value: 'src',
    icon: FolderOpen,
    children: [
      {
        label: 'components',
        value: 'components',
        icon: FolderOpen,
        children: [
          { label: 'button.tsx', value: 'button.tsx', icon: FileCode },
          { label: 'input.tsx', value: 'input.tsx', icon: FileCode },
        ],
      },
      {
        label: 'hooks',
        value: 'hooks',
        icon: Folder,
        children: [{ label: 'use-tree.ts', value: 'use-tree.ts', icon: FileCode }],
      },
      { label: 'page.tsx', value: 'page.tsx', icon: FileCode },
    ],
  },
  {
    label: 'public',
    value: 'public',
    icon: Folder,
    children: [{ label: 'favicon.svg', value: 'favicon.svg', icon: FileText }],
  },
  { label: 'README.md', value: 'README.md', icon: FileText },
];
</script>

<template>
  <div class="sn-demo">
    <p class="sn-demo__hint">
      选项数据里的 icon 字段在下拉面板中直接渲染；连接线支持线型、拐角形状与颜色配置。
    </p>
    <section class="sn-demo__col">
      <p class="sn-demo__label">直角 + 实线（默认）</p>
      <SnTreeSelect
        v-model="solidValue"
        :options="options"
        show-line
        default-expand-all
        placeholder="选择文件"
        style="width: 240px"
      />
    </section>
    <section class="sn-demo__col">
      <p class="sn-demo__label">直角 + 虚线</p>
      <SnTreeSelect
        v-model="dashedValue"
        :options="options"
        show-line
        line-style="dashed"
        default-expand-all
        placeholder="选择文件"
        style="width: 240px"
      />
    </section>
    <section class="sn-demo__col">
      <p class="sn-demo__label">圆角 + 自定义颜色</p>
      <SnTreeSelect
        v-model="roundedValue"
        :options="options"
        show-line
        line-corner="rounded"
        line-color="#7c5cff"
        default-expand-all
        placeholder="选择文件"
        style="width: 240px"
      />
    </section>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
}
.sn-demo__hint {
  flex: 1 1 100%;
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.sn-demo__col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.sn-demo__label {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
