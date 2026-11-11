/**
 * Button 按钮（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-button.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const buttonDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Button 按钮' }],
  title: 'Button 按钮',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [{ t: 'text', s: '如需显式 import：' }],
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-button',
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
    fileLabel: 'Button 按钮.vue',
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
      title: '基础用法',
      blurb: '6 种语义类型：primary / success / warning / danger / info / default。',
    },
    { name: 'button-mp-size', title: '尺寸', blurb: '三档高度。' },
    {
      name: 'button-mp-block',
      title: '块级按钮（block）',
      blurb: 'block 占满父容器宽度。',
    },
    {
      name: 'button-mp-round',
      title: '圆角按钮（round）',
      blurb: 'round 应用胶囊形圆角。',
    },
    {
      name: 'button-mp-state',
      title: '状态',
      blurb: 'disabled 完全禁用；loading 显示 spinner 且不可点击；可手动触发 loading 状态。',
    },
    {
      name: 'button-mp-variant',
      title: '变体（`variant`：`base` / `plain` / `dashed` / `soft` / `subtle` / `text`）',
      blurb:
        'variant 6 档：base 填充实心、plain 透明描边、dashed 虚线、soft 浅色填充、subtle 极淡灰底、text 纯文字。',
    },
    {
      name: 'button-mp-cell',
      title: 'Cell 列表化（`cell`：`hover` / `fill` / `menu`）',
      blurb: 'Cell 列表化：hover 按下灰底、fill 常驻灰底、menu 透明无圆角。',
    },
    {
      name: 'button-mp-color-override',
      title: '内联颜色覆盖（bgColor / color）',
      blurb:
        'bgColor / color 内联覆盖语义色（优先级高于类型 token）；附带 customClass / customStyle 根节点样式。',
    },
    {
      name: 'button-mp-loading-color',
      title: '加载 spinner 定制（loadingColor / loadingSize）',
      blurb: 'loadingColor 改 spinner 颜色；loadingSize 改 rpx 尺寸。',
    },
    {
      name: 'button-mp-icon-button',
      title: '字体图标（`icon` / `class-prefix` / `css-icon`）',
      blurb:
        'icon + class-prefix 拼出 {prefix}-{icon}；css-icon 字符串原样渲染；css-icon 布尔同时挂两个类名。',
    },
    {
      name: 'button-mp-loading-props',
      title: 'loading-props 对象写法',
      blurb: 'loading-props 的 color / size；扁平 prop 优先。',
    },
    {
      name: 'button-mp-hairline',
      title: '细边框（hairline）',
      blurb: 'hairline 仅对 default 类型生效；与 loading 叠加对比。',
    },
    {
      name: 'button-mp-open-type',
      title: '开放能力（`open-type`，MP-only）',
      blurb:
        'open-type: share / feedback / launchApp / contact / getUserInfo / openSetting / favorite / chooseAvatar。',
    },
    {
      name: 'button-mp-mp-open-type',
      title: '扩展参数（`session-from` / `send-message-*` / `app-parameter` / `scope` …）',
      blurb:
        'open-type 扩展参数透传：contact 会话配置、lang 三档、app-parameter、scope、hover-stop-propagation。',
    },
    {
      name: 'button-mp-hover',
      title: '按住反馈（`hover-class` / `hover-start-time` / `hover-stay-time`）',
      blurb:
        '自定义 press 反馈 class；hover-start-time 按住多久触发；hover-stay-time 松手后多久消失。',
    },
    {
      name: 'button-mp-form-type',
      title: '表单提交类型（`form-type`，MP-only）',
      blurb: "form-type='submit' 提交表单；form-type='reset' 重置表单。",
    },
  ],
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
      { name: 'block', type: 'boolean', default: '—', desc: '块级。' },
      { name: 'round', type: 'boolean', default: '—', desc: '胶囊形。' },
      { name: 'disabled', type: 'boolean', default: '—', desc: '禁用。' },
      { name: 'loading', type: 'boolean', default: '—', desc: '加载中（spinner + 阻止 click）。' },
      { name: 'hairline', type: 'boolean', default: '—', desc: '显示细边框（default 类型）。' },
      { name: 'feedback', type: 'boolean', default: '—', desc: '点击反馈（active 透明度）。' },
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
      { name: 'loadingColor', type: 'string', default: '—', desc: '自定义 spinner 颜色。' },
      { name: 'loadingSize', type: 'number | string', default: '—', desc: '`32`' },
      { name: 'hoverClass', type: 'string', default: '—', desc: '触摸反馈 class。' },
      { name: 'hoverStartTime', type: 'number', default: '—', desc: '按住多久触发 hoverClass。' },
      { name: 'hoverStayTime', type: 'number', default: '—', desc: '松手后多久撤销 hoverClass。' },
      {
        name: 'formType',
        type: "'submit' | 'reset' | undefined",
        default: '—',
        desc: 'Form submission type.',
      },
      { name: 'customClass', type: 'string', default: '—', desc: '根元素额外 class。' },
      { name: 'customStyle', type: 'string | Record<string, string>', default: '—', desc: "`''`" },
      { name: 'bgColor', type: 'string', default: '—', desc: '内联 `background-color` 覆盖。' },
      { name: 'color', type: 'string', default: '—', desc: '内联 `color` + `border-color` 覆盖。' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '无障碍标签。' },
      { name: 'iconData', type: 'IconData', default: '—', desc: '图标数据。' },
      { name: 'iconName', type: 'string', default: '—', desc: '通过 `registerSnIcons` 解析。' },
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
        desc: '字体图标名（iconfont 路径），拼成 `{classPrefix}-{icon}`。',
      },
      { name: 'classPrefix', type: 'string', default: '—', desc: '字体图标类名前缀。' },
      { name: 'cssIcon', type: 'boolean | string', default: '—', desc: '是否按 CSS 图标处理。' },
      { name: 'color', type: 'string', default: '—', desc: '内联 `color` + `border-color` 覆盖。' },
      { name: 'size', type: 'number | string', default: '—', desc: "'large'`" },
      { name: 'text', type: 'string', default: '—', desc: '文本内容。' },
      {
        name: 'hoverStopPropagation',
        type: 'boolean',
        default: '—',
        desc: '按下态不冒泡到祖先节点。',
      },
      {
        name: 'lang',
        type: "'zh_CN' | 'zh_TW' | 'en' | ''",
        default: '—',
        desc: '`open-type=contact` session language: `zh_CN` / `zh_TW` / `en`.',
      },
      { name: 'sessionFrom', type: 'string', default: '—', desc: '`open-type=contact` 会话来源。' },
      {
        name: 'sendMessageTitle',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` 消息卡片标题。',
      },
      {
        name: 'sendMessagePath',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` 消息卡片路径。',
      },
      {
        name: 'sendMessageImg',
        type: 'string',
        default: '—',
        desc: '`open-type=contact` 消息卡片图片。',
      },
      {
        name: 'appParameter',
        type: 'string',
        default: '—',
        desc: '`open-type=launchApp` 携带参数。',
      },
      {
        name: 'showMessageCard',
        type: 'boolean',
        default: '—',
        desc: '`open-type=contact` 是否展示会话卡片。',
      },
      { name: 'buttonId', type: 'string', default: '—', desc: '客服消息定位用的唯一标识。' },
      {
        name: 'scope',
        type: "'phoneNumber' | 'userInfo' | ''",
        default: '—',
        desc: 'Alipay authorization scope (`open-type=getAuthorize`).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Button 按钮 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Button } from '@snui/uni';",
    chipCopy: "import { Button } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-button', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    next: { text: 'sn-icon', link: '/components/uni/icon' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
