/** ConfigProvider · uni-app (Mobile) (uni-app) — English page data. Props from sn-config-provider.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const configProviderDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Basic Components' },
    { text: 'ConfigProvider · uni-app (Mobile)' },
  ],
  title: 'ConfigProvider · uni-app (Mobile)',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'uni-app runs on mini programs and native App targets that have no ' },
    { t: 'code', s: 'document' },
    { t: 'text', s: ' and no ' },
    { t: 'code', s: ':root' },
    { t: 'text', s: ', so the web approach of putting ' },
    { t: 'code', s: '.dark' },
    { t: 'text', s: ' on ' },
    { t: 'code', s: '<html>' },
    {
      t: 'text',
      s: ' is unavailable. This component expresses the theme as a **class on its own root** (',
    },
    { t: 'code', s: '.sn-theme-dark' },
    { t: 'text', s: '); descendants re' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-config-provider',
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
    fileLabel: 'ConfigProvider · uni-app (Mobile).vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ConfigProvider } from '@snui/uni';
</script>

<template>
  <sn-config-provider />
</template>`,
  },
  demos: [
    {
      name: 'config-provider-mp-basic',
      title: 'Basic',
      blurb: 'Wrap a subtree to inherit the configuration; the rest of the page is untouched.',
    },
    {
      name: 'config-provider-mp-dark',
      title: 'Dark mode',
      blurb: 'theme set to dark switches only this subtree; siblings stay light.',
    },
    {
      name: 'config-provider-mp-vars',
      title: 'Theme variable overrides',
      blurb:
        'themeVars overrides the primary colour and surface; both key spellings are equivalent.',
    },
    {
      name: 'config-provider-mp-dark',
      title: 'Dark mode',
      blurb: 'Light and dark subtrees coexist on one page without affecting each other.',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'skin',
        type: 'string',
        default: "''",
        desc: "当前激活的 Style Pack 标识（kebab-case）。'default' 或空 = 无 skin class。",
      },
      {
        name: 'theme',
        type: 'ConfigProviderTheme',
        default: "'light'",
        desc: 'Theme mode for this subtree. Mirrors `wd-config-provider` theme.',
      },
      {
        name: 'themeVars',
        type: 'ConfigProviderThemeVars',
        default: '() => ({})',
        desc: 'Per-subtree CSS variable overrides. Mirrors `wd-config-provider` theme-vars.',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class on the root node. Mirrors `wd-config-provider` custom-class.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style on the root node. Mirrors `wd-config-provider` custom-style.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'ConfigProvider · uni-app (Mobile) ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { ConfigProvider } from '@snui/uni';",
    chipCopy: "import { ConfigProvider } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-config-provider', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-resize', link: '/en/components/uni/resize' },
    next: { text: 'sn-root-portal', link: '/en/components/uni/root-portal' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
