/**
 * Dropdown 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dropdownDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Dropdown' }],
  title: 'Dropdown',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '下拉菜单。click / hover 双触发，六档 placement + 视口翻转，滚动跟随。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dropdown',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Dropdown.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Dropdown } from '@snui/vue-web';
</script>

<template>
  <Dropdown />
</template>`,
  },
  demos: [
    { name: 'dropdown-web-basic', title: '基础用法', blurb: '点击触发 + options（含 divider）。' },
    { name: 'dropdown-web-hover', title: 'hover 触发', blurb: '300ms 关闭延迟，进面板取消。' },
    { name: 'dropdown-web-placement', title: '位置（placement）', blurb: '六档方位 + 翻转。' },
    {
      name: 'dropdown-web-submenu',
      title: '子菜单（children）',
      blurb: '右滑二级面板 + 键盘进出。',
    },
    {
      name: 'dropdown-web-context-menu',
      title: '右键菜单（contextMenu）',
      blurb: 'trigger=contextMenu：右键打开、锚定鼠标位置、图标行、select 关闭。',
    },
    {
      name: 'dropdown-web-content-slot',
      title: '插槽自定义（#content）',
      blurb: '#content 插槽接管面板：自定义图标行、危险操作行、页脚，close() 关闭。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnDropdownOption[]',
        default: '() => []',
        desc: "Menu options — action rows and `type: 'divider'` separators, mixed.",
      },
      {
        name: 'placement',
        type: 'SnDropdownPlacement',
        default: "'bottom'",
        desc: 'Where the panel anchors to the trigger (six bottom/top presets).',
      },
      {
        name: 'trigger',
        type: 'SnDropdownTrigger',
        default: "'hover'",
        desc: "What gesture opens the menu; the keyboard path works regardless. `'contextMenu'` opens on right-click anchored to the pointer.",
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用' },
      {
        name: 'size',
        type: 'SnDropdownSize',
        default: "'medium'",
        desc: 'Panel size preset — row height + font.',
      },
      {
        name: 'show',
        type: 'boolean | undefined',
        default: 'undefined',
        desc: '受控开关（v-model:show）',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Dropdown 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Dropdown } from '@snui/vue-web';",
    chipCopy: "import { Dropdown } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Dropdown', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tag', link: '/components/web/tag' },
    next: { text: 'popover', link: '/components/web/popover' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
