/**
 * TimePicker 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const timePickerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'TimePicker 时间选择' }],
  title: 'TimePicker 时间选择',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '时间选择器。Teleport 三列（时/分/秒）面板，支持 12 小时制与全键盘操作。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/time-picker',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'TimePicker.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { TimePicker } from '@snui/vue-web';
</script>

<template>
  <TimePicker />
</template>`,
  },
  demos: [
    {
      name: 'time-picker-web-basic',
      title: '基础用法',
      blurb: 'v-model（毫秒时间戳）+ 默认 HH:mm:ss。',
    },
    {
      name: 'time-picker-web-format',
      title: 'format（列数）',
      blurb: 'HH:mm 隐藏秒列，提交秒归零。',
    },
    {
      name: 'time-picker-web-12h',
      title: '12 小时制（use12Hours）',
      blurb: '钟面序 12/1…11 + AM/PM 列。',
    },
    {
      name: 'time-picker-web-clearable',
      title: '可清空（clearable）',
      blurb: '清空按钮一键置空。',
    },
    {
      name: 'time-picker-web-disabled',
      title: '禁用（disabled）',
      blurb: '禁用交互。',
    },
    {
      name: 'time-picker-web-readonly',
      title: '只读（readonly）',
      blurb: '可见不可改。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'number | null', default: 'null', desc: '绑定值。' },
      {
        name: 'format',
        type: 'SnTimePickerFormat',
        default: "'HH:mm:ss'",
        desc: 'Display format — also decides whether the seconds column renders.',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Please select time'",
        desc: 'Placeholder text when empty.',
      },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '清空按钮' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用交互。' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读：不打开面板，也不提交值。',
      },
      { name: 'size', type: 'SnTimePickerSize', default: "'medium'", desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnTimePickerStatus',
        default: "'default'",
        desc: 'Validation-driven visual status.',
      },
      { name: 'use12Hours', type: 'boolean', default: 'false', desc: '12 小时制 + AM/PM' },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: "Accessible name for the trigger (fallback: 'Time picker').",
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
      { t: 'code', s: 'SnTimePicker.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: number | null)',
        desc: '`v-model` 同步：点击任意单元格或按 Enter 确认时触发。',
      },
      { name: 'change', payload: '(value: number | null)', desc: '值提交（含清空）时触发。' },
      { name: 'focus', payload: 'FocusEvent', desc: '触发器获得焦点时触发。' },
      { name: 'blur', payload: 'FocusEvent', desc: '触发器失去焦点时触发。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'TimePicker 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { TimePicker } from '@snui/vue-web';",
    chipCopy: "import { TimePicker } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'TimePicker', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tree-select', link: '/components/web/tree-select' },
    next: { text: 'date-picker', link: '/components/web/date-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
