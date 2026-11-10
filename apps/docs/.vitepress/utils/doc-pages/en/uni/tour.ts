/** Tour · uni-app (uni-app) — English page data. Props from sn-tour.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const tourDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Navigation Components' },
    { text: 'Tour · uni-app' },
  ],
  title: 'Tour · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'The component follows the easycom convention, so **no import is needed in a template**:',
    },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-tour',
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
    fileLabel: 'Tour · uni-app.vue',
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
      title: 'Basic usage',
      blurb:
        "v-model toggles the tour; v-model:current tracks the step; steps supplies the copy; the last step's button becomes Finish.",
    },
    {
      name: 'tour-mp-custom',
      title: 'Custom copy and mask taps',
      blurb:
        'clickMaskNext advances on a mask tap; prev-text / next-text / skip-text / finish-text customise the labels; border-radius rounds the panel.',
    },
    {
      name: 'tour-mp-mask',
      title: 'Mask (`mask` / `mask-color`)',
      blurb: 'mask=false leaves no scrim; mask-color overrides the scrim background.',
    },
    {
      name: 'tour-mp-panel-slot',
      title: 'Custom panel & buttons',
      blurb:
        'show-tour-buttons=false hides the default buttons; #footer renders the actions; #default replaces the panel body.',
    },
    {
      name: 'tour-mp-z-index',
      title: 'Stacking & duration',
      blurb: 'duration overrides the animation length; z-index lifts the layer; custom-class on the root.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'boolean', default: 'false', desc: '是否显示引导组件。' },
      { name: 'steps', type: 'TourStep[]', default: '() => []', desc: '引导步骤列表。' },
      { name: 'current', type: 'number', default: '0', desc: '当前步骤索引。' },
      { name: 'mask', type: 'boolean', default: 'true', desc: '是否显示蒙版。' },
      {
        name: 'maskColor',
        type: 'string',
        default: "''",
        desc: '蒙版颜色（内联覆盖，空 = 令牌默认）。',
      },
      { name: 'offset', type: 'number', default: '20', desc: '引导面板与高亮区域的间距。' },
      { name: 'duration', type: 'number', default: '300', desc: '动画时长，单位毫秒。' },
      { name: 'borderRadius', type: 'number', default: '4', desc: '高亮区域圆角。' },
      { name: 'padding', type: 'number', default: '8', desc: '高亮区域内边距。' },
      { name: 'prevText', type: 'string', default: "'上一步'", desc: '上一步按钮文案。' },
      { name: 'nextText', type: 'string', default: "'下一步'", desc: '下一步按钮文案。' },
      { name: 'skipText', type: 'string', default: "'跳过'", desc: '跳过按钮文案。' },
      { name: 'finishText', type: 'string', default: "'完成'", desc: '完成按钮文案。' },
      {
        name: 'bottomSafetyOffset',
        type: 'number',
        default: '100',
        desc: '底部安全偏移量，用于滚动计算。',
      },
      {
        name: 'topSafetyOffset',
        type: 'number',
        default: '0',
        desc: '顶部安全偏移量，用于滚动计算。',
      },
      { name: 'customNav', type: 'boolean', default: 'false', desc: '是否启用自定义导航栏模式。' },
      {
        name: 'clickMaskNext',
        type: 'boolean',
        default: 'false',
        desc: '点击遮罩层是否进入下一步。',
      },
      {
        name: 'highlightStyle',
        type: 'Record<string, string>',
        default: '() => ({})',
        desc: '默认高亮区域样式。',
      },
      { name: 'zIndex', type: 'number | undefined', default: 'undefined', desc: '层级。' },
      { name: 'showTourButtons', type: 'boolean', default: 'true', desc: '是否显示引导按钮。' },
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Tour · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Tour } from '@snui/uni';",
    chipCopy: "import { Tour } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-tour', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-backtop', link: '/en/components/uni/backtop' },
    next: { text: 'sn-steps', link: '/en/components/uni/steps' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
