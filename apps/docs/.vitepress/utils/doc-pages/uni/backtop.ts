/**
 * Backtop 回到顶部（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-backtop.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const backtopDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Backtop 回到顶部' },
  ],
  title: 'Backtop 回到顶部',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '滚动距离由宿主传入 ' },
    { t: 'code', s: 'scroll-top' },
    { t: 'text', s: '（页面 ' },
    { t: 'code', s: 'onPageScroll' },
    { t: 'text', s: ' 或 ' },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: '@scroll' },
    { t: 'text', s: '），超过 ' },
    { t: 'code', s: 'top' },
    { t: 'text', s: ' 阈值后按钮淡入；点击按钮通过 ' },
    { t: 'code', s: 'uni.pageScrollTo' },
    { t: 'text', s: ' 滚回顶部，宿主也可以监听 ' },
    { t: 'code', s: 'click' },
    { t: 'text', s: ' 自己控制滚动容器：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-backtop',
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
    fileLabel: 'Backtop 回到顶部.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Backtop } from '@snui/uni';
</script>

<template>
  <sn-backtop />
</template>`,
  },
  demos: [
    {
      name: 'backtop-mp-basic',
      title: '基础用法',
      blurb: 'scroll-view 真实滚动触发：滚动距离超过阈值后按钮淡入，点击真实滚回顶部。',
    },
    {
      name: 'backtop-mp-shape',
      title: '形状、尺寸与内容形态',
      blurb:
        '圆形 / 方形 × 尺寸 × 内容形态：纯图标按钮保持正圆 / 正方，图标 + 文字按钮宽度自适应。',
    },
    {
      name: 'backtop-mp-theme',
      title: '主题色',
      blurb: 'theme 语义主题：primary / success / warning / danger / info 填充，内容自动反色。',
    },
    {
      name: 'backtop-mp-threshold',
      title: '显示阈值与图标样式',
      blurb: 'top=120 显示阈值；icon-style 自定义图标颜色；z-index 层级。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'scrollTop', type: 'number', default: '0', desc: '页面滚动距离（由宿主提供）。' },
      { name: 'text', type: 'string', default: "''", desc: '按钮文字。' },
      {
        name: 'top',
        type: 'number',
        default: '300',
        desc: '滚动距离超过该值时显示按钮，单位为 px。',
      },
      { name: 'duration', type: 'number', default: '100', desc: '返回顶部滚动时间，单位为 ms。' },
      { name: 'zIndex', type: 'number', default: '10', desc: '组件层级。' },
      { name: 'iconStyle', type: 'string', default: "''", desc: '自定义图标样式。' },
      {
        name: 'shape',
        type: "'circle' | 'square'",
        default: "'circle'",
        desc: '按钮形状：circle / square。',
      },
      { name: 'bottom', type: 'number', default: '100', desc: '距离屏幕底部的距离，单位为 px。' },
      { name: 'right', type: 'number', default: '20', desc: '距离屏幕右侧的距离，单位为 px。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '自定义根节点样式。' },
      { name: 'customClass', type: 'string', default: "''", desc: '自定义根节点样式类。' },
      {
        name: 'size',
        type: 'BacktopSize',
        default: "'medium'",
        desc: '按钮尺寸档位；图标随档位取 `--sn-mp-icon-size-*` token。',
      },
      {
        name: 'theme',
        type: 'BacktopTheme',
        default: "'default'",
        desc: '按钮主题填充；内容色自动反转为 on-primary。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Backtop 回到顶部 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Backtop } from '@snui/uni';",
    chipCopy: "import { Backtop } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-backtop', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-index-bar', link: '/components/uni/index-bar' },
    next: { text: 'sn-tour', link: '/components/uni/tour' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
