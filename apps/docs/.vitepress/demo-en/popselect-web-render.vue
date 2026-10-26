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
        info.selected ? 'Enabled' : 'Not enabled',
      ),
    ],
  );

const typeOptions: SnSelectOptionInput[] = [
  { label: 'Backlog', value: 'demand' },
  { label: 'Bug pool', value: 'bug' },
  { label: 'Sprint tasks', value: 'iteration' },
];

const labelOf: Record<string, string> = {
  demand: 'Backlog',
  bug: 'Bug pool',
  iteration: 'Sprint tasks',
};

const typeValue = ref<SnPopselectValue>('bug');
const typeLabel = computed(() =>
  typeValue.value === null
    ? 'Not selected'
    : (labelOf[String(typeValue.value)] ?? String(typeValue.value)),
);

const flagOptions: SnSelectOptionInput[] = [
  { label: 'New navigation', value: 'newNav' },
  { label: 'Experimental editor', value: 'editor' },
  { label: 'Canary reports', value: 'report' },
];

const flagValue = ref<SnPopselectValue>(['newNav']);
const flagCount = computed(() => (Array.isArray(flagValue.value) ? flagValue.value.length : 0));
</script>

<template>
  <div class="popselect-render-demo">
    <section class="popselect-render-demo__block">
      <h4 class="popselect-render-demo__title">render-label: add an icon prefix to each row</h4>
      <div class="popselect-render-demo__row">
        <SnPopselect
          v-model:value="typeValue"
          :options="typeOptions"
          :render-label="renderLabel"
          placement="bottom"
        >
          <SnButton>Selected: {{ typeLabel }}</SnButton>
        </SnPopselect>
      </div>
    </section>

    <section class="popselect-render-demo__block">
      <h4 class="popselect-render-demo__title">
        render-option: wrap the whole row and append a status
      </h4>
      <div class="popselect-render-demo__row">
        <SnPopselect
          v-model:value="flagValue"
          :options="flagOptions"
          :render-option="renderOption"
          multiple
          placement="bottom"
        >
          <SnButton>Feature flags ({{ flagCount }} enabled)</SnButton>
        </SnPopselect>
      </div>
    </section>

    <p class="popselect-render-demo__hint">
      render-label only replaces the row label; the primary-color text and checkmark of the selected
      state are still drawn by the component. render-option receives the row's default node, so you
      can append status-aware text like the example above. The two are mutually exclusive: when both
      are passed, only render-option takes effect.
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
