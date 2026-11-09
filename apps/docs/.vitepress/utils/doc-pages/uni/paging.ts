/**
 * sn-paging 分页列表（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-paging.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pagingDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'sn-paging 分页列表' },
  ],
  title: 'sn-paging 分页列表',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '紧凑预览是完整的 sn-paging（胶囊频道 + 迷你信息流）；点「整页演示」进入 position: fixed 全屏场景——SnNavbar + 频道 tabs + 信息流卡片 + #bottom 固定操作栏（安全区适配），点卡片进入文章详情页：正文 + 点赞收藏操作行 + 独立的 sn-paging 评论分页，返回后一级列表滚动位置保留。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-paging',
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
    fileLabel: 'sn-paging 分页列表.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Paging } from '@snui/uni';
</script>

<template>
  <sn-paging />
</template>`,
  },
  demos: [
    { name: 'paging-mp-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'paging-mp-states', title: '空态与失败重试', blurb: '空态与失败重试' },
    { name: 'paging-mp-scroll', title: '纯滑动容器与手势开关', blurb: '纯滑动容器与手势开关' },
    { name: 'paging-mp-second-floor', title: '下拉进入二楼', blurb: '下拉进入二楼' },
    { name: 'paging-mp-popup', title: '弹窗内下拉刷新加载', blurb: '弹窗内下拉刷新加载' },
    {
      name: 'paging-mp-app',
      title: '应用案例：整页信息流 App（紧凑预览 + 全屏场景）',
      blurb: '应用案例：整页信息流 App（紧凑预览 + 全屏场景）',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'unknown[]',
        default: '() => []',
        desc: 'v-model — aggregated list; the host renders it in the default slot.',
      },
      {
        name: 'auto',
        type: 'boolean',
        default: 'true',
        desc: 'Fire the first query automatically after mount.',
      },
      {
        name: 'defaultPageNo',
        type: 'number',
        default: '1',
        desc: 'First page number emitted by `query`.',
      },
      {
        name: 'defaultPageSize',
        type: 'number',
        default: '10',
        desc: 'Page size emitted by `query`; a shorter page ends the sequence.',
      },
      {
        name: 'refresherEnabled',
        type: 'boolean',
        default: 'true',
        desc: 'Enable the native pull-to-refresh gesture.',
      },
      {
        name: 'refresherThreshold',
        type: 'number',
        default: '45',
        desc: 'Pull distance that arms the refresh, in px (scroll-view contract).',
      },
      {
        name: 'refresherDefaultText',
        type: 'string',
        default: "'继续下拉刷新'",
        desc: 'Text while pulling below the threshold.',
      },
      {
        name: 'refresherPullingText',
        type: 'string',
        default: "'松开立即刷新'",
        desc: 'Text once the pull passed the threshold.',
      },
      {
        name: 'refresherRefreshingText',
        type: 'string',
        default: "'正在刷新...'",
        desc: 'Text while the refresh query is in flight.',
      },
      {
        name: 'refresherCompleteText',
        type: 'string',
        default: "'刷新成功'",
        desc: 'Text shown during the success hold after `complete`.',
      },
      {
        name: 'refresherCompleteDuration',
        type: 'number',
        default: '500',
        desc: 'How long the success text holds, in ms; 0 skips the hold.',
      },
      {
        name: 'refresherBackground',
        type: 'string',
        default: "''",
        desc: 'Background of the pull area (native `refresher-background` on MP).',
      },
      {
        name: 'refresherTextColor',
        type: 'string',
        default: "''",
        desc: 'Refresher text color; the spinner follows when unset.',
      },
      {
        name: 'refresherIconColor',
        type: 'string',
        default: "''",
        desc: 'Refresher icon / spinner color.',
      },
      {
        name: 'refresherLoadingType',
        type: 'LoadingType',
        default: "'circular'",
        desc: 'Refresher loading-spinner shape (`sn-loading` `type`).',
      },
      {
        name: 'refresherMaxDistance',
        type: 'number',
        default: '0',
        desc: 'Hard pull clamp in px (z-paging `movingDistance`, additive). `0` = `refresherThreshold × 3` (legacy behaviour).',
      },
      {
        name: 'refresherOutRate',
        type: 'number',
        default: '0.65',
        desc: 'Base share removed from each gesture delta once the pull passes the arming threshold, 0..1 (additive). The band stiffens progressively to full stop at the clamp; a higher value feels firmer, a lower one more elastic. 0.65 keeps the legacy constant-damping feel as the floor.',
      },
      {
        name: 'secondFloorEnabled',
        type: 'boolean',
        default: 'false',
        desc: 'Enable pull-down-to-enter second floor.',
      },
      {
        name: 'secondFloorThreshold',
        type: 'number',
        default: '100',
        desc: 'Release distance that enters the second floor, in px.',
      },
      {
        name: 'secondFloorDuration',
        type: 'number',
        default: '200',
        desc: 'Slide-in/out duration of the second-floor overlay, in ms.',
      },
      {
        name: 'secondFloorFullscreen',
        type: 'boolean',
        default: 'true',
        desc: 'Expand the overlay to the viewport (fixed) instead of the component box.',
      },
      {
        name: 'refresherSecondFloorText',
        type: 'string',
        default: "'松开进入二楼'",
        desc: 'Refresher text while the pull is inside the second-floor zone.',
      },
      {
        name: 'secondFloorBackground',
        type: 'string',
        default: "''",
        desc: 'Background of the second-floor overlay.',
      },
      {
        name: 'loadMoreEnabled',
        type: 'boolean',
        default: 'true',
        desc: 'Enable loading the next page on scroll-to-bottom.',
      },
      {
        name: 'lowerThreshold',
        type: 'number',
        default: '50',
        desc: 'Distance from the bottom that fires load-more, in px.',
      },
      {
        name: 'loadMoreDefaultText',
        type: 'string',
        default: "'点击加载更多'",
        desc: 'Footer text when idle; tapping it loads the next page.',
      },
      {
        name: 'loadMoreLoadingText',
        type: 'string',
        default: "'正在加载中...'",
        desc: 'Footer text while a page is loading.',
      },
      {
        name: 'loadMoreNoMoreText',
        type: 'string',
        default: "'没有更多了'",
        desc: 'Footer text once every page is loaded.',
      },
      {
        name: 'loadMoreFailText',
        type: 'string',
        default: "'加载失败，点击重试'",
        desc: 'Footer text after a failure; tapping it retries.',
      },
      {
        name: 'loadMoreTextColor',
        type: 'string',
        default: "''",
        desc: 'Load-more text color; the footer spinner follows it when set.',
      },
      {
        name: 'emptyText',
        type: 'string',
        default: "'暂无数据'",
        desc: 'Text of the built-in empty view.',
      },
      {
        name: 'safeAreaInsetBottom',
        type: 'boolean',
        default: 'false',
        desc: 'Pad the container bottom for the device safe area (iPhone X+).',
      },
      {
        name: 'customClass',
        type: 'string',
        default: "''",
        desc: 'Custom class for the root node.',
      },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Custom inline style for the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'sn-paging 分页列表 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Paging } from '@snui/uni';",
    chipCopy: "import { Paging } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-paging', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-loadmore', link: '/components/uni/loadmore' },
    next: { text: 'sn-curtain', link: '/components/uni/curtain' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
