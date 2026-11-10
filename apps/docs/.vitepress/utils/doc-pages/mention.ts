/**
 * Mention 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const mentionDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Mention' }],
  title: 'Mention',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '提及输入。输入 ' },
    { t: 'code', s: '@' },
    { t: 'text', s: '（可自定义 delimiter）触发候选面板，选中替换触发词。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/mention',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Mention.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Mention } from '@snui/vue-web';
</script>

<template>
  <Mention />
</template>`,
  },
  demos: [
    {
      name: 'mention-web-basic',
      title: '基础用法',
      blurb: '@ 触发候选 → 过滤 → 键盘/点击选中替换。',
    },
    { name: 'mention-web-textarea', title: 'textarea 多行', blurb: "type='textarea' 多行提及。" },
    { name: 'mention-web-delimiter', title: '自定义分隔符', blurb: "delimiter='#' 话题提及。" },
    { name: 'mention-web-states', title: '禁用 / 只读', blurb: 'disabled / readonly。' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Bound value (`v-model`).' },
      {
        name: 'options',
        type: 'SnMentionRawOption[]',
        default: '() => []',
        desc: '候选（string 或 {label, value?, disabled?}）',
      },
      {
        name: 'delimiter',
        type: 'string | string[]',
        default: "'@'",
        desc: "Trigger character(s). A string delimiter uses its last character as the trigger char (n-mention semantics); an array accepts any of the entries' last characters (each simplified to a single char).",
      },
      { name: 'placeholder', type: 'string', default: "''", desc: 'Placeholder text.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用交互（输入、选择）。' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读：值可见但不可编辑，不弹面板。',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset.',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Drives border color.',
      },
      {
        name: 'type',
        type: "'text' | 'textarea'",
        default: "'text'",
        desc: 'Input variant: single-line text or multi-line textarea.',
      },
      { name: 'rows', type: 'number', default: '3', desc: '`type="textarea"` 时的行数。' },
      { name: 'ariaLabel', type: 'string', default: "''", desc: 'Native ARIA label.' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnMention.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(string)',
        desc: '`v-model` 同步，每次输入与选择候选项时触发。',
      },
      { name: 'change', payload: '(string)', desc: '选择候选项提交值时触发。' },
      {
        name: 'select',
        payload: 'SnMentionOption',
        desc: '从面板中选中选项时触发（点击 / Enter / Tab）。',
      },
      { name: 'focus', payload: 'FocusEvent', desc: '获得焦点时触发的原生 focus 事件。' },
      { name: 'blur', payload: 'FocusEvent', desc: '失去焦点时触发的原生 blur 事件。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnMention.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'empty', props: '—', desc: '面板空状态内容，默认显示 “No data” 文案。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Mention 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Mention } from '@snui/vue-web';",
    chipCopy: "import { Mention } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Mention', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'color-picker', link: '/components/web/color-picker' },
    next: { text: 'upload', link: '/components/web/upload' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
