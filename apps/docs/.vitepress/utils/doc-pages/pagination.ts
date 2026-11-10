/**
 * Pagination 分页器 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const paginationDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Pagination 分页器' },
  ],
  title: 'Pagination 分页器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '分页器把长列表与表格结果拆成多页展示，负责页码省略折叠、快速跳页、每页条数切换与简洁模式。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/pagination',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Pagination 分页器.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Pagination } from '@snui/vue-web';
</script>

<template>
  <Pagination />
</template>`,
  },
  demos: [
    { name: 'pagination-web-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'pagination-web-jumper', title: '快速跳转与每页条数', blurb: '快速跳转与每页条数' },
    {
      name: 'pagination-web-pagesize',
      title: '每页条数档位与数据量联动',
      blurb: '每页条数档位与数据量联动',
    },
    {
      name: 'pagination-web-picker-simple',
      title: '省略折叠、简洁模式与页码插槽',
      blurb: '省略折叠、简洁模式与页码插槽',
    },
    { name: 'pagination-web-disabled', title: '省略折叠与禁用态', blurb: '省略折叠与禁用态' },
    {
      name: 'pagination-web-quick-switch',
      title: '快速切换（quick-switch）',
      blurb: '快速切换（quick-switch）',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'page', type: 'number | undefined', default: 'undefined', desc: '当前页码。' },
      {
        name: 'itemCount',
        type: 'number',
        default: '0',
        desc: '用于推导总页数的条目总数。对应 n-pagination 的 `itemCount`。',
      },
      {
        name: 'pageSize',
        type: 'number | null | undefined',
        default: 'undefined',
        desc: '每页条数（受控）；为 `undefined` / `null` 时使用内部状态。对应 n-pagination 的 `pageSize`。',
      },
      {
        name: 'defaultPage',
        type: 'number',
        default: '1',
        desc: '非受控模式下的初始页码。对应 n-pagination 的 `defaultPage`。',
      },
      {
        name: 'defaultPageSize',
        type: 'number',
        default: '10',
        desc: '非受控模式下的初始每页条数。对应 n-pagination 的 `defaultPageSize`。',
      },
      {
        name: 'pageCount',
        type: 'number | undefined',
        default: 'undefined',
        desc: '显式页码总数，优先于 `itemCount` / `pageSize`。对应 n-pagination 的 `pageCount`。',
      },
      {
        name: 'pageSizes',
        type: 'PaginationPageSize[]',
        default: '() => [10',
        desc: 'Options for the size picker; plain numbers render as `N / 页`. Mirrors n-pagination `pageSizes`.',
      },
      {
        name: 'showQuickJumper',
        type: 'boolean',
        default: 'false',
        desc: '渲染快速跳页输入框。对应 n-pagination 的 `showQuickJumper`。',
      },
      {
        name: 'showSizePicker',
        type: 'boolean',
        default: 'false',
        desc: '渲染每页条数选择器。对应 n-pagination 的 `showSizePicker`。',
      },
      {
        name: 'pageSlot',
        type: 'number',
        default: '9',
        desc: '页码按钮的最大数量，超出后折叠为首 / 尾 / 邻近页加省略号。对应 n-pagination 的 `pageSlot`，默认 9。',
      },
      {
        name: 'showTotal',
        type: 'boolean',
        default: 'false',
        desc: 'Show the `共 N 条` total. Mirrors n-pagination `showTotal`.',
      },
      {
        name: 'simple',
        type: 'boolean',
        default: 'false',
        desc: '简洁模式：上一页 / 页码输入 / 总页数 / 下一页，不渲染页码列表与跳页输入。',
      },
      {
        name: 'quickSwitch',
        type: 'boolean',
        default: 'true',
        desc: 'Quick switch (快速切换): clicking an `…` ellipsis opens a small panel listing the pages hidden in that gap — one click jumps there. On by default; set `false` to keep the ellipsis a static marker.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: '禁用全部控件；禁用期间的交互不提交事件。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Pagination 分页器 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Pagination } from '@snui/vue-web';",
    chipCopy: "import { Pagination } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Pagination', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'float-button', link: '/components/web/float-button' },
    next: { text: 'page-header', link: '/components/web/page-header' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
