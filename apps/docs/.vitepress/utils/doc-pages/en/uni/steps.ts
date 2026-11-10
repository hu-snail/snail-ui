/** Steps · uni-app (uni-app) — English page data. Props from sn-step.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const stepsDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Steps · uni-app' },
  ],
  title: 'Steps · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'The ' },
    { t: 'code', s: 'node' },
    {
      t: 'text',
      s: ' slot replaces the default indicator wholesale (covering the step number and the status glyph), so a host can draw a badge, avatar or any shape; the connector line is container furniture and keeps rendering. The ',
    },
    { t: 'code', s: 'content' },
    { t: 'text', s: ' slot replaces the whole cont' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-steps',
    },
  ],
  features: [
    { text: 'rpx scales across devices', icon: 'layers' },
    { text: 'easycom auto-registration', icon: 'eco' },
    { text: 'Touch-optimised interaction', icon: 'touch' },
  ],
  usage: {
    hint: [
      {
        t: 'text',
        s: 'uni-app registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Steps · uni-app.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Steps } from '@snui/uni';
</script>

<template>
  <sn-steps />
</template>`,
  },
  demos: [
    {
      name: 'steps-mp-basic',
      title: 'Basic usage',
      blurb:
        'active sets the current step; earlier steps become finished, the current one process, later ones wait.',
    },
    {
      name: 'steps-mp-vertical',
      title: 'Vertical / dot / error states',
      blurb:
        'vertical stacks the steps; status=error overrides one step; dot renders dot indicators.',
    },
    {
      name: 'steps-mp-space',
      title: 'Spacing, centring and explicit status',
      blurb:
        'space=120rpx with align-center; explicit status overrides; icon / title / description slots.',
    },
    {
      name: 'steps-mp-node',
      title: 'Custom nodes',
      blurb:
        'the node slot replaces the default indicator; the content slot replaces title + description.',
    },
    {
      name: 'steps-mp-connector',
      title: 'Connector line type',
      blurb: 'connector set to solid / dashed / dotted; also applies in vertical layout.',
    },
    {
      name: 'steps-mp-icon',
      title: 'Icon configuration',
      blurb: 'icon name / iconData object / iconUrl image; iconSize tiers and iconColor override.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'title', type: 'string', default: "''", desc: '步骤标题，不传时显示默认文案。' },
      { name: 'description', type: 'string', default: "''", desc: '步骤描述。' },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: '步骤图标名（registry → 内置目录依次解析，未命中回退内置状态图标 / 序号）。',
      },
      {
        name: 'status',
        type: 'SnStepStatus | undefined',
        default: 'undefined',
        desc: '步骤状态：finished / process / error / wait（不传时由 active 推导）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'iconData',
        type: 'IconData | undefined',
        default: '—',
        desc: '图标数据对象（内置图标集 / 自定义 IconData），优先级最高。',
      },
      {
        name: 'iconUrl',
        type: 'string',
        default: "''",
        desc: '图标图片地址：渲染为 `<image>`，优先级低于 `iconData`、高于 `icon`。',
      },
      {
        name: 'iconSize',
        type: 'string | number | undefined',
        default: '—',
        desc: '图标尺寸：数字按 px；档位名（tiny/small/medium/large/xlarge）映射 `--sn-mp-icon-size-*`。',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: '图标颜色；请传 `var(--sn-mp-color-*)` token，默认 `currentColor`（跟随节点状态色）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Steps · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Steps } from '@snui/uni';",
    chipCopy: "import { Steps } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-steps', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tour', link: '/en/components/uni/tour' },
    next: { text: 'sn-collapse', link: '/en/components/uni/collapse' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
