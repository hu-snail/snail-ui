<script setup lang="ts">
/**
 * Demo: SnPopselect — custom row rendering.
 *
 * `render-label` replaces only the row label (icons per option here), while
 * `render-option` wraps the whole default row node so extra information can be
 * appended (a live on/off caption in this case). Both callables receive the
 * normalized leaf — label / value / disabled already resolved.
 *
 * Per AGENTS.md §113 the icons come from lucide through SnIcon; the callables
 * run outside this SFC's template scope, so they inline their styles and use
 * `--sn-web-*` tokens for colour.
 */
import { computed, h, ref, type VNodeChild } from 'vue';
import { Bug, FileText, GitBranch } from 'lucide-vue-next';
import { registerSnIcons, SnButton, SnIcon, SnPopselect } from '@snui/vue-web';
import type {
  SnPopselectLeafOption,
  SnPopselectRenderOption,
  SnPopselectValue,
  SnSelectOptionInput,
} from '@snui/vue-web';

registerSnIcons({ Bug, FileText, GitBranch });

/** Registry names keep the render callables data-driven. */
const iconNameOf: Record<string, string> = {
  demand: 'FileText',
  bug: 'Bug',
  iteration: 'GitBranch',
};

const renderLabel = (option: SnPopselectLeafOption): VNodeChild =>
  h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [
    h(SnIcon, { name: iconNameOf[String(option.value)] ?? 'FileText', size: 14 }),
    h('span', null, option.label),
  ]);

const renderOption: SnPopselectRenderOption = (info) =>
  h(
    'span',
    {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        width: '100%',
      },
    },
    [
      info.node,
      h(
        'span',
        { style: { fontSize: '12px', color: 'var(--sn-web-color-text-tertiary, #8f939c)' } },
        info.selected ? '已启用' : '未启用',
      ),
    ],
  );

const typeOptions: SnSelectOptionInput[] = [
  { label: '需求池', value: 'demand' },
  { label: '缺陷池', value: 'bug' },
  { label: '迭代任务', value: 'iteration' },
];

const labelOf: Record<string, string> = {
  demand: '需求池',
  bug: '缺陷池',
  iteration: '迭代任务',
};

const typeValue = ref<SnPopselectValue>('bug');
const typeLabel = computed(() =>
  typeValue.value === null
    ? '未选择'
    : (labelOf[String(typeValue.value)] ?? String(typeValue.value)),
);

const flagOptions: SnSelectOptionInput[] = [
  { label: '新版导航', value: 'newNav' },
  { label: '实验性编辑器', value: 'editor' },
  { label: '灰度报表', value: 'report' },
];

const flagValue = ref<SnPopselectValue>(['newNav']);
const flagCount = computed(() => (Array.isArray(flagValue.value) ? flagValue.value.length : 0));
</script>

<template>
  <div class="popselect-render-demo">
    <section class="popselect-render-demo__block">
      <h4 class="popselect-render-demo__title">render-label：为每行加图标前缀</h4>
      <div class="popselect-render-demo__row">
        <SnPopselect
          v-model:value="typeValue"
          :options="typeOptions"
          :render-label="renderLabel"
          placement="bottom"
        >
          <SnButton>已选：{{ typeLabel }}</SnButton>
        </SnPopselect>
      </div>
    </section>

    <section class="popselect-render-demo__block">
      <h4 class="popselect-render-demo__title">render-option：包裹整行并追加状态</h4>
      <div class="popselect-render-demo__row">
        <SnPopselect
          v-model:value="flagValue"
          :options="flagOptions"
          :render-option="renderOption"
          multiple
          placement="bottom"
        >
          <SnButton>功能开关（已启用 {{ flagCount }} 项）</SnButton>
        </SnPopselect>
      </div>
    </section>

    <p class="popselect-render-demo__hint">
      render-label 只替换行标签，选中态的主色文字与对勾仍由组件绘制；render-option 拿到整行默认节点
      node，可以像上例一样追加随选中状态变化的附属文案。两者互斥：同时传入时只有 render-option
      生效。
    </p>
  </div>
</template>

<style scoped>
.popselect-render-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popselect-render-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popselect-render-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popselect-render-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.popselect-render-demo__hint {
  margin: 0;
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
