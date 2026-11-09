/**
 * Input · uni-app（多端）（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-input.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const inputDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'Input · uni-app（多端）' },
  ],
  title: 'Input · uni-app（多端）',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '跨 uni-app 多端的受控输入控件。rpx 几何，token 别名层驱动样式；H5 / 微信小程序 / App 全端共用一套 API。',
    },
  ],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-input',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Input · uni-app（多端）.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Input } from '@snui/uni';
</script>

<template>
  <sn-input />
</template>`,
  },
  demos: [
    { name: 'input-mp-basic', title: '基础用法', blurb: 'v-model 双向绑定。' },
    {
      name: 'input-mp-types',
      title: '类型（type）',
      blurb:
        '16 种 type：text / password / email / number / digit / idcard / nickname / safe-password / tel / url / search / textarea。',
    },
    { name: 'input-mp-sizes', title: '尺寸（size）', blurb: '3 档尺寸（rpx：56/72/88）。' },
    { name: 'input-mp-status', title: '状态（status）', blurb: 'default / error / warning。' },
    {
      name: 'input-mp-states',
      title: '表单态（disabled / readonly / required）',
      blurb: 'disabled / readonly / required + aria-*。',
    },
    {
      name: 'input-mp-clearable-count',
      title: '清空 + 计数（`clearable` / `showCount`）',
      blurb:
        "clearable × 按钮；clearTrigger: 'always' | 'focus'；showCount / showWordLimit + maxlength 计数。",
    },
    {
      name: 'input-mp-password-toggle',
      title: '密码显示切换（`showPassword`）',
      blurb: "type='password' + showPassword 渲染眼睛切换。",
    },
    {
      name: 'input-mp-prefix-suffix',
      title: '前缀 / 后缀图标（`prefixIcon` / `suffixIcon`）',
      blurb:
        'prefixIcon / suffixIcon 经 SnIcon 解析链渲染；iconPrefix / iconSuffix / cssIcon 三种 css class 模式。',
    },
    {
      name: 'input-mp-radius',
      title: '圆角（`radius`）',
      blurb:
        "radius: 'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square'，档位映射 --sn-mp-radius-*。",
    },
    {
      name: 'input-mp-bordered-bg-radius',
      title: '边框 / 背景（`border` / `bg`）',
      blurb:
        "border: 'all' | 'bottom' | 'none'（bordered alias）；bg: 'surface' | 'transparent' | 'soft'；customBg。",
    },
    {
      name: 'input-mp-align-compact',
      title: '右对齐 / 紧凑 / 输入模式（`alignRight` / `compact` / `inputmode`）',
      blurb: '金额字段右对齐；compact 紧凑模式；inputmode 软键盘提示。',
    },
    {
      name: 'input-mp-runtime',
      title: '小程序运行时专属属性（MP-only）',
      blurb:
        'confirm-type / hold-keyboard / adjust-position / always-embed / cursor / selection-start / selection-end / placeholder-style / placeholder-class。',
    },
    {
      name: 'input-mp-clear-focus',
      title:
        '清空与聚焦细节（`clearTrigger` / `focusWhenClear` / `focus` / `placeholderClass` / `placeholderStyle`）',
      blurb:
        'clearTrigger always / focus；focusWhenClear；focus 挂载即聚焦；placeholderClass + placeholderStyle。',
    },
    {
      name: 'input-mp-word-limit',
      title: '字数统计别名（`showWordLimit`）',
      blurb: 'showWordLimit + maxlength；与 showCount 等价。',
    },
    {
      name: 'input-mp-native-attrs',
      title:
        '原生键盘属性（`cursorSpacing` / `confirmHold` / `ignoreCompositionEvent` / `enableNative`）',
      blurb: 'cursorSpacing；confirmHold；ignoreCompositionEvent=false；enableNative=false。',
    },
    {
      name: 'input-mp-custom-class',
      title: '自定义样式挂载点（`customClass` / `customStyle` / `customInputClass`）',
      blurb: 'customClass + customStyle 挂根节点；customInputClass 挂内层原生输入框。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'string | number',
        default: "''",
        desc: "Bound value. Coerced to `number` when type='number' / 'digit'.",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Mobile-first size preset. Drives rpx height + font-size.',
      },
      { name: 'placeholder', type: 'string', default: "''", desc: 'Placeholder text.' },
      {
        name: 'placeholderStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style declarations for the placeholder pseudo-element.',
      },
      {
        name: 'placeholderClass',
        type: 'string',
        default: "''",
        desc: 'Class applied to the placeholder pseudo-element (uni-app MP).',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction. Native `disabled` attribute is set.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — value is visible but not editable.',
      },
      {
        name: 'required',
        type: 'boolean',
        default: 'false',
        desc: 'Required for form submission. Renders `aria-required`.',
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: 'Accessible label.' },
      {
        name: 'maxlength',
        type: 'number',
        default: '—',
        desc: 'Max character length (cross-end: most MP vendors honor this).',
      },
      { name: 'minlength', type: 'number', default: '—', desc: 'Min character length.' },
      {
        name: 'showCount',
        type: 'boolean',
        default: 'false',
        desc: 'Show the running `current / max` counter (right-aligned). Aliased as `showWordLimit` for wot-ui parity.',
      },
      {
        name: 'showWordLimit',
        type: 'boolean',
        default: 'false',
        desc: 'wot-ui alias for `showCount`.',
      },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: 'Show × button to clear value.',
      },
      {
        name: 'clearTrigger',
        type: "'always' | 'focus'",
        default: "'always'",
        desc: 'When the clear button is shown. `always` shows whenever there is a value; `focus` shows only when the input is focused. Mirrors `wd-input` clear-trigger.',
      },
      {
        name: 'focusWhenClear',
        type: 'boolean',
        default: 'true',
        desc: 'After clicking the clear button, refocus the input.',
      },
      {
        name: 'showPassword',
        type: 'boolean',
        default: 'false',
        desc: "Render an inline eye-toggle that flips between password and text. Applies only when `type === 'password'`.",
      },
      {
        name: 'prefixIcon',
        type: 'string',
        default: "''",
        desc: 'Front-icon name. Resolved via the local sn-icon registry.',
      },
      {
        name: 'suffixIcon',
        type: 'string',
        default: "''",
        desc: 'Tail-icon name. Resolved via the local sn-icon registry.',
      },
      {
        name: 'iconPrefix',
        type: 'string',
        default: "''",
        desc: 'CSS class names for the prefix icon (when prefixIcon is treated as class).',
      },
      {
        name: 'iconSuffix',
        type: 'string',
        default: "''",
        desc: 'CSS class names for the suffix icon (when suffixIcon is treated as class).',
      },
      {
        name: 'cssIcon',
        type: 'boolean | string',
        default: 'false',
        desc: 'CSS-icon mode. When `true`, `prefixIcon` / `suffixIcon` are treated as class names applied directly to a span (rather than resolved through the sn-icon registry).',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Driven by sn-form-item validation; manual override allowed.',
      },
      { name: 'min', type: 'number', default: '—', desc: 'Lower bound (numeric input only).' },
      { name: 'max', type: 'number', default: '—', desc: 'Upper bound (numeric input only).' },
      { name: 'step', type: 'number', default: '—', desc: 'Step (numeric input only).' },
      { name: 'rows', type: 'number', default: '3', desc: 'Textarea row count (textarea only).' },
      {
        name: 'border',
        type: "'all' | 'bottom' | 'none'",
        default: "'all'",
        desc: "Border preset (wot-ui parity). 3-way supersedes the legacy boolean. - `all`    — full 1rpx border on all sides (default). - `bottom` — only the bottom edge gets a border (inline form rows). - `none`   — no border at all. The older boolean `bordered` prop is kept as a deprecated alias — `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.",
      },
      { name: 'bordered', type: 'boolean', default: 'true', desc: 'bordered' },
      {
        name: 'bg',
        type: "'surface' | 'transparent' | 'soft'",
        default: "'surface'",
        desc: 'Background tone. `surface` (default) uses the elevated card color; `transparent` removes the background for inputs that sit directly on a colored banner; `soft` is a subtle secondary fill.',
      },
      {
        name: 'customBg',
        type: 'string',
        default: "''",
        desc: 'Custom hex / rbg / named color overrides the bg tone.',
      },
      {
        name: 'radius',
        type: "'default' | 'sm' | 'lg' | 'xl' | 'pill' | 'square'",
        default: "'default'",
        desc: 'Border-radius preset (AUI additive). Tiers map to the mp radius tokens; `default` keeps `--sn-mp-input-radius`: - `sm`      — `--sn-mp-radius-sm` (8rpx) - `default` — `--sn-mp-input-radius` (12rpx) - `lg`      — `--sn-mp-radius-lg` (16rpx) - `xl`      — `--sn-mp-radius-xl` (24rpx) - `pill`    — fully rounded field - `square`  — right-angled',
      },
      {
        name: 'alignRight',
        type: 'boolean',
        default: 'false',
        desc: 'Right-align the value (numeric / amount fields).',
      },
      {
        name: 'compact',
        type: 'boolean',
        default: 'false',
        desc: 'Compact layout — strips default padding / background so the field nests cleanly inside FormItem / Cell. Mirrors `wd-input` compact.',
      },
      { name: 'focus', type: 'boolean', default: 'false', desc: 'Initial focus on mount.' },
      {
        name: 'inputmode',
        type: "'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'",
        default: "'text'",
        desc: 'HTML inputmode hint.',
      },
      {
        name: 'customInputClass',
        type: 'string',
        default: "''",
        desc: 'Class on the inner native `<input>` / `<textarea>`.',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
      {
        name: 'error',
        type: 'boolean',
        default: 'false',
        desc: 'Error state (`wd-input` `error`). Drives the `sn-input--error` class and `aria-invalid`. Independent of the legacy 3-way `status` prop — either one turns the error chrome on.',
      },
      {
        name: 'confirmType',
        type: "'send' | 'search' | 'next' | 'go' | 'done'",
        default: "'done'",
        desc: 'Soft-keyboard confirm button label. `send` | `search` | `next` | `go` | `done` (default `done`).',
      },
      {
        name: 'holdKeyboard',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the soft keyboard up after the field blurs.',
      },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-scroll the page when keyboard covers the field.',
      },
      {
        name: 'alwaysEmbed',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the input mounted even when detached (uni-app MP opt-in).',
      },
      { name: 'cursor', type: 'number', default: '-1', desc: 'Initial caret position.' },
      {
        name: 'selectionStart',
        type: 'number',
        default: '-1',
        desc: 'Initial selection range start.',
      },
      { name: 'selectionEnd', type: 'number', default: '-1', desc: 'Initial selection range end.' },
      {
        name: 'cursorSpacing',
        type: 'number',
        default: '0',
        desc: 'Distance kept between the caret and the soft keyboard (px).',
      },
      {
        name: 'confirmHold',
        type: 'boolean',
        default: 'false',
        desc: 'Keep the keyboard up when the confirm key is tapped.',
      },
      {
        name: 'ignoreCompositionEvent',
        type: 'boolean',
        default: 'true',
        desc: 'Ignore IME composition events. `false` re-enables composition events and lets `input` fire mid-composition (uni-app MP native attribute).',
      },
      {
        name: 'enableNative',
        type: 'boolean',
        default: 'true',
        desc: 'Alipay MP: render the native input widget instead of the simulated one — `false` avoids the page shifting when the keyboard opens.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Input · uni-app（多端） 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Input } from '@snui/uni';",
    chipCopy: "import { Input } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-form', link: '/components/uni/form' },
    next: { text: 'sn-textarea', link: '/components/uni/textarea' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
