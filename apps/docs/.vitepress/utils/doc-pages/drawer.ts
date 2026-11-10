/**
 * Drawer 抽屉 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const drawerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '反馈组件 Feedback' }, { text: 'Drawer 抽屉' }],
  title: 'Drawer 抽屉',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnDrawer' },
    {
      t: 'text',
      s: ' 是从屏幕四边滑入的浮层外壳：遮罩 + 面板 + 方向定位 + 滚动锁 + 焦点管理。面板内部的标题 / 正文 / 底部由配套的 ',
    },
    { t: 'code', s: 'SnDrawerContent' },
    { t: 'text', s: ' 渲染。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/drawer',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Drawer 抽屉.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Drawer } from '@snui/vue-web';
</script>

<template>
  <Drawer />
</template>`,
  },
  demos: [
    { name: 'drawer-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'drawer-web-content', title: '内容骨架', blurb: '内容骨架' },
    { name: 'drawer-web-resizable', title: '拖拽调整尺寸', blurb: '拖拽调整尺寸' },
    { name: 'drawer-web-multiple', title: '多层嵌套', blurb: '多层嵌套' },
    { name: 'drawer-web-target', title: '指定挂载容器', blurb: '指定挂载容器' },
    { name: 'drawer-web-scroll', title: '内容滚动', blurb: '内容滚动' },
    { name: 'drawer-web-closable', title: '关闭按钮', blurb: '关闭按钮' },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'show', type: 'boolean', default: 'false', desc: '是否展示抽屉。' },
      { name: 'width', type: 'number | string', default: 'undefined as any', desc: '宽度。' },
      { name: 'height', type: 'number | string', default: 'undefined as any', desc: '高度。' },
      {
        name: 'placement',
        type: 'SnDrawerPlacement',
        default: "'right'",
        desc: 'Which edge the panel slides in from.',
      },
      { name: 'maskClosable', type: 'boolean', default: 'true', desc: '点击遮罩时是否关闭抽屉。' },
      {
        name: 'showMask',
        type: "boolean | 'transparent'",
        default: 'true',
        desc: "Render the mask; `'transparent'` keeps it clickable but invisible.",
      },
      {
        name: 'to',
        type: 'string | HTMLElement',
        default: 'undefined as any',
        desc: '传送目标（选择器或元素）。',
      },
      {
        name: 'displayDirective',
        type: 'SnDrawerDisplayDirective',
        default: "'if'",
        desc: "`'if'` unmounts after leaving; `'show'` keeps the node.",
      },
      { name: 'nativeScrollbar', type: 'boolean', default: 'true', desc: '是否使用原生滚动容器。' },
      { name: 'defaultWidth', type: 'number | string', default: '251', desc: '`251`' },
      { name: 'defaultHeight', type: 'number | string', default: '251', desc: '`251`' },
      { name: 'resizable', type: 'boolean', default: 'false', desc: '是否允许拖拽调整面板宽高。' },
      {
        name: 'maxWidth',
        type: 'number',
        default: 'undefined as any',
        desc: '拖拽时的最大宽度（px）。',
      },
      {
        name: 'maxHeight',
        type: 'number',
        default: 'undefined as any',
        desc: '拖拽时的最大高度（px）。',
      },
      {
        name: 'minWidth',
        type: 'number',
        default: 'undefined as any',
        desc: '拖拽时的最小宽度（px）。',
      },
      {
        name: 'minHeight',
        type: 'number',
        default: 'undefined as any',
        desc: '拖拽时的最小高度（px）。',
      },
      {
        name: 'autoFocus',
        type: 'boolean',
        default: 'true',
        desc: '打开时是否自动聚焦面板内第一个可聚焦元素。',
      },
      {
        name: 'trapFocus',
        type: 'boolean',
        default: 'true',
        desc: '是否将 Tab 焦点锁定在面板内部。',
      },
      {
        name: 'scrollbarProps',
        type: 'SnDrawerScrollbarProps',
        default: 'undefined as any',
        desc: '传给滚动容器的属性，支持 `trigger` / `xScrollable` / `onScroll`。',
      },
      { name: 'zIndex', type: 'number', default: 'undefined as any', desc: '抽屉的层级。' },
      {
        name: 'onMaskClick',
        type: '(e: MouseEvent) => void',
        default: '—',
        desc: '点击遮罩时的回调（早于关闭），由 `mask-click` 事件映射，勿手动重复触发。',
      },
      {
        name: 'contentClass',
        type: 'string',
        default: 'undefined as any',
        desc: '可滚动内容节点的类名。',
      },
      {
        name: 'contentStyle',
        type: 'string | CSSProperties',
        default: 'undefined as any',
        desc: '内容区样式。',
      },
      {
        name: 'onEsc',
        type: '() => void',
        default: '—',
        desc: '按下 Escape 时的回调（早于关闭，`closeOnEsc` 为 false 时也会触发）。',
      },
      { name: 'closeOnEsc', type: 'boolean', default: 'true', desc: '按下 Escape 是否关闭抽屉。' },
      {
        name: 'blockScroll',
        type: 'boolean',
        default: 'true',
        desc: '打开时是否禁用 `<html>` 滚动。',
      },
      {
        name: 'onAfterEnter',
        type: '() => void',
        default: '—',
        desc: '进入过渡动画结束后的回调。',
      },
      {
        name: 'onAfterLeave',
        type: '() => void',
        default: '—',
        desc: '离开过渡动画结束后的回调。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnDrawer.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:show',
        payload: '(boolean)',
        desc: '可见性变化时派发，对应 n-drawer 的 `onUpdate:show`。',
      },
      { name: 'after-enter', payload: '—', desc: '进入过渡动画结束后派发。' },
      { name: 'after-leave', payload: '—', desc: '离开过渡动画结束后派发。' },
      { name: 'mask-click', payload: '(MouseEvent)', desc: '点击遮罩时派发。' },
      { name: 'esc', payload: '—', desc: '按下 Escape 时派发。' },
      {
        name: 'update:width',
        payload: '(number)',
        desc: '拖拽调整宽度后派发新宽度，对应 n-drawer 的 `onUpdateWidth`。',
      },
      {
        name: 'update:height',
        payload: '(number)',
        desc: '拖拽调整高度后派发新高度，对应 n-drawer 的 `onUpdateHeight`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnDrawer.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '抽屉内容，通常放置 `<SnDrawerContent>`。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Drawer 抽屉 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Drawer } from '@snui/vue-web';",
    chipCopy: "import { Drawer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Drawer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'dialog', link: '/components/web/dialog' },
    next: { text: 'loading', link: '/components/web/loading' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
