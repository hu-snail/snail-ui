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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
      name: 'checkbox-web-disabled',
      title: '禁用（disabled）',
      blurb: '选中 / 未选中两种禁用态。',
    },
    {
      name: 'checkbox-web-readonly',
      title: '只读（readonly）',
      blurb: '视觉态正常，不可切换。',
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
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCheckboxValue | SnCheckboxValue[]',
        default: '—',
        desc: 'v-model 绑定',
      },
      {
        name: 'defaultChecked',
        type: 'boolean',
        default: 'false',
        desc: '非受控模式下的初始选中状态。',
      },
      {
        name: 'label',
        type: 'string',
        default: "''",
        desc: 'Label text rendered next to the box. Use the default slot for rich content.',
      },
      { name: 'value', type: 'SnCheckboxValue', default: '—', desc: '在 group 中的取值' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用（group 级 OR）' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        desc: '半选态（aria-checked=mixed）',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Mirrors n-checkbox `size` (adds `mini` per AUI convention).',
      },
      { name: 'checkedValue', type: 'SnCheckboxValue', default: 'true', desc: '选中时的值' },
      { name: 'uncheckedValue', type: 'SnCheckboxValue', default: 'false', desc: '未选中时的值' },
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
        desc: '原生输入框是否参与 Tab 焦点顺序。对应 n-checkbox 的 `focusable`。',
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
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnCheckbox.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(SnCheckboxValue)',
        desc: '`v-model` 同步，独立使用时派发切换后的值。',
      },
      {
        name: 'update:checked',
        payload: '(boolean)',
        desc: '点击或空格提交选中状态时派发，对应 n-checkbox 的 `onUpdate:checked`。',
      },
      {
        name: 'checkedChange',
        payload: '(boolean)',
        desc: '选中状态提交时派发，载荷与 naive-ui 的 `checked-change` 一致。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnCheckbox.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      {
        name: 'default',
        props: '{ checked: boolean; disabled: boolean; indeterminate: boolean }',
        desc: '富内容 Label，优先于 `label` 属性，作用域提供选中状态。',
      },
      {
        name: 'icon',
        props: '{ checked: boolean }',
        desc: '自定义勾选图标，渲染在勾选框内替代 CSS 对勾。',
      },
      {
        name: 'indicator',
        props: '{ checked: boolean; indeterminate: boolean }',
        desc: '整体替换勾选框，用于卡片 / 标签形态，并接收状态以自绘选中视觉。',
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
