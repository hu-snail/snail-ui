/**
 * Keyboard 虚拟键盘（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-keyboard.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const keyboardDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'Keyboard 虚拟键盘' },
  ],
  title: 'Keyboard 虚拟键盘',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '底行始终占满三格：' },
    { t: 'code', s: 'extraKey' },
    { t: 'text', s: ' 未提供的槽位渲染**收起键盘图标键**（点击等同关闭按钮，发 ' },
    { t: 'code', s: 'close' },
    { t: 'text', s: '），因此不会出现空位或超宽的 ' },
    { t: 'code', s: '0' },
    { t: 'text', s: '；头部关闭按钮在无文案时以圆形 chevron chip 呈现。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-keyboard',
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
    fileLabel: 'Keyboard 虚拟键盘.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Keyboard } from '@snui/uni';
</script>

<template>
  <sn-keyboard />
</template>`,
  },
  demos: [
    {
      name: 'keyboard-mp-basic',
      title: '基础用法',
      blurb: '默认数字键盘：底行 [收起][0][⌫]，maxlength 限长；搭配只读输入框使用。',
    },
    {
      name: 'keyboard-mp-decimal',
      title: '小数点（`extraKey="."`）',
      blurb: 'extraKey=. 占据底行左槽，用于金额等小数输入。',
    },
    {
      name: 'keyboard-mp-idcard',
      title: '身份证（`extraKey="X"`）',
      blurb: 'extraKey=X 提供末位校验码键位，maxlength=18 输入证件号。',
    },
    {
      name: 'keyboard-mp-car-custom',
      title: '车牌与自定义模式（`mode` / `extraKey` / `autoSwitchLang`）',
      blurb:
        'mode=car 出车牌键盘，autoSwitchLang 在选中省份后自动切字母；mode=custom 右侧加大号操作列，extraKey 追加额外键。',
    },
    {
      name: 'keyboard-mp-labels',
      title:
        '键位文案与删除键（`deleteText` / `closeText` / `showDeleteKey` / `randomKeyOrder` / `zIndex`）',
      blurb: 'deleteText / closeText；showDeleteKey=false；randomKeyOrder；zIndex。',
    },
    {
      name: 'keyboard-mp-scrim',
      title:
        '遮罩与行为（`modal` / `hideOnClickOutside` / `lockScroll` / `closeButtonLoading` / `safeAreaInsetBottom` / `rootPortal` / `custom*`）',
      blurb:
        'modal；hideOnClickOutside=false；lockScroll=false；closeButtonLoading；safeAreaInsetBottom；rootPortal；customClass / customStyle。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Visibility (`v-model:visible`).',
      },
      { name: 'modelValue', type: 'string', default: "''", desc: 'Current value (`v-model`).' },
      { name: 'title', type: 'string', default: "''", desc: 'Keyboard title.' },
      { name: 'mode', type: 'KeyboardMode', default: "'default'", desc: 'Layout preset.' },
      { name: 'zIndex', type: 'number', default: '100', desc: '层级' },
      {
        name: 'maxlength',
        type: 'number',
        default: 'Number.POSITIVE_INFINITY',
        desc: 'Maximum value length.',
      },
      {
        name: 'showDeleteKey',
        type: 'boolean',
        default: 'true',
        desc: 'Render the delete key (default / car layouts).',
      },
      {
        name: 'randomKeyOrder',
        type: 'boolean',
        default: 'false',
        desc: 'Shuffle the digit keys.',
      },
      {
        name: 'closeText',
        type: 'string',
        default: "''",
        desc: 'Close button label (header, or the custom-mode action column).',
      },
      { name: 'deleteText', type: 'string', default: "''", desc: 'Delete key label.' },
      {
        name: 'closeButtonLoading',
        type: 'boolean',
        default: 'false',
        desc: 'Show a spinner in the close button while pending.',
      },
      { name: 'modal', type: 'boolean', default: 'false', desc: 'Render an opaque scrim.' },
      {
        name: 'hideOnClickOutside',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping outside the panel closes the keyboard.',
      },
      {
        name: 'lockScroll',
        type: 'boolean',
        default: 'true',
        desc: 'Intercept touchmove on the scrim so the page behind cannot scroll.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the keyboard for the device safe area.',
      },
      {
        name: 'extraKey',
        type: 'string | string[] | undefined',
        default: 'undefined',
        desc: 'Extra key(s) appended to the digit grid.',
      },
      {
        name: 'carLang',
        type: 'CarKeyboardLang',
        default: "'zh'",
        desc: "Car-plate language (`v-model:car-lang`, `mode: 'car'`).",
      },
      {
        name: 'autoSwitchLang',
        type: 'boolean',
        default: 'false',
        desc: 'Auto-switch the car language once the province is picked.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the panel.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the panel cannot leave the page's document flow. Forwarded to `sn-popup`, which declares the same parity-only prop.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Keyboard 虚拟键盘 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Keyboard } from '@snui/uni';",
    chipCopy: "import { Keyboard } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-keyboard', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-code-input', link: '/components/uni/code-input' },
    next: { text: 'sn-keyboard-panel', link: '/components/uni/keyboard-panel' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
