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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
      name: 'switch-web-disabled',
      title: '禁用（disabled）',
      blurb: '开 / 关两种禁用态。',
    },
    {
      name: 'switch-web-readonly',
      title: '只读（readonly）',
      blurb: '视觉态正常，不可切换。',
    },
    {
      name: 'switch-web-loading',
      title: '加载中（loading）',
      blurb: '异步提交中的 spinner 态。',
    },
    {
      name: 'switch-web-slots',
      title: '插槽文案（checked / unchecked）',
      blurb: 'rail 内嵌选中 / 未选中文案。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean | string | number', default: 'false', desc: '绑定值。' },
      {
        name: 'checkedValue',
        type: 'boolean | string | number',
        default: 'true',
        desc: '选中时取的值。',
      },
      {
        name: 'uncheckedValue',
        type: 'boolean | string | number',
        default: 'false',
        desc: '未选中时取的值。',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Visual size preset. Drives rail width / height / knob size.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读' },
      { name: 'loading', type: 'boolean', default: 'false', desc: '加载中（不响应切换）' },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: 'Accessible name for the switch element.',
      },
      {
        name: 'railStyle',
        type: '(info: SwitchRailStyleContext) => Record<string, string>',
        default: '—',
        desc: '轨道样式的渲染函数，接收 `{ checked }`，返回值合并到轨道元素上。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnSwitch.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: boolean | string | number)',
        desc: '`v-model` 同步：载荷为 `checkedValue` 或 `uncheckedValue`。',
      },
      {
        name: 'change',
        payload: '(value: boolean | string | number)',
        desc: '切换成功后触发，载荷为新值。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnSwitch.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'checked', props: '—', desc: '轨道在开启状态下显示的内容。' },
      { name: 'unchecked', props: '—', desc: '轨道在关闭状态下显示的内容。' },
      { name: 'loading-icon', props: '—', desc: '替换旋钮内默认的加载图标。' },
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
