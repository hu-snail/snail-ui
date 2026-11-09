/**
 * Anchor 锚点 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const anchorDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Anchor 锚点' },
  ],
  title: 'Anchor 锚点',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'code', s: 'SnAnchor' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'SnAnchorLink' },
    { t: 'text', s: ' 做页内导航：滚动时高亮当前所在章节的链接，点击链接平滑跳到对应章节。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/anchor',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Anchor 锚点.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Anchor } from '@snui/vue-web';
</script>

<template>
  <Anchor />
</template>`,
  },
  demos: [
    { name: 'anchor-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'anchor-web-ignore-gap', title: '高亮判定', blurb: '高亮判定' },
    { name: 'anchor-web-affix', title: '吸附固定', blurb: '吸附固定' },
    { name: 'anchor-web-scrollto', title: '程序化跳转', blurb: '程序化跳转' },
    { name: 'anchor-web-variants', title: '样式变体', blurb: '样式变体' },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'block' | 'rail'",
        default: "'rail'",
        desc: '`rail` shows a vertical rail with a sliding bar; `block` is a plain list. Mirrors n-anchor `type`.',
      },
      {
        name: 'showRail',
        type: 'boolean',
        default: 'true',
        desc: 'Show the rail (ignored when `type` is `block`). Mirrors `showRail`.',
      },
      {
        name: 'showBackground',
        type: 'boolean',
        default: 'true',
        desc: 'Show the highlight behind the active link. Mirrors `showBackground`.',
      },
      {
        name: 'bound',
        type: 'number',
        default: '12',
        desc: 'Distance from the scroll target top at which a section becomes active. Mirrors n-anchor `bound`.',
      },
      {
        name: 'internalScrollable',
        type: 'boolean',
        default: 'false',
        desc: 'Accept for API parity; content is rendered in normal flow.',
      },
      {
        name: 'ignoreGap',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the previous link active while a section is scrolled out of view, instead of activating the fully-scrolled-past link.',
      },
      {
        name: 'affix',
        type: 'boolean',
        default: 'false',
        desc: 'Wrap the anchor in SnAffix so it stays in view. Mirrors `affix`.',
      },
      {
        name: 'top',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      {
        name: 'bottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      {
        name: 'triggerTop',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      {
        name: 'triggerBottom',
        type: 'number',
        default: 'undefined as any',
        desc: 'Forwarded to SnAffix when `affix` is true.',
      },
      { name: 'offsetTop', type: 'number', default: 'undefined as any', desc: '顶部偏移量。' },
      { name: 'offsetBottom', type: 'number', default: 'undefined as any', desc: '底部偏移量。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Anchor 锚点 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Anchor } from '@snui/vue-web';",
    chipCopy: "import { Anchor } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Anchor', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'affix', link: '/components/web/affix' },
    next: { text: 'back-top', link: '/components/web/back-top' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
