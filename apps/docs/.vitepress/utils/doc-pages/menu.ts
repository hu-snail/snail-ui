/**
 * Menu 菜单 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const menuDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '导航组件 Navigation' }, { text: 'Menu 菜单' }],
  title: 'Menu 菜单',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnMenu' },
    { t: 'text', s: ' 是 ' },
    { t: 'code', s: '@snui/vue-web' },
    {
      t: 'text',
      s: '（PC 桌面端）的层级导航菜单，支持 horizontal / vertical 两种模式。v-model:value 同步当前选中项、v-model:expandedKeys 同步展开组（vertical 模式）。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/menu',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Menu 菜单.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Menu } from '@snui/vue-web';
</script>

<template>
  <Menu />
</template>`,
  },
  demos: [
    { name: 'menu-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'menu-web-vertical', title: '竖向布局', blurb: '竖向布局' },
    { name: 'menu-web-icons', title: '带图标', blurb: '带图标' },
    { name: 'menu-web-inverted', title: '反色主题', blurb: '反色主题' },
    { name: 'menu-web-field-remap', title: '字段映射', blurb: '字段映射' },
    { name: 'menu-web-collapsed', title: '折叠收起', blurb: '折叠收起' },
    { name: 'menu-web-collapsed-inline', title: '行内折叠', blurb: '行内折叠' },
    { name: 'menu-web-responsive-collapse', title: '响应式收起', blurb: '响应式收起' },
    {
      name: 'menu-web-expanded-keys',
      title: '默认展开子菜单',
      blurb: 'defaultExpandedKeys 设置默认打开的子项。',
    },
    { name: 'menu-web-disabled-item', title: '禁用菜单项', blurb: 'disabled 项置灰且不可点。' },
    { name: 'menu-web-pop-button', title: '弹出菜单', blurb: '弹出菜单' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'mode',
        type: "'vertical' | 'horizontal' | 'popButton'",
        default: "'vertical'",
        desc: "Display mode. Mirrors n-menu `mode` plus AUI extension `popButton`. Default 'vertical'. - `vertical`   — sidebar / inline expansion - `horizontal` — top navbar - `popButton`  — Floating Action Button (FAB) menu: all items render as circular icon buttons stacked vertically. The trigger (last by default, or the item whose key matches `triggerKey`) is always visible; hovering the menu area expands the other items above the trigger. Each item shows a `<SnTooltip>` on hover. Position the menu inside a `position: relative` parent to anchor it where you want. AUI extension beyond n-menu — naive-ui doesn't ship a popButton mode.",
      },
      {
        name: 'triggerKey',
        type: 'string | number',
        default: "''",
        desc: 'Which item is the always-visible trigger in popButton mode. Defaults to the last item in `options`. AUI extension.',
      },
      { name: 'options', type: 'SnMenuOption[]', default: '() => []', desc: '选项树（详见下文）' },
      { name: 'value', type: 'string | number | null', default: 'null', desc: '当前值。' },
      {
        name: 'defaultValue',
        type: 'string | number | null',
        default: 'null',
        desc: '非受控模式下的初始值。',
      },
      { name: 'expandedKeys', type: 'Array<string | number>', default: '() => []', desc: '`[]`' },
      {
        name: 'defaultExpandedKeys',
        type: 'Array<string | number>',
        default: '() => []',
        desc: '`[]`',
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        desc: '默认展开所有有子节点的组',
      },
      {
        name: 'accordion',
        type: 'boolean',
        default: 'false',
        desc: '同时只允许一个 group 展开（手风琴）',
      },
      { name: 'indent', type: 'number', default: '32', desc: '每层 indent 像素（vertical 模式）' },
      {
        name: 'inverted',
        type: 'boolean',
        default: 'false',
        desc: '深色背景变体（适合 gradient / dark surface 顶导航）',
      },
      {
        name: 'keyField',
        type: 'string',
        default: "'key'",
        desc: "Field name used to read each node's `key`. Mirrors n-menu `key-field`.",
      },
      {
        name: 'labelField',
        type: 'string',
        default: "'label'",
        desc: "Field name used to read each node's `label`. Mirrors n-menu `label-field`.",
      },
      {
        name: 'childrenField',
        type: 'string',
        default: "'children'",
        desc: "Field name used to read each node's children array. Mirrors n-menu `children-field`.",
      },
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        desc: '折叠模式（vertical）：只显示 icon，子菜单 hover 弹出 popover',
      },
      { name: 'collapsedWidth', type: 'number', default: '48', desc: '折叠模式容器宽度（px）' },
      {
        name: 'collapsedIconSize',
        type: 'number',
        default: '24',
        desc: '折叠模式 icon 尺寸（px）',
      },
      { name: 'iconSize', type: 'number', default: '20', desc: '正常模式 icon 尺寸（px）' },
      {
        name: 'dropdownPlacement',
        type: "'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom'",
        default: "'right-start'",
        desc: "Popover placement for submenus in collapsed mode. Mirrors n-menu `dropdown-placement`. Default 'right-start' (popover opens to the right of the bar, top-aligned with the hovered item — matches Element Plus and naive-ui default).",
      },
      {
        name: 'disabledField',
        type: 'string',
        default: "'disabled'",
        desc: "Field name used to read each node's `disabled` flag. Mirrors n-menu `disabled-field`. Default 'disabled'.",
      },
      {
        name: 'breakpoint',
        type: "'xs' | 'sm' | 'md' | 'lg' | 'xl' | number",
        default: '—',
        desc: "Viewport breakpoint below which the menu auto-collapses. Mirrors Element Plus `el-menu` `breakpoint`. When the window inner-width is strictly less than the threshold, the menu collapses and emits `update:collapsed`. Set to `undefined` (default) to disable responsive collapse — `collapsed` is then purely consumer-driven. Accepts either a named token (Element Plus convention): - `'xs'` → 480px - `'sm'` → 768px - `'md'` → 992px - `'lg'` → 1200px - `'xl'` → 1920px or an explicit pixel number. On SSR / non-browser environments the resize listener is not installed and the prop is a no-op.",
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        default: 'false',
        desc: '仅在 `breakpoint` 生效时使用 —— 视口宽度在初始测量时低于阈值时的初始折叠态（受控用 `collapsed` + `v-model:collapsed`）',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnMenu.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:value',
        payload: '(value: string | number | null)',
        desc: '选中项变化时派发（`v-model:value`）。',
      },
      {
        name: 'update:expandedKeys',
        payload: '(keys: Array<string | number>)',
        desc: '展开的子菜单键变化时派发（`v-model:expandedKeys`）。',
      },
      {
        name: 'select',
        payload: '(value: string | number | null, item: SnMenuOption)',
        desc: '点击叶子菜单项时触发，回传其键与节点。',
      },
      {
        name: 'update:collapsed',
        payload: '(collapsed: boolean)',
        desc: '折叠状态翻转时派发；命中 `breakpoint` 时也会触发。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Menu 菜单 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Menu } from '@snui/vue-web';",
    chipCopy: "import { Menu } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Menu', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'waterfall', link: '/components/web/waterfall' },
    next: { text: 'breadcrumb', link: '/components/web/breadcrumb' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
