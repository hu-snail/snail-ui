/**
 * Watermark 水印 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const watermarkDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Watermark 水印' },
  ],
  title: 'Watermark 水印',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '在页面或指定区域上平铺文字 / 图片水印，用于标记版权、抑制截图扩散或标注敏感信息。',
    },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/watermark',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Watermark 水印.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Watermark } from '@snui/vue-web';
</script>

<template>
  <Watermark />
</template>`,
  },
  demos: [
    { name: 'watermark-web-basic', title: '基础水印', blurb: '基础水印' },
    { name: 'watermark-web-content', title: '多行文案', blurb: 'content 数组多行平铺。' },
    { name: 'watermark-web-cross', title: '交错瓦片', blurb: 'cross 相邻瓦片错开半个间距。' },
    { name: 'watermark-web-style', title: '样式定制', blurb: '样式定制' },
    { name: 'watermark-web-fullscreen', title: '全屏水印', blurb: '全屏水印' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'content',
        type: 'string | string[] | undefined',
        default: 'undefined',
        desc: '水印内容。',
      },
      {
        name: 'image',
        type: 'string | undefined',
        default: 'undefined',
        desc: '水印图片地址；设置后替代文字绘制',
      },
      {
        name: 'cross',
        type: 'boolean',
        default: 'false',
        desc: '相邻瓦片交错排布（错开半个瓦片）',
      },
      { name: 'fullscreen', type: 'boolean', default: 'false', desc: '覆盖整个视口而非包裹内容' },
      { name: 'fontSize', type: 'number', default: '16', desc: '文字大小（px）' },
      { name: 'lineHeight', type: 'number', default: '16', desc: '文字行高（px）' },
      { name: 'width', type: 'number', default: '128', desc: '瓦片宽度（px）' },
      { name: 'height', type: 'number', default: '64', desc: '瓦片高度（px）' },
      { name: 'rotate', type: 'number', default: '0', desc: '瓦片旋转角度（度）' },
      { name: 'x', type: 'number', default: '0', desc: '瓦片内水平偏移（px）' },
      { name: 'y', type: 'number', default: '0', desc: '瓦片内垂直偏移（px）' },
      { name: 'zIndex', type: 'number', default: '10', desc: '覆盖层层级' },
      { name: 'opacity', type: 'number', default: '0.5', desc: '覆盖层透明度（0–1）' },
      {
        name: 'fontFamily',
        type: 'string | undefined',
        default: 'undefined',
        desc: '水印文字字体',
      },
      {
        name: 'fontWeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '字重。',
      },
      {
        name: 'fontStyle',
        type: "'normal' | 'italic' | 'oblique' | undefined",
        default: 'undefined',
        desc: 'Text font style. Mirrors n-watermark `fontStyle`.',
      },
      { name: 'fontColor', type: 'string | undefined', default: 'undefined', desc: '水印文字颜色' },
      { name: 'background', type: 'string | undefined', default: 'undefined', desc: '瓦片背景色' },
      { name: 'grayscale', type: 'number', default: '0', desc: '覆盖层灰度（CSS filter，0–1）' },
      {
        name: 'blend',
        type: "CSSProperties['mixBlendMode'] | undefined",
        default: 'undefined',
        desc: 'CSS mix-blend-mode on the overlay. Mirrors n-watermark `blend`.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnWatermark.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'default', props: '—', desc: '被水印覆盖的内容；对齐 n-watermark `default`。' }],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Watermark 水印 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Watermark } from '@snui/vue-web';",
    chipCopy: "import { Watermark } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Watermark', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'heatmap', link: '/components/web/heatmap' },
    next: { text: 'ellipsis', link: '/components/web/ellipsis' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
