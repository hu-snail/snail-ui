/** Cascader · uni-app x (uni-app x) — English page data. Props from sn-cascader.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const cascaderDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Cascader · uni-app x' },
  ],
  title: 'Cascader · uni-app x',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'Static mode: drill level by level; tapping a leaf confirms and closes. The entry point is usually a ',
    },
    { t: 'code', s: 'sn-cell' },
    { t: 'text', s: ' card row carrying "field name + current selection".' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-cascader',
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
        s: 'uni-app x registers components through easycom; an explicit import is only needed when you opt out.',
      },
    ],
    fileLabel: 'Cascader · uni-app x.vue',
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
      title: 'Basic usage',
      blurb:
        'Static mode: drill level by level; tapping a leaf confirms and closes; a sn-cell card row opens the sheet.',
    },
    {
      name: 'cascader-mp-card',
      title: 'Card look (`card`)',
      blurb:
        'Card look (`card`) beside the default list look; in card mode every row is a self-contained card.',
    },
    {
      name: 'cascader-mp-strict-lazy',
      title: 'Any level (`checkStrictly`)',
      blurb:
        "checkStrictly lets any level be confirmed and shows the confirm button; the emitted value is that level's value.",
    },
    {
      name: 'cascader-mp-disabled',
      title: 'Disabled options (`disabled`)',
      blurb:
        'Option-level disabled: the row reads dimmed and ignores taps; a disabled branch and a disabled leaf both hold.',
    },
    {
      name: 'cascader-mp-fields',
      title: 'Field mapping (valueKey etc.)',
      blurb: 'valueKey / textKey / childrenKey / tipKey mapping.',
    },
    {
      name: 'cascader-mp-lazy-load',
      title: 'Lazy loading (lazyLoad)',
      blurb: 'lazyLoad + isLeafKey fetch children on demand; checkStrictly.',
    },
    {
      name: 'cascader-mp-before-confirm',
      title: 'Confirm veto (beforeConfirm)',
      blurb: 'beforeConfirm veto with its verdict reported by a sn-cell row.',
    },
    {
      name: 'cascader-mp-indicator',
      title: 'Indicator shape (lineTheme)',
      blurb: 'lineTheme underline / text / dot, with lineWidth / lineHeight geometry.',
    },
    {
      name: 'cascader-mp-sheet-chrome',
      title: 'Sheet settings (scrim / stacking / custom)',
      blurb:
        'closeOnClickModal=false; safeAreaInsetBottom; zIndex; rootPortal; customClass / customStyle.',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'CascaderValue | CascaderValue[] | undefined',
        default: 'undefined',
        desc: 'Selected value — a leaf value, or a path array in lazy mode.',
      },
      {
        name: 'visible',
        type: 'boolean',
        default: 'false',
        desc: 'Sheet visibility (`v-model:visible`).',
      },
      { name: 'options', type: 'CascaderOption[]', default: '() => []', desc: 'Option tree.' },
      { name: 'title', type: 'string', default: "''", desc: 'Toolbar title.' },
      {
        name: 'checkStrictly',
        type: 'boolean',
        default: 'false',
        desc: 'Allow confirming any level, not just leaves.',
      },
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
        desc: 'Lazy-load hook.',
      },
      {
        name: 'closeOnClickModal',
        type: 'boolean',
        default: 'true',
        desc: 'Tapping the mask closes the sheet.',
      },
      { name: 'zIndex', type: 'number', default: '15', desc: 'Stacking level.' },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'true',
        desc: 'Pad the sheet for the device safe area.',
      },
      {
        name: 'lineWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Width of the active indicator bar. A number is an rpx design value.',
      },
      {
        name: 'lineHeight',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: 'Height of the active indicator bar. A number is an rpx design value.',
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
        desc: '卡片形态：弹层内每个选项自成一张卡片（圆角 / 描边 / 阴影，行间走 token 间距）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Cascader · uni-app x ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Cascader } from '@snui/uni';",
    chipCopy: "import { Cascader } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-cascader', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'SelectPicker', link: '/en/components/uni/select-picker' },
    next: { text: 'Calendar', link: '/en/components/uni/calendar' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
