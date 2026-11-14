/**
 * Segment 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const segmentDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '基础组件 Basic' },
    { text: 'Segment 分段控制器' },
  ],
  title: 'Segment 分段控制器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '分段控制器，在一小组互斥选项中选择一个值（对齐 heroui ',
    },
    { t: 'code', s: 'Segment' },
    { t: 'text', s: '）。滑块指示器带滑动动画，支持三档尺寸、ghost 变体、整体/单项禁用与分隔线。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/segment',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'SnSegment.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ref } from 'vue';
import { SnSegment } from '@snui/vue-web';

const view = ref('dashboard');
const views = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'analytics', label: 'Analytics' },
];
</script>

<template>
  <SnSegment v-model="view" :options="views" />
</template>`,
  },
  demos: [
    { name: 'segment-web-basic', title: '基础用法', blurb: 'options 数组声明选项，v-model 双向绑定。' },
    {
      name: 'segment-web-controlled',
      title: '受控用法（Controlled）',
      blurb: '外部状态驱动 modelValue，也可随时改写选中值（heroui selectedKey 语义）。',
    },
    {
      name: 'segment-web-sizes',
      title: '尺寸（size）',
      blurb: "sm / md / lg 三档，总高 28 / 32 / 40 px，对齐 heroui size 预设。",
    },
    {
      name: 'segment-web-ghost',
      title: '变体（variant）',
      blurb: 'ghost：透明外壳 + 主题色指示器；default：浅灰外壳 + 白色滑块。',
    },
    {
      name: 'segment-web-separators',
      title: '分隔线（separators）',
      blurb: '相邻未选中项之间渲染分隔线，紧邻选中项的两侧自动隐藏（heroui Segment.Separator 语义）。',
    },
    {
      name: 'segment-web-disabled',
      title: '禁用（disabled）',
      blurb: 'disabled 禁用整组；单项 disabled 只禁用该项，键盘导航会跳过它。',
    },
    {
      name: 'segment-web-icons',
      title: '图标（icon）',
      blurb: 'icon 传图标组件即可渲染纯图标项（主题切换器模式），aria-label 由 ariaLabel 提供。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'options',
        type: 'SnSegmentOption[]',
        default: '—',
        desc: '选项列表：{ value, label?, icon?, disabled?, ariaLabel? }（heroui Segment.Item 列表）。',
      },
      {
        name: 'modelValue',
        type: 'string | number',
        default: 'undefined',
        desc: '选中键（v-model）；不传则非受控（heroui selectedKey）。',
      },
      {
        name: 'defaultValue',
        type: 'string | number',
        default: 'undefined',
        desc: '非受控模式的初始键（heroui defaultSelectedKey）。',
      },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg'",
        default: "'md'",
        desc: '尺寸，总高 28 / 32 / 40 px（heroui size）。',
      },
      {
        name: 'variant',
        type: "'default' | 'ghost'",
        default: "'default'",
        desc: '视觉变体（heroui variant）。',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: '禁用整组（heroui isDisabled）。',
      },
      {
        name: 'separators',
        type: 'boolean',
        default: 'false',
        desc: '渲染分隔线；紧邻选中项的自动隐藏（heroui Segment.Separator）。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnSegment.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(key: string | number)',
        desc: '选中变化时触发，支持 v-model（heroui onSelectionChange）。',
      },
      {
        name: 'change',
        payload: '(key: string | number)',
        desc: '选中变化时触发（监听器风格别名）。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '无插槽 —— 选项由 ' },
      { t: 'code', s: 'options' },
      { t: 'text', s: ' 声明（icon 接组件、label 接文本）；自定义项标记不在设计范围内。' },
    ],
    rows: [],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Segment 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { SnSegment } from '@snui/vue-web';",
    chipCopy: "import { SnSegment } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Segment', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'radiogroup', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'tag', link: '/components/web/tag' },
    next: { text: 'dropdown', link: '/components/web/dropdown' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
