/**
 * Radio 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const radioDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Radio 单选框' }],
  title: 'Radio 单选框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
    { name: 'radio-web-disabled', title: '禁用', blurb: 'disabled：选中 / 未选两种置灰态。' },
    { name: 'radio-web-readonly', title: '只读', blurb: 'readonly：视觉态可见但不可改。' },
    {
      name: 'radio-web-card',
      title: '卡片模式（variant="card"）',
      blurb: '整块可点选卡片，#card 插槽自定义内容，选中为主题色描边 + 浅底 + 右上角标。',
    },
    {
      name: 'radio-web-icon',
      title: '图标模式（variant="icon"）',
      blurb: '方形图标砖网格，#icon 插槽放字形，无文字行。',
    },
    {
      name: 'radio-web-indicator',
      title: '指示器位置与选中态',
      blurb: 'indicatorPlacement top-right / bottom-right / none；checkedStyle border / fill。',
    },
    {
      name: 'radio-web-inverted',
      title: '反转选中态与标题在前',
      blurb:
        'markerShape="inverted" 选中为主题色实心 + 白点；labelPlacement="label-first" 标题在前、选择在后。',
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
      { name: 'name', type: 'string | undefined', default: '—', desc: '原生 radio name（组提供）' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用（组级 OR）' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读视觉态' },
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
        desc: '原生 ARIA 标签，覆盖 `label` 作为无障碍名称。',
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
      { t: 'code', s: 'SnRadio.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: SnRadioValue | null)',
        desc: '`v-model` 同步，激活时派发本项的 `checkedValue`。',
      },
      {
        name: 'change',
        payload: '(value: SnRadioValue, event: Event)',
        desc: '用户激活时触发（原生 `change`）。',
      },
      { name: 'checked', payload: '(value: SnRadioValue)', desc: '用户交互把选中态切为真时触发。' },
      {
        name: 'update',
        payload: '(value: SnRadioValue | null, event: Event)',
        desc: '原生 `update` 事件，每次状态变化都触发。',
      },
      { name: 'focus', payload: 'FocusEvent', desc: '原生聚焦事件。' },
      { name: 'blur', payload: 'FocusEvent', desc: '原生失焦事件。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnRadio.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '兜底标签内容；`label` 插槽缺失时渲染。' },
      {
        name: 'label',
        props: '{ checked: boolean; disabled: boolean }',
        desc: '自定义标签内容，作用域为 `{ checked, disabled }`，替代 `label` 属性文本。',
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
