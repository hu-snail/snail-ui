/**
 * Icon 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props：packages/vue-web/src/icon/SnIcon.vue（withDefaults 真实签名）
 *   - Token：packages/tokens-web/src/variables.ts 的 --sn-web-icon-* 别名族
 *   - 注册表 API：packages/vue-web/src/icon/sn-icon-registry.ts
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const iconDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Icon 图标' }],
  title: 'Icon 图标',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '包装任意「每个图标一个 Vue 组件」的图标库，规范搭配 ' },
    { t: 'code', s: 'lucide-vue-next' },
    { t: 'text', s: '。两条使用路径都支持：直接传组件（推荐，可被 tree-shake），或先 ' },
    { t: 'code', s: 'registerSnIcons()' },
    { t: 'text', s: ' 注册再用字符串名查找（适合后端下发菜单配置）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/icon',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '按需加载 · 可 tree-shake', icon: 'layers' },
    { text: '装饰性图标默认 aria-hidden', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '静态场景直接传组件 —— bundler 能静态分析 ' },
      { t: 'code', s: "import { ChevronRight } from 'lucide-vue-next'" },
      { t: 'text', s: '，只把用到的图标打进 bundle。' },
    ],
    fileLabel: 'IconBasic.vue',
    meta: 'Vue 3 · <script setup>',
    code: `<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
import { SnIcon } from '@snui/vue-web';
</script>

<template>
  <SnIcon :icon="ChevronRight" :size="20" />
</template>`,
  },

  demos: [
    {
      name: 'icon-web-basic',
      title: '基础用法',
      blurb: '直接传 icon 组件：最直接的按需加载方式，4 个图标各自一个 named import。',
    },
    {
      name: 'icon-web-size',
      title: '尺寸与描边',
      blurb: '五档尺寸（14 / 18 / 24 / 32 / 48）+ 三档描边宽度（1 / 2 / 3）+ 绝对描边。',
    },
    {
      name: 'icon-web-registry',
      title: '注册表用法',
      blurb: 'registerSnIcons({ … }) 注册后用 name 字符串查图标，适合数据驱动菜单。',
    },
  ],

  props: {
    hint: [
      { t: 'code', s: 'icon' },
      { t: 'text', s: ' 与 ' },
      { t: 'code', s: 'name' },
      { t: 'text', s: ' 同时传入时 ' },
      { t: 'code', s: 'icon' },
      { t: 'text', s: ' 优先；都不传则渲染占位符，并在开发态提示「icon not registered」。' },
    ],
    rows: [
      { name: 'icon', type: 'Component', default: '—', desc: '直接传入图标组件（推荐）' },
      {
        name: 'name',
        type: 'string',
        default: '—',
        desc: '从注册表查图标，需先调用 registerSnIcons()',
      },
      { name: 'size', type: 'number | string', default: '16', desc: '`16`' },
      { name: 'color', type: 'string', default: "'currentColor'", desc: '描边颜色' },
      { name: 'strokeWidth', type: 'number | string', default: '2', desc: '`2`' },
      {
        name: 'strokeWidthAbsolute',
        type: 'boolean',
        default: 'false',
        desc: 'true 时描边按绝对像素计算，不随 size 缩放',
      },
      { name: 'defaultClass', type: 'string', default: '—', desc: '传给内层 SVG 的 class' },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnIcon 携带 AI-Friendly 描述（用途 / Import / Props / 注册表 API / A11y），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnIcon } from '@snui/vue-web';",
    chipCopy: "import { SnIcon } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnIcon', tone: 'accent' },
      { key: 'intent.source', value: '"lucide-vue-next"', tone: 'cyan' },
      { key: 'a11y', value: 'aria-hidden by default', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'Divider 分割线', link: '/components/web/divider' },
    next: { text: 'Text 排版', link: '/components/web/text' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
