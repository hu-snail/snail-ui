/**
 * PlateInput 车牌输入框（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-plate-input.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const plateInputDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'PlateInput 车牌输入框' },
  ],
  title: 'PlateInput 车牌输入框',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '点击方框行弹起车牌键盘：省份键盘选完第一个字自动切到字母/数字布局，长按删除键连删；再点一次字段或点完成收起；清空后下一块车牌重新从省份开始。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-plate-input',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'PlateInput 车牌输入框.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PlateInput } from '@snui/uni';
</script>

<template>
  <sn-plate-input />
</template>`,
  },
  demos: [
    {
      name: 'plate-input-mp-basic',
      title: '基础用法',
      blurb:
        "点击格子弹起无蒙层车牌键盘（sn-keyboard mode='car'）：省份→字母/数字自动切换、长按删除连删，再点一次字段或点完成收起。",
    },
    {
      name: 'plate-input-mp-new-energy',
      title: '新能源车牌（`maxlength=8`）',
      blurb: 'maxlength=8 的新能源车牌（8 格）。',
    },
    {
      name: 'plate-input-mp-disabled',
      title: '禁用态（`disabled`）',
      blurb: 'disabled 时点击不再弹键盘，输入被冻结。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string',
        default: "''",
        desc: 'Current value (`v-model`), e.g. `京A12345`.',
      },
      { name: 'maxlength', type: 'number', default: '7', desc: '方框数量（普通车牌 7，新能源 8）' },
      { name: 'title', type: 'string', default: "'请输入车牌号'", desc: 'Keyboard title.' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '冻结字段，点击不再弹起键盘' },
      { name: 'visible', type: 'boolean | undefined', default: 'undefined', desc: '是否显示。' },
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
    copy: 'PlateInput 车牌输入框 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { PlateInput } from '@snui/uni';",
    chipCopy: "import { PlateInput } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-plate-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'KeyboardPanel', link: '/components/uni/keyboard-panel' },
    next: { text: 'InputNumber', link: '/components/uni/input-number' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
