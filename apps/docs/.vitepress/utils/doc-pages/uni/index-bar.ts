/**
 * IndexBar 索引栏（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-index-bar.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const indexBarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'IndexBar 索引栏' },
  ],
  title: 'IndexBar 索引栏',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '每个 ' },
    { t: 'code', s: 'sn-index-anchor' },
    { t: 'text', s: ' 的 ' },
    { t: 'code', s: 'index' },
    { t: 'text', s: ' 会同时成为右侧索引项与该分组的标题，点击索引项即滚动到对应分组：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-index-bar',
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
    fileLabel: 'IndexBar 索引栏.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { IndexBar } from '@snui/uni';
</script>

<template>
  <sn-index-bar />
</template>`,
  },
  demos: [
    {
      name: 'index-bar-mp-basic',
      title: '基础用法',
      blurb: 'sn-index-anchor 的 index 生成右侧索引项；点击索引项跳转到对应分组；sticky 开启吸顶。',
    },
    {
      name: 'index-bar-mp-custom',
      title: '自定义内容与 change 联动',
      blurb: '分组内容自定义；change 事件透出当前索引；不开启 sticky 时随列表滚动。',
    },
    {
      name: 'index-bar-mp-scrollto',
      title: 'scrollTo 方法与自定义样式',
      blurb: 'scrollTo(index) 从代码跳转分组；custom-class / custom-style 自定义根节点。',
    },
    {
      name: 'index-bar-mp-contacts',
      title: '整页通讯录',
      blurb:
        '整页通讯录：紧凑预览搜索过滤可直接交互；点「整页演示」进全屏（Navbar + 搜索 + 索引栏 + 统计条）；点联系人进资料页。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      { name: 'sticky', type: 'boolean', default: 'false', desc: '索引是否吸顶。' },
      {
        name: 'showIndicator',
        type: 'boolean',
        default: 'false',
        desc: '是否在列表视口中央显示当前索引提示气泡（AUI 追加能力， additive (AUI-OPT-05, AGENTS.md §112.3a)；wd-index-bar 无对应 prop）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'IndexBar 索引栏 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { IndexBar } from '@snui/uni';",
    chipCopy: "import { IndexBar } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-index-bar', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-pagination', link: '/components/uni/pagination' },
    next: { text: 'sn-backtop', link: '/components/uni/backtop' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
