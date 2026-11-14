/**
 * Cascader 级联选择器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-cascader.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const cascaderDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'Cascader 级联选择器' },
  ],
  title: 'Cascader 级联选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '静态模式：逐级 tap 下钻，点中叶子即确认并关闭。触发入口常用 ' },
    { t: 'code', s: 'sn-cell' },
    { t: 'text', s: ' 卡片行承载「字段名 + 已选文案」。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-cascader',
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
    fileLabel: 'Cascader 级联选择器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Cascader } from '@snui/uni';
</script>

<template>
  <sn-cascader />
</template>`,
  },
  demos: [
    {
      name: 'cascader-mp-basic',
      title: '基础用法',
      blurb: '静态模式：逐级 tap 下钻，点中叶子即确认并关闭；sn-cell card 行触发弹层。',
    },
    {
      name: 'cascader-mp-card',
      title: '卡片形态（`card`）',
      blurb: '卡片形态（card）与默认列表形态对照；卡片形态下每行独立成卡。',
    },
    {
      name: 'cascader-mp-strict-lazy',
      title: '任意级可选（`checkStrictly`）',
      blurb: 'checkStrictly 允许确认任意层级，并显示确认按钮；确认后返回该层级的值。',
    },
    {
      name: 'cascader-mp-disabled',
      title: '禁用选项（`disabled`）',
      blurb: '选项级 disabled：整行弱化、不响应点击；整枝禁用与单个叶子禁用同时生效。',
    },
    {
      name: 'cascader-mp-fields',
      title: '字段映射（valueKey 等）',
      blurb: 'valueKey / textKey / childrenKey / tipKey 字段映射。',
    },
    {
      name: 'cascader-mp-lazy-load',
      title: '异步加载（lazyLoad）',
      blurb: 'lazyLoad + isLeafKey 按需请求子级；checkStrictly。',
    },
    {
      name: 'cascader-mp-before-confirm',
      title: '确认拦截（beforeConfirm）',
      blurb: 'beforeConfirm 拦截，守卫结论由 sn-cell 行回报。',
    },
    {
      name: 'cascader-mp-indicator',
      title: '指示条形态（lineTheme）',
      blurb: 'lineTheme underline / text / dot，lineWidth / lineHeight 控制指示条几何。',
    },
    {
      name: 'cascader-mp-sheet-chrome',
      title: '弹层配置（遮罩 / 层级 / 自定义）',
      blurb:
        'closeOnClickModal=false；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'CascaderValue | CascaderValue[] | undefined',
        default: 'undefined',
        desc: '绑定值。',
      },
      { name: 'visible', type: 'boolean', default: 'false', desc: '弹层显隐' },
      { name: 'options', type: 'CascaderOption[]', default: '() => []', desc: '层级选项树' },
      { name: 'title', type: 'string', default: "''", desc: 'Toolbar title.' },
      { name: 'checkStrictly', type: 'boolean', default: 'false', desc: '任意级可选' },
      {
        name: 'confirmText',
        type: 'string',
        default: "'确认'",
        desc: 'Confirm button label (only rendered in `checkStrictly` / lazy mode).',
      },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Option key holding the value.',
      },
      { name: 'textKey', type: 'string', default: "'text'", desc: 'Option key holding the text.' },
      {
        name: 'childrenKey',
        type: 'string',
        default: "'children'",
        desc: 'Option key holding the children.',
      },
      { name: 'tipKey', type: 'string', default: "'tip'", desc: 'Option key holding the tip.' },
      {
        name: 'isLeafKey',
        type: 'string',
        default: "'isLeaf'",
        desc: 'Option key marking a leaf in lazy mode.',
      },
      {
        name: 'lazyLoad',
        type: 'CascaderLazyLoad | undefined',
        default: 'undefined',
        desc: '异步加载回调 `(option, tabIndex, resolve)`',
      },
      { name: 'closeOnClickModal', type: 'boolean', default: 'true', desc: '点击遮罩关闭' },
      { name: 'zIndex', type: 'number', default: '15', desc: '层级。' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: '为设备安全区留出内边距。',
      },
      {
        name: 'lineWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '活动指示条宽度，纯数字按 rpx 设计值处理。',
      },
      {
        name: 'lineHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '活动指示条高度，纯数字按 rpx 设计值处理。',
      },
      {
        name: 'lineTheme',
        type: "'normal' | 'text' | 'underline' | 'dot'",
        default: "'normal'",
        desc: 'Indicator placement style.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Inline style on the sheet.' },
      {
        name: 'rootPortal',
        type: 'boolean',
        default: 'false',
        desc: "Accepted for wot-ui parity, NOT implemented — miniprogram has no portal host, so the layer cannot leave the page's document flow.",
      },
      {
        name: 'card',
        type: 'boolean',
        default: 'false',
        desc: '卡片形态（**AUI 追加**）：每个选项渲染为独立圆角卡片',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Cascader 级联选择器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Cascader } from '@snui/uni';",
    chipCopy: "import { Cascader } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-cascader', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'SelectPicker', link: '/components/uni/select-picker' },
    next: { text: 'Calendar', link: '/components/uni/calendar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
