/**
 * Radio 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const radioDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Radio' }],
  title: 'Radio',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '单选。原生 ' },
    { t: 'code', s: 'input[type=radio]' },
    { t: 'text', s: ' 语义（同名组方向键漫游），含 ' },
    { t: 'code', s: 'SnRadioButton' },
    { t: 'text', s: ' 按钮形态与 ' },
    { t: 'code', s: 'SnRadioGroup' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/radio',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Radio.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Radio } from '@snui/vue-web';
</script>

<template>
  <Radio />
</template>`,
  },
  demos: [
    { name: 'radio-web-basic', title: '基础用法', blurb: 'v-model + checkedValue 匹配即选中。' },
    {
      name: 'radio-web-group',
      title: '单选组（RadioGroup）',
      blurb: 'options 声明式 / slot 自定义，共享 name 方向键漫游。',
    },
    {
      name: 'radio-web-button',
      title: '按钮形态（RadioButton）',
      blurb: '组内去边合并圆角，button 形态。',
    },
    {
      name: 'radio-web-sizes',
      title: '尺寸（size）',
      blurb: 'mini / tiny / small / medium / large 五档。',
    },
    {
      name: 'radio-web-states',
      title: '禁用 / 只读',
      blurb: '组级禁用 OR 项级禁用；readonly 视觉态。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'checkedValue',
        type: 'SnRadioValue | null',
        default: 'null',
        desc: "The value this radio represents — when the group's (or own) `modelValue` equals it, this radio is checked. naive-ui calls this `value`.",
      },
      {
        name: 'modelValue',
        type: 'SnRadioValue | null',
        default: 'null',
        desc: "Standalone bound value. Inside a group the group's modelValue wins.",
      },
      {
        name: 'label',
        type: 'string | undefined',
        default: "''",
        desc: 'Label text rendered next to the dot. Slot `label` overrides.',
      },
      {
        name: 'name',
        type: 'string | undefined',
        default: '—',
        desc: 'Native radio group name — required for arrow-key nav. Provided by group.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables this radio. Group-level disabled ORs in.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — renders but ignores activation.',
      },
      {
        name: 'size',
        type: 'SnRadioSize',
        default: '—',
        desc: "Visual size preset. Falls back to group size then 'medium'.",
      },
      {
        name: 'status',
        type: 'SnRadioStatus',
        default: '—',
        desc: "Visual status. Falls back to group status then 'default'.",
      },
      {
        name: 'ariaLabel',
        type: 'string | undefined',
        default: '—',
        desc: 'Native ARIA label (overrides label for the accessible name).',
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
    copy: 'Radio 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Radio } from '@snui/vue-web';",
    chipCopy: "import { Radio } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Radio', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'checkbox', link: '/components/web/checkbox' },
    next: { text: 'switch', link: '/components/web/switch' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
