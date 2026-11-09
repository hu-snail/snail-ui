/** sn-paging List Container (uni-app) — English page data. Props from sn-paging.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pagingDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'sn-paging List Container' },
  ],
  title: 'sn-paging List Container',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'the gesture work is delegated to the native ' },
    { t: 'code', s: 'scroll-view' },
    { t: 'text', s: ' refresher and the' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-paging',
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
    fileLabel: 'sn-paging List Container.vue',
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
    { name: 'paging-mp-basic', title: 'Basic usage', blurb: 'Basic usage' },
    {
      name: 'paging-mp-states',
      title: 'Empty and fail-retry states',
      blurb: 'Empty and fail-retry states',
    },
    {
      name: 'paging-mp-scroll',
      title: 'Pure scroll container and gesture switches',
      blurb: 'Pure scroll container and gesture switches',
    },
    {
      name: 'paging-mp-second-floor',
      title: 'Pull down to the second floor',
      blurb: 'Pull down to the second floor',
    },
    {
      name: 'paging-mp-popup',
      title: 'Pull-to-refresh inside a popup',
      blurb: 'Pull-to-refresh inside a popup',
    },
    {
      name: 'paging-mp-app',
      title: 'App case: full-page feed app (compact preview + fullscreen scenario)',
      blurb: 'App case: full-page feed app (compact preview + fullscreen scenario)',
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'sn-paging List Container ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Paging } from '@snui/uni';",
    chipCopy: "import { Paging } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-paging', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-loadmore', link: '/en/components/uni/loadmore' },
    next: { text: 'sn-curtain', link: '/en/components/uni/curtain' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
