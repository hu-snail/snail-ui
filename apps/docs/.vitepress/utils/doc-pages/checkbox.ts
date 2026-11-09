/**
 * Checkbox 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const checkboxDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Checkbox' }],
  title: 'Checkbox',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '多选框。原生 ' },
    { t: 'code', s: 'input[type=checkbox]' },
    { t: 'text', s: ' 语义（aria-checked 三态），支持独立使用与 ' },
    { t: 'code', s: 'SnCheckboxGroup' },
    { t: 'text', s: ' 编排。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/checkbox',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Checkbox.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Checkbox } from '@snui/vue-web';
</script>

<template>
  <Checkbox />
</template>`,
  },
  demos: [
    { name: 'checkbox-web-basic', title: '基础用法', blurb: 'v-model 双向绑定 + label。' },
    {
      name: 'checkbox-web-group',
      title: '复选组（CheckboxGroup）',
      blurb: 'options 声明式 / slot 自定义两种渲染路径，v-model 为数组。',
    },
    {
      name: 'checkbox-web-indeterminate',
      title: '半选态（indeterminate）',
      blurb: "aria-checked='mixed'，父级全选场景。",
    },
    {
      name: 'checkbox-web-sizes',
      title: '尺寸（size）',
      blurb: 'mini / tiny / small / medium / large 五档。',
    },
    {
      name: 'checkbox-web-states',
      title: '禁用 / 只读',
      blurb: 'disabled 交互与视觉禁用；readonly 视觉态。',
    },
    {
      name: 'checkbox-web-values',
      title: '自定义选中值（checkedValue / uncheckedValue）',
      blurb: "非 boolean 值映射：'on' / 'off'、1 / 0。",
    },
    {
      name: 'checkbox-web-custom',
      title: '自定义插槽（`indicator` / `icon` / 默认插槽）',
      blurb: 'indicator 标签 / 卡片形态 + icon 自定义对勾 + 默认插槽作用域。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCheckboxValue | SnCheckboxValue[]',
        default: '—',
        desc: 'Bound checked state (`v-model`). For a standalone checkbox this is `checkedValue` / `uncheckedValue`; inside a group the parent group owns the array and this prop is ignored on children.',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        default: 'false',
        desc: 'Uncontrolled initial checked state.',
      },
      {
        name: 'label',
        type: 'string',
        default: "''",
        desc: 'Label text rendered next to the box. Use the default slot for rich content.',
      },
      {
        name: 'value',
        type: 'SnCheckboxValue',
        default: '—',
        desc: 'Value this checkbox represents inside a group (`v-model:value` on the group collects these). Mirrors n-checkbox `value`.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: 'Disables interaction.' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — visible but not toggleable.',
      },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        desc: 'Half-checked state (parent-of-many pattern). Mirrors n-checkbox `indeterminate`.',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Mirrors n-checkbox `size` (adds `mini` per AUI convention).',
      },
      {
        name: 'checkedValue',
        type: 'SnCheckboxValue',
        default: 'true',
        desc: 'Value emitted when checked. Defaults to `true`. Mirrors n-checkbox `checked-value`.',
      },
      {
        name: 'uncheckedValue',
        type: 'SnCheckboxValue',
        default: 'false',
        desc: 'Value emitted when unchecked. Defaults to `false`. Mirrors n-checkbox `unchecked-value`.',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Drives box color + `aria-invalid`.',
      },
      {
        name: 'focusable',
        type: 'boolean',
        default: 'true',
        desc: 'Whether the native input participates in tab order. Mirrors n-checkbox `focusable`.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name when no `label` / slot content is present.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Checkbox 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Checkbox } from '@snui/vue-web';",
    chipCopy: "import { Checkbox } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Checkbox', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'upload', link: '/components/web/upload' },
    next: { text: 'radio', link: '/components/web/radio' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
