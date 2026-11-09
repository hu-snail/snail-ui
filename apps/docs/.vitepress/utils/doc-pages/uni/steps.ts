/**
 * Steps 步骤条（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-step.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const stepsDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '导航组件 Navigation' },
    { text: 'Steps 步骤条' },
  ],
  title: 'Steps 步骤条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '步骤图标有三个来源，优先级为 ' },
    { t: 'code', s: 'iconData' },
    { t: 'text', s: ' > ' },
    { t: 'code', s: 'iconUrl' },
    { t: 'text', s: ' > ' },
    { t: 'code', s: 'icon' },
    { t: 'text', s: '：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-steps',
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
    fileLabel: 'Steps 步骤条.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Steps } from '@snui/uni';
</script>

<template>
  <sn-steps />
</template>`,
  },
  demos: [
    {
      name: 'steps-mp-basic',
      title: '基础用法',
      blurb: 'active 指定当前步骤；之前步骤自动 finished、当前 process、之后 wait。',
    },
    {
      name: 'steps-mp-vertical',
      title: '垂直 / 点状 / 错误状态',
      blurb: 'vertical 纵向步骤条；status=error 显式覆盖状态；dot 点状步骤条。',
    },
    {
      name: 'steps-mp-space',
      title: '间距、居中对齐与显式状态',
      blurb: 'space=120rpx 与 align-center；显式 status 覆盖；icon / title / description 插槽。',
    },
    {
      name: 'steps-mp-node',
      title: '自定义节点',
      blurb: 'node 插槽替换默认节点；content 插槽整体替换标题 + 描述。',
    },
    {
      name: 'steps-mp-connector',
      title: '连接线类型',
      blurb: 'connector 取 solid / dashed / dotted；vertical 下同样生效。',
    },
    {
      name: 'steps-mp-icon',
      title: '图标配置',
      blurb: 'icon 名称 / iconData 对象 / iconUrl 图片三轨；iconSize 档位与 iconColor 覆盖。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'title', type: 'string', default: "''", desc: '步骤标题，不传时显示默认文案。' },
      { name: 'description', type: 'string', default: "''", desc: '步骤描述。' },
      {
        name: 'icon',
        type: 'string',
        default: "''",
        desc: '步骤图标名（registry → 内置目录依次解析，未命中回退内置状态图标 / 序号）。',
      },
      {
        name: 'status',
        type: 'SnStepStatus | undefined',
        default: 'undefined',
        desc: '步骤状态：finished / process / error / wait（不传时由 active 推导）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
      {
        name: 'iconData',
        type: 'IconData | undefined',
        default: '—',
        desc: '图标数据对象（内置图标集 / 自定义 IconData），优先级最高。',
      },
      {
        name: 'iconUrl',
        type: 'string',
        default: "''",
        desc: '图标图片地址：渲染为 `<image>`，优先级低于 `iconData`、高于 `icon`。',
      },
      {
        name: 'iconSize',
        type: 'string | number | undefined',
        default: '—',
        desc: '图标尺寸：数字按 px；档位名（tiny/small/medium/large/xlarge）映射 `--sn-mp-icon-size-*`。',
      },
      {
        name: 'iconColor',
        type: 'string',
        default: "''",
        desc: '图标颜色；请传 `var(--sn-mp-color-*)` token，默认 `currentColor`（跟随节点状态色）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Steps 步骤条 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Steps } from '@snui/uni';",
    chipCopy: "import { Steps } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-steps', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-tour', link: '/components/uni/tour' },
    next: { text: 'sn-collapse', link: '/components/uni/collapse' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
