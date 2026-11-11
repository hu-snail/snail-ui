/** RichText · uni-app x (Mobile) (uni-app x) — English page data. Props from sn-rich-text.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const richTextDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Display Components' },
    { text: 'RichText · uni-app x (Mobile)' },
  ],
  title: 'RichText · uni-app x (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Hand the HTML to ' },
    { t: 'code', s: 'content' },
    { t: 'text', s: '; ' },
    { t: 'code', s: 'selectable' },
    { t: 'text', s: ' makes the text selectable where the platform allows.' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-rich-text',
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
    fileLabel: 'RichText · uni-app x (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { RichText } from '@snui/uni';
</script>

<template>
  <sn-rich-text />
</template>`,
  },
  demos: [
    { name: 'rich-text-mp-basic', title: 'Basic article', blurb: 'Basic article' },
    { name: 'rich-text-mp-images', title: 'Images and preview', blurb: 'Images and preview' },
    {
      name: 'rich-text-mp-links',
      title: 'Links and linked images',
      blurb: 'Links and linked images',
    },
    { name: 'rich-text-mp-table', title: 'Tables', blurb: 'Tables' },
    {
      name: 'rich-text-mp-media',
      title: 'Media and playback control',
      blurb: 'Media and playback control',
    },
    {
      name: 'rich-text-mp-style-map',
      title: 'Style maps (`tagStyle` / `classStyles`)',
      blurb: 'tagStyle injects styles per tag name; classStyles per class.',
    },
    {
      name: 'rich-text-mp-anchor',
      title: 'Heading anchors (`enableAnchor`)',
      blurb:
        'enableAnchor builds the heading outline; getHeadings() reads it, scrollToAnchor() jumps smoothly.',
    },
    {
      name: 'rich-text-mp-empty',
      title: 'Empty state slot',
      blurb: 'When content is empty the default slot renders the empty state.',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'content', type: 'string', default: "''", desc: 'HTML content to render.' },
      {
        name: 'loadingImage',
        type: 'string',
        default: "''",
        desc: 'Placeholder image shown while a content image loads.',
      },
      {
        name: 'errorImage',
        type: 'string',
        default: "''",
        desc: 'Placeholder image shown after a content image fails.',
      },
      {
        name: 'enableAnchor',
        type: 'boolean',
        default: 'false',
        desc: 'Build the heading outline and enable anchor targeting.',
      },
      {
        name: 'selectable',
        type: 'boolean',
        default: 'false',
        desc: 'Allow text selection where the platform supports it.',
      },
      {
        name: 'previewImage',
        type: 'boolean',
        default: 'true',
        desc: 'Preview a standalone image on tap (built-in WeChat-style viewer).',
      },
      {
        name: 'lazyLoad',
        type: 'boolean',
        default: 'false',
        desc: 'Let the platform lazy-load content images.',
      },
      {
        name: 'baseUrl',
        type: 'string',
        default: "''",
        desc: 'Absolute HTTP(S) base used to resolve relative resource addresses.',
      },
      {
        name: 'allowDataImage',
        type: 'boolean',
        default: 'false',
        desc: 'Accept ≤64KiB PNG/JPEG/GIF/WebP base64 images (never auto-previewed).',
      },
      {
        name: 'tagStyle',
        type: 'Record<string, string>',
        default: '() => ({})',
        desc: "Per-tag default style overrides (`{ p: 'text-align:center' }`).",
      },
      {
        name: 'classStyles',
        type: 'Record<string, string>',
        default: '() => ({})',
        desc: 'Class-name to inline-style map for classes used inside the content.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Root custom class.' },
      { name: 'customStyle', type: 'string', default: "''", desc: 'Root custom inline style.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'RichText · uni-app x (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { RichText } from '@snui/uni';",
    chipCopy: "import { RichText } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-rich-text', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Table', link: '/en/components/uni/table' },
    next: { text: 'Waterfall', link: '/en/components/uni/waterfall' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
