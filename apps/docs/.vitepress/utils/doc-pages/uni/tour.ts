/**
 * Tour 漫游式引导（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-tour.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tourDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Tour 漫游式引导' },
  ],
  title: 'Tour 漫游式引导',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tour',
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
    fileLabel: 'Tour 漫游式引导.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Tour } from '@snui/uni';
</script>

<template>
  <sn-tour />
</template>`,
  },
  demos: [
    {
      name: 'tour-mp-basic',
      title: '基础用法',
      blurb:
        'v-model 控制显隐；v-model:current 控制步骤索引；steps 提供步骤内容；最后一步按钮变为「完成」。',
    },
    {
      name: 'tour-mp-custom',
      title: '自定义文案与遮罩点击',
      blurb:
        'clickMaskNext 点击遮罩前进；prev-text / next-text / skip-text / finish-text 自定义按钮文案；border-radius 调整面板圆角。',
    },
    {
      name: 'tour-mp-mask',
      title: '蒙版开关与自定义面板',
      blurb:
        'mask=false 无蒙层；mask-color / duration / z-index；show-tour-buttons=false + footer 插槽自定义操作区。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean', default: 'false', desc: '是否显示引导组件' },
      { name: 'steps', type: 'TourStep[]', default: '() => []', desc: '引导步骤列表' },
      { name: 'current', type: 'number', default: '0', desc: '当前步骤索引' },
      { name: 'mask', type: 'boolean', default: 'true', desc: '是否显示蒙版' },
      {
        name: 'maskColor',
        type: 'string',
        default: "''",
        desc: '蒙版颜色（内联覆盖，空 = 令牌默认）。',
      },
      {
        name: 'offset',
        type: 'number',
        default: '20',
        desc: '面板与高亮区域的间距（未实现，见下）',
      },
      { name: 'duration', type: 'number', default: '300', desc: '动画时长（ms）' },
      { name: 'borderRadius', type: 'number', default: '4', desc: '高亮区域圆角' },
      { name: 'padding', type: 'number', default: '8', desc: '高亮区域内边距（未实现，见下）' },
      { name: 'prevText', type: 'string', default: "'上一步'", desc: '上一步按钮文案。' },
      { name: 'nextText', type: 'string', default: "'下一步'", desc: '下一步按钮文案。' },
      { name: 'skipText', type: 'string', default: "'跳过'", desc: '跳过按钮文案。' },
      { name: 'finishText', type: 'string', default: "'完成'", desc: '完成按钮文案。' },
      {
        name: 'bottomSafetyOffset',
        type: 'number',
        default: '100',
        desc: '底部安全偏移量（未实现，见下）',
      },
      {
        name: 'topSafetyOffset',
        type: 'number',
        default: '0',
        desc: '顶部安全偏移量（未实现，见下）',
      },
      {
        name: 'customNav',
        type: 'boolean',
        default: 'false',
        desc: '自定义导航栏模式（未实现，见下）',
      },
      {
        name: 'clickMaskNext',
        type: 'boolean',
        default: 'false',
        desc: '点击遮罩层是否进入下一步',
      },
      {
        name: 'highlightStyle',
        type: 'Record<string, string>',
        default: '() => ({})',
        desc: '默认高亮区域样式（未实现，见下）',
      },
      { name: 'zIndex', type: 'number | undefined', default: 'undefined', desc: '层级' },
      { name: 'showTourButtons', type: 'boolean', default: 'true', desc: '是否显示引导按钮' },
      {
        name: 'missingStrategy',
        type: 'TourMissingStrategy',
        default: "'stop'",
        desc: '目标元素缺失时的处理策略：skip / stop / hide。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Tour 漫游式引导 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Tour } from '@snui/uni';",
    chipCopy: "import { Tour } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tour', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-backtop', link: '/components/uni/backtop' },
    next: { text: 'sn-steps', link: '/components/uni/steps' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
