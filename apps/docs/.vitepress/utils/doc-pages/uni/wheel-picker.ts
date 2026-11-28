/**
 * WheelPicker 滚轮选择器（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-wheel-picker.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const wheelPickerDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'WheelPicker 滚轮选择器' },
  ],
  title: 'WheelPicker 滚轮选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-wheel-picker 行内 wheel 风格滚轮：选中行渲染圆角胶囊高亮带 + 远行淡出，滑动经过每一行档位触发短震动（App / 小程序，H5 静默跳过）。sn-picker-view 的 wheel 预设封装。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-wheel-picker',
    },
  ],
  features: [
    { text: 'wheel 胶囊高亮带', icon: 'layers' },
    { text: '滑动短震动（App / MP）', icon: 'touch' },
    { text: 'easycom 自动注册', icon: 'eco' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。',
      },
    ],
    fileLabel: 'WheelPicker 滚轮选择器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { WheelPicker } from '@snui/uni';
</script>

<template>
  <sn-wheel-picker />
</template>`,
  },
  demos: [
    {
      name: 'wheel-picker-mp-basic',
      title: '基础用法',
      blurb: '行内年份滚轮：胶囊高亮带 + 远行淡出 + 滑动短震动（默认开）。',
    },
    {
      name: 'wheel-picker-mp-icons',
      title: '图标行（`#option` 插槽）',
      blurb: '#option 插槽渲染图标 + 文字，选中行图标描虚线框、文字转主题色。',
    },
    {
      name: 'wheel-picker-mp-rich',
      title: '富内容行（`#option` 插槽）',
      blurb: '主标题 + 副标题双行布局，option.raw 透传业务字段。',
    },
    {
      name: 'wheel-picker-mp-band-mode',
      title: '带形态自定义（`wheelBand` / 渐变带）',
      blurb: 'shared 一整条横跨全部列 + 渐变带漆；perColumn 每列一条；圆角 / 内边距走 CSS 变量。',
    },
    {
      name: 'wheel-picker-mp-band-dots',
      title: '点阵纹理带（`#band` 插槽）',
      blurb: '#band 插槽替换高亮块漆面：浅蓝底 + 圆点阵列 + 描边。',
    },
    {
      name: 'wheel-picker-mp-band-soft',
      title: '整幅软色带（`#band` 插槽）',
      blurb: '零内边距 + 大圆角的整幅浅蓝带。',
    },
    {
      name: 'wheel-picker-mp-vibrate',
      title: '滑动震动开关（`vibrateShort`）',
      blurb: 'vibrateShort 默认 true；传 false 静音滑动。真机对比感受（App / 小程序）。',
    },
    {
      name: 'wheel-picker-mp-reminder',
      title: '提醒弹层组装（`sn-popup` 组合）',
      blurb: 'sn-popup + 自定义标题行 + wheel 滚轮 + 块级确认按钮，组装提醒时间弹层。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'PickerValue[]', default: '() => []', desc: '每列选中值（v-model）。' },
      { name: 'columns', type: 'PickerColumn[]', default: '() => []', desc: '列配置；cascade 时传树。' },
      { name: 'itemHeight', type: 'number', default: '44', desc: '单项高度（px 设计值）。' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: '可见行数（奇数居中）。' },
      { name: 'valueKey', type: 'string', default: "'value'", desc: '取值字段名。' },
      { name: 'labelKey', type: 'string', default: "'label'", desc: '显示字段名。' },
      { name: 'childrenKey', type: 'string', default: "'children'", desc: '级联子级字段名。' },
      { name: 'immediateChange', type: 'boolean', default: 'false', desc: '拖动过程中立即触发 change。' },
      { name: 'cascade', type: 'boolean', default: 'false', desc: '把 columns 当树处理。' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用滚轮。' },
      {
        name: 'vibrateShort',
        type: 'boolean',
        default: 'true',
        desc: '滑动短震动（additive）：每档位触发 `uni.vibrateShort({ type: "light" })`，App / 小程序生效；点选与程序赋值不震。',
      },
      {
        name: 'wheelBand',
        type: "'shared' | 'perColumn'",
        default: "'shared'",
        desc: "高亮带形态（additive）：shared 横跨全部列一整条带；perColumn 每列一条。带漆 / 圆角 / 内边距经 `--sn-picker-view-wheel-band` / `-wheel-radius` / `-wheel-inset` 自定义。",
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点 class。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点 style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'WheelPicker 滚轮选择器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { WheelPicker } from '@snui/uni';",
    chipCopy: "import { WheelPicker } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-wheel-picker', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'PickerView', link: '/components/uni/picker-view' },
    next: { text: 'SelectPicker', link: '/components/uni/select-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
