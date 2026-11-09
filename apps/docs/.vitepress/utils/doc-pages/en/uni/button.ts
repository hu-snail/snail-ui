/** Button (uni-app) — English page data. Props from sn-button.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const buttonDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Basic Components' }, { text: 'Button' }],
  title: 'Button',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: 'Conforms to easycom — **no import needed in templates**:' }],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-button',
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
    fileLabel: 'Button.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Button } from '@snui/uni';
</script>

<template>
  <sn-button />
</template>`,
  },
  demos: [
    {
      name: 'button-mp-basic',
      title: 'Basic usage',
      blurb: '6 semantic types: primary / success / warning / danger / info / default.',
    },
    {
      name: 'button-mp-size',
      title: 'Sizes',
      blurb: 'Three height tiers, mobile usually only needs these three.',
    },
    {
      name: 'button-mp-shape',
      title: 'Block & round',
      blurb: 'block spans the parent width; round applies pill-shaped corners.',
    },
    {
      name: 'button-mp-state',
      title: 'States',
      blurb:
        'disabled fully disables; loading shows spinner and is unclickable; can manually toggle loading state.',
    },
    {
      name: 'button-mp-variant',
      title: 'Variant: base / plain / dashed / soft / subtle / text',
      blurb:
        '6 variant tiers: base (filled), plain (transparent + colored border), dashed (dashed border), soft (soft bg + colored text), subtle (very light bg), text (text-only).',
    },
    {
      name: 'button-mp-cell',
      title: 'Cell: hover / fill / menu',
      blurb: 'Cell list: hover (active bg), fill (always gray bg), menu (transparent + no radius).',
    },
    {
      name: 'button-mp-custom',
      title: 'Custom background / color / loading color',
      blurb:
        'bgColor / color overrides; loadingColor changes spinner color; loadingSize changes rpx size.',
    },
    {
      name: 'button-mp-iconfont',
      title: 'Iconfont icons (`icon` / `class-prefix` / `css-icon`)',
      blurb:
        'icon + class-prefix build {prefix}-{icon}; a string css-icon renders verbatim; the boolean form applies both class names.',
    },
    {
      name: 'button-mp-loading-props',
      title: 'loading config and hairline (`loading-props` / `hairline`)',
      blurb: 'loading-props color / size; the flat props win; hairline next to the loading state.',
    },
    {
      name: 'button-mp-open-type',
      title: 'Open-type (MP-only)',
      blurb:
        'open-type: share / feedback / launchApp / contact / getUserInfo / openSetting / favorite / chooseAvatar.',
    },
    {
      name: 'button-mp-mp-open-type',
      title:
        'Extension attributes (`session-from` / `send-message-*` / `app-parameter` / `scope` …)',
      blurb:
        'open-type extension attributes: contact session config, three lang values, app-parameter, scope, hover-stop-propagation.',
    },
    {
      name: 'button-mp-hover',
      title: 'hover-class / hover-start-time / hover-stay-time',
      blurb:
        'Custom press-feedback class; hover-start-time how long before triggering; hover-stay-time how long after release before removing.',
    },
    {
      name: 'button-mp-form-type',
      title: 'formType (MP-only)',
      blurb: "form-type='submit' submits form; form-type='reset' resets form.",
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'type',
        type: "'primary' | 'default' | 'success' | 'warning' | 'danger' | 'info'",
        default: '—',
        desc: 'Visual variant. Drives background / border / text color.',
      },
      { name: 'size', type: "'small' | 'medium' | 'large'", default: '—', desc: 'Size preset.' },
      {
        name: 'block',
        type: 'boolean',
        default: '—',
        desc: 'Block (full-width) layout — common on mobile.',
      },
      { name: 'round', type: 'boolean', default: '—', desc: 'Pill shape.' },
      { name: 'disabled', type: 'boolean', default: '—', desc: 'Disabled. Skips click.' },
      {
        name: 'loading',
        type: 'boolean',
        default: '—',
        desc: 'Loading. Shows spinner. Skips click.',
      },
      {
        name: 'hairline',
        type: 'boolean',
        default: '—',
        desc: 'Show hairline border (default type only).',
      },
      {
        name: 'feedback',
        type: 'boolean',
        default: '—',
        desc: 'Tap feedback (active state opacity).',
      },
      {
        name: 'plain',
        type: 'boolean',
        default: '—',
        desc: "Plain / low-key style. Drives the variant — for wot-ui parity this maps to `variant: 'plain'` automatically when `type === 'primary'`.",
      },
      {
        name: 'variant',
        type: "'base' | 'plain' | 'dashed' | 'soft' | 'subtle' | 'text'",
        default: '—',
        desc: 'wot-ui style variant. Mirrors `wd-button variant`.',
      },
      {
        name: 'cell',
        type: "'hover' | 'fill' | 'menu' | undefined",
        default: '—',
        desc: 'Cell-style preset. Mirrors wd-button cell.',
      },
      { name: 'loadingColor', type: 'string', default: '—', desc: 'Custom loading spinner color.' },
      {
        name: 'loadingSize',
        type: 'number | string',
        default: '—',
        desc: 'Custom loading spinner size (rpx).',
      },
      {
        name: 'hoverClass',
        type: 'string',
        default: '—',
        desc: 'Override the press-feedback class applied while touched (`hover-class`).',
      },
      {
        name: 'hoverStartTime',
        type: 'number',
        default: '—',
        desc: 'Hover start time (ms, uni-app MP).',
      },
      {
        name: 'hoverStayTime',
        type: 'number',
        default: '—',
        desc: 'Hover stay time (ms, uni-app MP).',
      },
      {
        name: 'formType',
        type: "'submit' | 'reset' | undefined",
        default: '—',
        desc: 'Form submission type.',
      },
      { name: 'customClass', type: 'string', default: '—', desc: 'Class on the root element.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: '—',
        desc: 'Inline style on the root element.',
      },
      { name: 'bgColor', type: 'string', default: '—', desc: 'Custom background color override.' },
      { name: 'color', type: 'string', default: '—', desc: 'Custom text/border color override.' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Accessible label override.' },
      {
        name: 'iconData',
        type: 'IconData',
        default: '—',
        desc: 'Icon data (frozen `{ viewBox, paths }` object) to render before the default slot.',
      },
      {
        name: 'iconName',
        type: 'string',
        default: '—',
        desc: 'Icon name resolved via the sn-icon registry (populated by `registerSnIcons()` at app bootstrap).',
      },
      {
        name: 'iconSize',
        type: 'number | string',
        default: '—',
        desc: "Icon size forwarded to the embedded sn-icon. Bare numbers and unitless numeric strings are rpx design-canvas values (small 28 / medium 32 / large 40 auto-fit); strings with a unit (`'32rpx'` / `'1.5em'`) pass through verbatim.",
      },
      {
        name: 'circle',
        type: 'boolean',
        default: '—',
        desc: '圆形按钮（icon-only）：宽高相等、全圆角，配合内置图标使用。',
      },
      {
        name: 'icon',
        type: 'string',
        default: '—',
        desc: 'Iconfont glyph name — wot-ui\'s `icon` prop (`wd-button icon="check"`). Distinct from `iconName` (SVG registry lookup): this resolves through the iconfont class convention, which is what wot-ui\'s docs teach.',
      },
      {
        name: 'classPrefix',
        type: 'string',
        default: '—',
        desc: 'Class-name prefix for the iconfont glyph. Mirrors wot-ui `class-prefix`.',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: '—',
        desc: 'CSS icon class (or `true` to also apply the raw name). Mirrors `css-icon`.',
      },
      { name: 'color', type: 'string', default: '—', desc: 'Custom text/border color override.' },
      { name: 'size', type: 'number | string', default: '—', desc: 'Size preset.' },
      { name: 'text', type: 'string', default: '—', desc: 'text' },
      {
        name: 'hoverStopPropagation',
        type: 'boolean',
        default: '—',
        desc: 'Prevent the press state from bubbling to ancestors (uni-app MP).',
      },
      {
        name: 'lang',
        type: "'zh_CN' | 'zh_TW' | 'en' | ''",
        default: '—',
        desc: '`open-type=contact` session language: `zh_CN` / `zh_TW` / `en`.',
      },
      {
        name: 'sessionFrom',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` session source.',
      },
      {
        name: 'sendMessageTitle',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` message card title.',
      },
      {
        name: 'sendMessagePath',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` message card path.',
      },
      {
        name: 'sendMessageImg',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` message card image.',
      },
      {
        name: 'appParameter',
        type: 'string',
        default: '—',
        desc: '`open-type=launchApp` launch parameters.',
      },
      {
        name: 'showMessageCard',
        type: 'boolean',
        default: '—',
        desc: '`open-type=contact` — show the session message card.',
      },
      { name: 'buttonId', type: 'string', default: '—', desc: 'Unique button identifier.' },
      {
        name: 'scope',
        type: "'phoneNumber' | 'userInfo' | ''",
        default: '—',
        desc: 'Alipay authorization scope (`open-type=getAuthorize`).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Button ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Button } from '@snui/uni';",
    chipCopy: "import { Button } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-button', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    next: { text: 'sn-icon', link: '/en/components/uni/icon' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
