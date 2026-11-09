/**
 * Switch 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const switchDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Switch' }],
  title: 'Switch',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '开关。' },
    { t: 'code', s: 'role="switch"' },
    { t: 'text', s: ' + aria-checked，Enter / Space 键盘激活，checked / unchecked 插槽文案。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/switch',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Switch.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Switch } from '@snui/vue-web';
</script>

<template>
  <Switch />
</template>`,
  },
  demos: [
    { name: 'switch-web-basic', title: '基础用法', blurb: 'v-model 双向绑定。' },
    {
      name: 'switch-web-values',
      title: '选中值映射（checkedValue / uncheckedValue）',
      blurb: "非 boolean 值：'on' / 'off'、1 / 0。",
    },
    { name: 'switch-web-sizes', title: '尺寸（size）', blurb: 'small / medium / large 三档。' },
    {
      name: 'switch-web-states',
      title: '禁用 / 只读 / 加载中',
      blurb: 'disabled / readonly / loading spinner。',
    },
    {
      name: 'switch-web-slots',
      title: '插槽文案（checked / unchecked）',
      blurb: 'rail 内嵌选中 / 未选中文案。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean | string | number',
        default: 'false',
        desc: 'Bound value compared against `checkedValue` / `uncheckedValue`.',
      },
      {
        name: 'checkedValue',
        type: 'boolean | string | number',
        default: 'true',
        desc: 'Value emitted when the switch is on. Compared by strict equality.',
      },
      {
        name: 'uncheckedValue',
        type: 'boolean | string | number',
        default: 'false',
        desc: 'Value emitted when the switch is off.',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives rail width / height / knob size.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction + dims the rail.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — renders normally but does not toggle.',
      },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: 'Shows a spinner in the knob and blocks interaction while pending.',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name for the switch element.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Switch 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Switch } from '@snui/vue-web';",
    chipCopy: "import { Switch } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Switch', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'radio', link: '/components/web/radio' },
    next: { text: 'slider', link: '/components/web/slider' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
