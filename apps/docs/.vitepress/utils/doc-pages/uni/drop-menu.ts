/**
 * DropMenu 下拉菜单（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-drop-menu.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const dropMenuDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'DropMenu 下拉菜单' },
  ],
  title: 'DropMenu 下拉菜单',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '每个选项支持三种图标来源，优先级 ' },
    { t: 'code', s: 'iconData' },
    { t: 'text', s: '(对象) > ' },
    { t: 'code', s: 'iconUrl' },
    { t: 'text', s: '(图片) > ' },
    { t: 'code', s: 'icon' },
    { t: 'text', s: '(名称解析链)；' },
    { t: 'code', s: 'iconSize' },
    { t: 'text', s: ' 控制选项与勾选图标尺寸（档位名 tiny/small/medium/large/xlarge 映射 ' },
    { t: 'code', s: '--sn-mp-icon-size-*' },
    { t: 'text', s: '，不设置时取 medium 档），选中项勾选图标由 ' },
    { t: 'code', s: 'iconName' },
    { t: 'text', s: ' 指定：' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/uni',
      copy: 'pnpm add @snui/uni',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-drop-menu',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'DropMenu 下拉菜单.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DropMenu } from '@snui/uni';
</script>

<template>
  <sn-drop-menu />
</template>`,
  },
  demos: [
    {
      name: 'drop-menu-mp-basic',
      title: '基础用法',
      blurb: '排序菜单，含一个禁用项，选中后回报 selectedItem。',
    },
    {
      name: 'drop-menu-mp-direction',
      title: '展开方向',
      blurb: '向下 / 向上展开对比，箭头随方向切换。',
    },
    {
      name: 'drop-menu-mp-icon',
      title: '选项图标',
      blurb:
        '选项图标三来源对比：IconData 对象、名称解析、图片地址；iconSize 档位；选中态勾选图标。',
    },
    {
      name: 'drop-menu-mp-guard',
      title: '开关拦截 / 字段重命名',
      blurb: '向上展开 + beforeToggle 拦截前两次点击 + 自定义字段名。',
    },
    {
      name: 'drop-menu-mp-panel',
      title: '无蒙层 / 面板高度 / 自定义面板',
      blurb:
        'modal=false 无蒙层；close-on-click-modal=false；popup-height 限制高度；custom-popup-class / custom-popup-style；disabled；default 插槽。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number',
        default: "''",
        desc: 'Current selected value (v-model).',
      },
      { name: 'options', type: 'SnDropMenuOption[]', default: '() => []', desc: 'Option rows.' },
      {
        name: 'direction',
        type: 'DropDirection',
        default: "'down'",
        desc: 'Menu expansion direction.',
      },
      {
        name: 'zIndex',
        type: 'number',
        default: '12',
        desc: 'Stacking level of the scrim + panel.',
      },
      {
        name: 'modal',
        type: 'boolean',
        default: 'true',
        desc: 'Render the scrim behind the panel.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Close the menu when the scrim is tapped.',
      },
      {
        name: 'duration',
        type: 'number',
        default: 'DEFAULT_DURATION',
        desc: 'Open / close animation duration in ms.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable the whole menu — taps are ignored.',
      },
      {
        name: 'iconName',
        type: 'string',
        default: "'check'",
        desc: "Icon name of the selected row's glyph (registry / built-in catalogue).",
      },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Menu title; when set it replaces the selected option label in the bar.',
      },
      {
        name: 'icon',
        type: 'string',
        default: "'caret-down'",
        desc: 'Icon name of the bar arrow (registry / built-in catalogue).',
      },
      {
        name: 'iconSize',
        type: 'string | number',
        default: "''",
        desc: 'Glyph scale for the arrow, the selected-row check and every option icon: a named tier (`tiny|small|medium|large|xlarge`) maps to `--sn-mp-icon-size-*`, a number stays px, any other string passes through. Empty = the `medium` tier.',
      },
      {
        name: 'beforeToggle',
        type: 'DropMenuBeforeToggle',
        default: '—',
        desc: 'Guard called before the menu toggles; `false` blocks the toggle.',
      },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Field name of the option value.',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Field name of the option label.',
      },
      { name: 'tipKey', type: 'string', default: "'tip'", desc: 'Field name of the option tip.' },
      {
        name: 'customPopupClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the option list panel.',
      },
      {
        name: 'customPopupStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the option list panel.',
      },
      {
        name: 'popupHeight',
        type: 'string',
        default: "''",
        desc: 'Height of the option list panel; empty = at most 80% of the viewport.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for `wd-drop-menu` parity, NOT implemented — miniprogram has no portal host, so the panel cannot leave the page's document flow.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DropMenu 下拉菜单 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DropMenu } from '@snui/uni';",
    chipCopy: "import { DropMenu } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-drop-menu', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-grid', link: '/components/uni/grid' },
    next: { text: 'sn-tooltip', link: '/components/uni/tooltip' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
