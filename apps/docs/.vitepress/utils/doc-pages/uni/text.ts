/**
 * Text 文本（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-text.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const textDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Text 文本' }],
  title: 'Text 文本',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '五种语义色、粗体、三种装饰线：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-text',
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
    fileLabel: 'Text 文本.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Text } from '@snui/uni';
</script>

<template>
  <sn-text />
</template>`,
  },
  demos: [
    {
      name: 'text-mp-basic',
      title: '基础用法',
      blurb:
        'type 五档（default / primary / success / warning / error）；bold 粗体；underline / line-through / overline 装饰线。',
    },
    {
      name: 'text-mp-mode',
      title: '模式格式化',
      blurb: 'phone / name 脱敏、price 千分位、date 归一化、call 拨号。',
    },
    {
      name: 'text-mp-lines',
      title: '多行截断（lines）',
      blurb: 'lines=1/2/3 超出截断并显示省略号，保证卡片高度一致。',
    },
    {
      name: 'text-mp-typography',
      title: '排版覆盖（size / lineHeight / color）',
      blurb: 'size 自定义字号；line-height 行高；color 文字颜色。',
    },
    {
      name: 'text-mp-custom',
      title: '自定义样式与插槽',
      blurb:
        'customClass / customStyle 追加到根节点；prefix / suffix / default 插槽渲染节点而非字符串。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'success' | 'warning' | 'error'",
        default: "'default'",
        desc: '主题类型：default / primary / success / warning / error。',
      },
      {
        name: 'text',
        type: 'string | number',
        default: "''",
        desc: '文本内容（`default` slot 优先）。',
      },
      {
        name: 'size',
        type: 'string',
        default: "''",
        desc: '字体大小（原样转发，可写 `28rpx` / `14px`）。',
      },
      {
        name: 'mode',
        type: 'TextMode',
        default: "'text'",
        desc: '文本处理模式：text / date / phone / name / price。',
      },
      {
        name: 'decoration',
        type: 'TextDecoration',
        default: "'none'",
        desc: '文本装饰：none / underline / line-through / overline。',
      },
      { name: 'call', type: 'boolean', default: 'false', desc: '`mode="phone"` 时点击是否拨号' },
      { name: 'bold', type: 'boolean', default: 'false', desc: '是否粗体' },
      {
        name: 'format',
        type: 'boolean',
        default: 'false',
        desc: '是否脱敏（仅 phone / name 生效）',
      },
      { name: 'color', type: 'string', default: "''", desc: '文本颜色（内联覆盖 `type`）。' },
      { name: 'prefix', type: 'string', default: "''", desc: '前缀内容（`prefix` slot 优先）。' },
      { name: 'suffix', type: 'string', default: "''", desc: '后缀内容（`suffix` slot 优先）。' },
      {
        name: 'lines',
        type: 'number',
        default: '0',
        desc: '展示行数，超出显示省略号；`0` 表示不截断',
      },
      { name: 'lineHeight', type: 'string', default: "''", desc: '文本行高（原样转发）。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义 inline style。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Text 文本 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Text } from '@snui/uni';",
    chipCopy: "import { Text } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-text', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Icon', link: '/components/uni/icon' },
    next: { text: 'Layout', link: '/components/uni/layout' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
