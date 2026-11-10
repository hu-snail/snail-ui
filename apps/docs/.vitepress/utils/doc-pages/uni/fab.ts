/**
 * Fab 悬浮按钮（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-fab.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const fabDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Fab 悬浮按钮' }],
  title: 'Fab 悬浮按钮',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '触发图标有两条轨道：' },
    { t: 'code', s: 'inactive-icon' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'active-icon' },
    { t: 'text', s: ' 传注册名（' },
    { t: 'code', s: 'plus' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'close' },
    { t: 'text', s: ' 内置，其余经 ' },
    { t: 'code', s: 'registerSnIcons()' },
    { t: 'text', s: ' 注册）；或用 ' },
    { t: 'code', s: 'trigger' },
    { t: 'text', s: ' 插槽直接渲染图标对象。触发按钮内的图标尺寸跟随 ' },
    { t: 'code', s: '--sn-mp-icon-size-*' },
    { t: 'text', s: ' 档位缩放。' },
    { t: 'code', s: 'type' },
    { t: 'text', s: ' 提供 5 档主题色。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-fab',
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
    fileLabel: 'Fab 悬浮按钮.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Fab } from '@snui/uni';
</script>

<template>
  <sn-fab />
</template>`,
  },
  demos: [
    {
      name: 'fab-mp-basic',
      title: '基础用法',
      blurb: '右下角悬浮按钮，向上滑出三个「图标 + 文字」胶囊动作项，点选后展示反馈并收起。',
    },
    {
      name: 'fab-mp-direction',
      title: '弹出方向',
      blurb:
        'up（右下）/ down（左上）/ left（右中）/ right（左中）四个方向各自展开图标动作项，点选记录方向反馈。',
    },
    {
      name: 'fab-mp-fan',
      title: '扇形展开（`mode="fan"`）',
      blurb:
        '底部居中的正中间扇形 + 右下 / 左上的斜扇形（均为图标气泡，扇骨式展开），点动作项自动收起并记录反馈。',
    },
    {
      name: 'fab-mp-drag',
      title: '拖动（`draggable`）',
      blurb: '按住右下角按钮拖动，松手自动收进屏幕安全区，拖完仍可展开动作项。',
    },
    {
      name: 'fab-mp-position',
      title: '位置与主题',
      blurb: '左上 / 右上 / 左下 / 底部居中四个锚点各配一组胶囊动作项，方向与锚点联动。',
    },
    {
      name: 'fab-mp-expandable',
      title: '仅点击不展开（expandable）',
      blurb: 'expandable=false 点触发按钮不展开动作项，只抛 click（计数反馈）。',
    },
    {
      name: 'fab-mp-disabled',
      title: '禁用（disabled）',
      blurb: 'disabled 拦截一切交互，触发按钮半透明。',
    },
    {
      name: 'fab-mp-trigger-icons',
      title: '触发图标双轨',
      blurb:
        'icon-name 轨道（inactive-icon / active-icon，经 registerSnIcons 解析）与 trigger 插槽 IconData 轨道并排演示。',
    },
    {
      name: 'fab-mp-type',
      title: '主题色（type）',
      blurb: '色板实时切换 FAB 的 type（5 档主题色），点动作项反馈并收起。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'active', type: 'boolean', default: 'false', desc: '是否激活（`v-model:active`）' },
      { name: 'type', type: 'FabType', default: "'primary'", desc: 'Color theme.' },
      { name: 'position', type: 'FabPosition', default: "'right-bottom'", desc: 'Anchor preset.' },
      { name: 'draggable', type: 'boolean', default: 'false', desc: '按钮能否拖动' },
      {
        name: 'direction',
        type: 'FabDirection',
        default: "'up'",
        desc: 'Menu expansion direction (`up` / `down` alias `top` / `bottom`).',
      },
      {
        name: 'mode',
        type: 'FabMode',
        default: "'line'",
        desc: 'Expansion shape: stack (`line`, wd-fab 1:1) or arc (`fan`, additive).',
      },
      {
        name: 'actions',
        type: 'SnFabAction[]',
        default: '() => []',
        desc: '扇形模式动作项（fan 模式下忽略插槽）',
      },
      {
        name: 'fanRadius',
        type: 'number',
        default: '96',
        desc: '扇形半径 px（按钮中心到动作项中心）',
      },
      {
        name: 'fanMotion',
        type: 'FabMotion',
        default: "'bloom'",
        desc: 'Fan expansion motion: radial bloom or folding-fan arc sweep.',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '是否禁用' },
      {
        name: 'inactiveIcon',
        type: 'string',
        default: "'plus'",
        desc: 'Icon while collapsed (registry name).',
      },
      {
        name: 'activeIcon',
        type: 'string',
        default: "'close'",
        desc: 'Icon while expanded (registry name).',
      },
      { name: 'zIndex', type: 'number', default: '99', desc: '自定义悬浮按钮层级' },
      { name: 'gap', type: 'SnFabGap', default: '() => ({ top: 16', desc: '与可视区域边缘的间距' },
      {
        name: 'expandable',
        type: 'boolean',
        default: 'true',
        desc: '点击时是否展开菜单；`false` 时抛 `click`',
      },
      {
        name: 'top',
        type: 'number | undefined',
        default: 'undefined',
        desc: '距顶部间距（覆盖 `gap.top`）',
      },
      {
        name: 'bottom',
        type: 'number | undefined',
        default: 'undefined',
        desc: '距底部间距（覆盖 `gap.bottom`）',
      },
      {
        name: 'left',
        type: 'number | undefined',
        default: 'undefined',
        desc: '距左边间距（覆盖 `gap.left`）',
      },
      {
        name: 'right',
        type: 'number | undefined',
        default: 'undefined',
        desc: '距右边间距（覆盖 `gap.right`）',
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
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Fab 悬浮按钮 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Fab } from '@snui/uni';",
    chipCopy: "import { Fab } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-fab', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-cell', link: '/components/uni/cell' },
    next: { text: 'sn-transition', link: '/components/uni/transition' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
