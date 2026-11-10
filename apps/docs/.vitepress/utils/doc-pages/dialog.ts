/**
 * Dialog 对话框 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dialogDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Dialog 对话框' },
  ],
  title: 'Dialog 对话框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnDialog' },
    { t: 'text', s: ' 是对话框的**面板** —— 一张带标题、类型图标、正文与底部按钮行的卡片。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dialog',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Dialog 对话框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dialog } from '@snui/vue-web';
</script>

<template>
  <Dialog />
</template>`,
  },
  demos: [
    { name: 'dialog-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'dialog-web-types', title: '类型与布局', blurb: '类型与布局' },
    { name: 'dialog-web-async', title: '异步确认', blurb: '异步确认' },
    { name: 'dialog-web-action', title: '自定义操作区', blurb: '自定义操作区' },
    { name: 'dialog-web-borderless', title: '无边框与隐藏图标', blurb: '无边框与隐藏图标' },
    { name: 'dialog-web-slots', title: '插槽全接管', blurb: '插槽全接管' },
    { name: 'dialog-web-controlled', title: '受控显示', blurb: '受控显示' },
    {
      name: 'dialog-web-use-dialog',
      title: '命令式调用（useDialog）',
      blurb: '命令式调用（useDialog）',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'icon',
        type: 'IconComponent',
        default: 'undefined as any',
        desc: '自定义类型图标，仍受 `showIcon` 约束。',
      },
      {
        name: 'type',
        type: 'DialogType',
        default: "'default'",
        desc: 'Semantic type — drives the default icon + its colour.',
      },
      {
        name: 'title',
        type: 'string',
        default: 'undefined as any',
        desc: '面板标题。对应 n-dialog 的 `title`。',
      },
      { name: 'closable', type: 'boolean', default: 'true', desc: '是否显示关闭按钮。' },
      { name: 'negativeText', type: 'string', default: 'undefined as any', desc: '取消按钮文字。' },
      { name: 'positiveText', type: 'string', default: 'undefined as any', desc: '确认按钮文字。' },
      {
        name: 'positiveButtonProps',
        type: 'Record<string, unknown>',
        default: 'undefined as any',
        desc: '透传给确认按钮的属性。',
      },
      {
        name: 'negativeButtonProps',
        type: 'Record<string, unknown>',
        default: 'undefined as any',
        desc: '透传给取消按钮的属性。',
      },
      { name: 'content', type: 'string', default: 'undefined as any', desc: '正文文字。' },
      { name: 'showIcon', type: 'boolean', default: 'true', desc: '是否显示类型图标。' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: '确认按钮是否进入加载态（同时 disabled）。',
      },
      { name: 'bordered', type: 'boolean', default: 'false', desc: '是否显示边框。' },
      {
        name: 'iconPlacement',
        type: 'IconPlacement',
        default: 'undefined as any',
        desc: "Icon above the title ('top') or inline before it ('left').",
      },
      {
        name: 'titleClass',
        type: 'string | Array<string | undefined>',
        default: 'undefined as any',
        desc: '标题行类名。',
      },
      {
        name: 'titleStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: '标题区样式。',
      },
      {
        name: 'contentClass',
        type: 'string | Array<string | undefined>',
        default: 'undefined as any',
        desc: '正文行类名。',
      },
      {
        name: 'contentStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: '内容区样式。',
      },
      {
        name: 'actionClass',
        type: 'string | Array<string | undefined>',
        default: 'undefined as any',
        desc: '按钮行类名。',
      },
      {
        name: 'actionStyle',
        type: 'string | Record<string, string | number>',
        default: 'undefined as any',
        desc: '操作区样式。',
      },
      {
        name: 'closeFocusable',
        type: 'boolean',
        default: 'false',
        desc: '关闭按钮是否进入 tab 序。`false` 时 `tabindex="-1"`。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Dialog 对话框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Dialog } from '@snui/vue-web';",
    chipCopy: "import { Dialog } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Dialog', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'alert', link: '/components/web/alert' },
    next: { text: 'drawer', link: '/components/web/drawer' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
