/**
 * KeyboardPanel 键盘面板（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-keyboard-panel.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const keyboardPanelDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'KeyboardPanel 键盘面板' },
  ],
  title: 'KeyboardPanel 键盘面板',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '底行始终占满三格（与 ' },
    { t: 'code', s: 'sn-keyboard' },
    { t: 'text', s: ' 同一契约）：' },
    { t: 'code', s: 'extraKey' },
    { t: 'text', s: ' 未提供的槽位渲染**收起键盘图标键**，在面板里点击发 ' },
    { t: 'code', s: 'collapse' },
    {
      t: 'text',
      s: ' 事件（没有面板可关——由宿主决定收起自己的容器还是切回系统输入），因此不会出现空位或超宽的 ',
    },
    { t: 'code', s: '0' },
    { t: 'text', s: '。头部仅在有内容时渲染：' },
    { t: 'code', s: 'title' },
    { t: 'text', s: ' 或 ' },
    { t: 'code', s: 'mode="car"' },
    { t: 'text', s: ' 的语言切换键；无关闭按钮。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-keyboard-panel',
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
    fileLabel: 'KeyboardPanel 键盘面板.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { KeyboardPanel } from '@snui/uni';
</script>

<template>
  <sn-keyboard-panel />
</template>`,
  },
  demos: [
    {
      name: 'keyboard-panel-mp-basic',
      title: '基础用法',
      blurb:
        '内嵌键盘面板：默认 / 小数点（extraKey=.）/ 车牌（mode=car），收起键发 collapse 事件。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'Current value (`v-model`).' },
      { name: 'mode', type: 'KeyboardMode', default: "'default'", desc: 'Layout preset.' },
      {
        name: 'maxlength',
        type: 'number',
        default: 'Number.POSITIVE_INFINITY',
        desc: '最大输入长度',
      },
      { name: 'showDeleteKey', type: 'boolean', default: 'true', desc: '是否显示删除键' },
      { name: 'randomKeyOrder', type: 'boolean', default: 'false', desc: '随机排序数字键' },
      {
        name: 'extraKey',
        type: 'string | string[] | undefined',
        default: 'undefined',
        desc: '额外的功能键。',
      },
      {
        name: 'carLang',
        type: 'CarKeyboardLang',
        default: "'zh'",
        desc: "Car-plate language (`v-model:car-lang`, `mode: 'car'`).",
      },
      { name: 'autoSwitchLang', type: 'boolean', default: 'false', desc: '选省份后自动切字母' },
      {
        name: 'title',
        type: 'string',
        default: "''",
        desc: 'Optional header title; the header renders only when it has content.',
      },
      { name: 'deleteText', type: 'string', default: "''", desc: 'Delete key label (aria).' },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'KeyboardPanel 键盘面板 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { KeyboardPanel } from '@snui/uni';",
    chipCopy: "import { KeyboardPanel } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-keyboard-panel', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-keyboard', link: '/components/uni/keyboard' },
    next: { text: 'sn-plate-input', link: '/components/uni/plate-input' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
