/**
 * Input · uni-app x（多端）（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-input.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const inputDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'Input · uni-app x（多端）' },
  ],
  title: 'Input · uni-app x（多端）',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '跨 uni-app x 多端的受控输入控件。rpx 几何，token 别名层驱动样式；H5 / 微信小程序 / App 全端共用一套 API。',
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
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Input · uni-app x（多端）.vue',
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
      name: 'input-mp-clearable',
      title: '清空按钮（clearable）',
      blurb: 'clearable × 按钮一键清空。',
    },
    {
      name: 'input-mp-count',
      title: '字数计数（showCount）',
      blurb: 'showCount / showWordLimit + maxlength 计数。',
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
      name: 'input-mp-border',
      title: '边框（border）',
      blurb: "border: 'all' | 'bottom' | 'none'（bordered alias）。",
    },
    {
      name: 'input-mp-bg',
      title: '背景（bg）',
      blurb: "bg: 'surface' | 'transparent' | 'soft'；customBg。",
    },
    {
      name: 'input-mp-align',
      title: '右对齐（alignRight）',
      blurb: '金额字段右对齐。',
    },
    {
      name: 'input-mp-compact',
      title: '紧凑行内形态（compact）',
      blurb: 'compact + border="bottom"：嵌进 Cell / FormItem 的行内形态。',
    },
    {
      name: 'input-mp-inputmode',
      title: '软键盘提示（inputmode）',
      blurb: 'inputmode 软键盘提示。',
    },
    {
      name: 'input-mp-confirm-type',
      title: '确认键文案（confirmType）',
      blurb: 'confirm-type：软键盘右下角按钮文案。',
    },
    {
      name: 'input-mp-keyboard-hold',
      title: '键盘保持与页面上推',
      blurb: 'hold-keyboard / adjust-position / always-embed。',
    },
    {
      name: 'input-mp-cursor-selection',
      title: '光标与选区',
      blurb: 'cursor / selection-start / selection-end。',
    },
    {
      name: 'input-mp-clear-trigger',
      title: '清空按钮细节（clearTrigger / focusWhenClear）',
      blurb: 'clearTrigger always / focus；focusWhenClear。',
    },
    {
      name: 'input-mp-focus',
      title: '自动聚焦（focus）',
      blurb: 'focus 挂载即聚焦。',
    },
    {
      name: 'input-mp-placeholder',
      title: '占位符样式（placeholderClass / placeholderStyle）',
      blurb: 'placeholderClass + placeholderStyle。',
    },
    {
      name: 'input-mp-word-limit',
      title: '字数统计别名（`showWordLimit`）',
      blurb: 'showWordLimit + maxlength；与 showCount 等价。',
    },
    {
      name: 'input-mp-cursor-spacing',
      title: '光标间距（cursorSpacing）',
      blurb: 'cursorSpacing：光标与键盘保持指定间距。',
    },
    {
      name: 'input-mp-confirm-hold',
      title: '确认键保持键盘（confirmHold）',
      blurb: 'confirmHold：点确认键不收起软键盘。',
    },
    {
      name: 'input-mp-composition',
      title: '输入合成（ignoreCompositionEvent）',
      blurb: 'ignoreCompositionEvent=false：合成期间也触发 input。',
    },
    {
      name: 'input-mp-enable-native',
      title: '原生输入（enableNative）',
      blurb: 'enableNative=false：支付宝小程序用模拟输入框。',
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
        desc: 'Class applied to the placeholder pseudo-element (uni-app x MP).',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读。' },
      { name: 'required', type: 'boolean', default: 'false', desc: '是否必填。' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '无障碍名称。' },
      { name: 'maxlength', type: 'number', default: '—', desc: '原生 maxlength。' },
      { name: 'minlength', type: 'number', default: '—', desc: '原生 minlength。' },
      { name: 'showCount', type: 'boolean', default: 'false', desc: '计数。' },
      { name: 'showWordLimit', type: 'boolean', default: 'false', desc: '`showCount` 的别名。' },
      {
        name: 'clearable',
        type: 'boolean',
        default: 'false',
        desc: '圆形清除按钮（token 色圆底 + surface 色 ×）。',
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
        desc: '× 点击后自动回焦字段（H5 直接聚焦；MP 键盘由用户点击唤起）。',
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
        desc: '是否按 CSS 图标处理。',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: 'Visual status. Driven by sn-form-item validation; manual override allowed.',
      },
      { name: 'min', type: 'number', default: '—', desc: '下界（仅数字输入）。' },
      { name: 'max', type: 'number', default: '—', desc: '上界（仅数字输入）。' },
      { name: 'step', type: 'number', default: '—', desc: '步长（仅数字输入）。' },
      { name: 'rows', type: 'number', default: '3', desc: 'textarea 行数。' },
      {
        name: 'border',
        type: "'all' | 'bottom' | 'none'",
        default: "'all'",
        desc: "Border preset (wot-ui parity). 3-way supersedes the legacy boolean. - `all`    — full 1rpx border on all sides (default). - `bottom` — only the bottom edge gets a border (inline form rows). - `none`   — no border at all. The older boolean `bordered` prop is kept as a deprecated alias — `bordered: true` === `border: 'all'`, `bordered: false` === `border: 'none'`.",
      },
      { name: 'bordered', type: 'boolean', default: 'true', desc: '是否显示边框。' },
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
      { name: 'alignRight', type: 'boolean', default: 'false', desc: '字段值右对齐。' },
      { name: 'compact', type: 'boolean', default: 'false', desc: '紧凑布局。' },
      { name: 'focus', type: 'boolean', default: 'false', desc: '挂载即 focus。' },
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
        desc: '错误态：`sn-input--error` class + `aria-invalid`（等价于 `status="error"` 的视觉）。',
      },
      {
        name: 'confirmType',
        type: "'send' | 'search' | 'next' | 'go' | 'done'",
        default: "'done'",
        desc: 'Soft-keyboard confirm button label. `send` | `search` | `next` | `go` | `done` (default `done`).',
      },
      { name: 'holdKeyboard', type: 'boolean', default: 'false', desc: '失焦后保持软键盘。' },
      {
        name: 'adjustPosition',
        type: 'boolean',
        default: 'true',
        desc: '键盘遮挡时自动滚动页面。',
      },
      {
        name: 'alwaysEmbed',
        type: 'boolean',
        default: 'false',
        desc: 'input 始终嵌入（不会因 detach 卸载）。',
      },
      { name: 'cursor', type: 'number', default: '-1', desc: '初始光标位置。`-1` 表示不设置。' },
      { name: 'selectionStart', type: 'number', default: '-1', desc: '初始选区起点。' },
      { name: 'selectionEnd', type: 'number', default: '-1', desc: '初始选区终点。' },
      { name: 'cursorSpacing', type: 'number', default: '0', desc: '光标与软键盘之间的距离。' },
      {
        name: 'confirmHold',
        type: 'boolean',
        default: 'false',
        desc: '点击键盘 confirm 按钮后保持键盘不收起。',
      },
      {
        name: 'ignoreCompositionEvent',
        type: 'boolean',
        default: 'true',
        desc: '忽略输入法合成事件（`false` 时合成期间也会触发 input）。',
      },
      {
        name: 'enableNative',
        type: 'boolean',
        default: 'true',
        desc: '支付宝小程序启用原生输入框。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Input · uni-app x（多端） 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Input } from '@snui/uni';",
    chipCopy: "import { Input } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-input', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Form', link: '/components/uni/form' },
    next: { text: 'Textarea', link: '/components/uni/textarea' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
