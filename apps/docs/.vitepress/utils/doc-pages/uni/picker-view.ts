/**
 * PickerView 选择器视图（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-picker-view.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const pickerViewDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'PickerView 选择器视图' },
  ],
  title: 'PickerView 选择器视图',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-picker-view',
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
    fileLabel: 'PickerView 选择器视图.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { PickerView } from '@snui/uni';
</script>

<template>
  <sn-picker-view />
</template>`,
  },
  demos: [
    {
      name: 'picker-view-mp-basic',
      title: '基础用法',
      blurb: 'sn-picker-view 单列滚轮：columns 传字符串数组，tap 某一行即可选中。',
    },
    {
      name: 'picker-view-mp-cascade',
      title: '级联模式（`cascade`）',
      blurb: 'cascade 模式下 columns 传树形结构，组件按已选路径推导后续列。',
    },
    {
      name: 'picker-view-mp-disabled',
      title: '禁用（`disabled`）',
      blurb: 'disabled 整列不可交互，滚轮冻结在当前值。',
    },
    {
      name: 'picker-view-mp-rows',
      title: '滚筒几何（`itemHeight` / `visibleItemCount`）',
      blurb: 'itemHeight 调行高（px 设计值 → rpx），visibleItemCount 调可见行数。',
    },
    {
      name: 'picker-view-mp-keys',
      title: '自定义字段名（`valueKey` / `labelKey` / `childrenKey`）',
      blurb: 'valueKey / labelKey / childrenKey 让组件读取自定义字段名，业务数据不必重命名。',
    },
    {
      name: 'picker-view-mp-immediate',
      title: '拖动即时回写（`immediateChange`）',
      blurb: 'immediateChange 拖动中持续触发 change，配合事件实时联动。',
    },
    {
      name: 'picker-view-mp-wheel',
      title: 'wheel 风格（`wheel`）',
      blurb: 'wheel 模式换装圆角胶囊高亮带 + 远行淡出，多列共享同一条带。',
    },
    {
      name: 'picker-view-mp-icons',
      title: '图标选项（`#option` 插槽）',
      blurb: '#option 作用域插槽自定义行内容：图标 + 文字，选中行转主题色。',
    },
    {
      name: 'picker-view-mp-band',
      title: '胶囊带主题（`--sn-picker-view-wheel-band`）',
      blurb: 'customStyle 覆盖高亮带底色与圆角变量，一行换肤。',
    },
    {
      name: 'picker-view-mp-slots',
      title: '时间槽（`#option` 插槽 + distance）',
      blurb: '插槽画每行虚线时间槽盒，选中行实线主题框，远行按 distance 淡出。',
    },
    {
      name: 'picker-view-mp-rich',
      title: '富内容行（`#option` 插槽）',
      blurb: '主标题 + 副标题双行布局，option.raw 透传业务字段。',
    },
    {
      name: 'picker-view-mp-band-mode',
      title: '块自定义（`wheelBand` / 渐变带 / inset）',
      blurb: 'shared 一整条横跨全部列；perColumn 每列一条；带漆 / 圆角 / 内边距走 CSS 变量。',
    },
    {
      name: 'picker-view-mp-band-dots',
      title: '点阵纹理带（`#band` 插槽）',
      blurb: '#band 插槽替换高亮块的漆面：浅蓝底 + 圆点阵列 + 描边，CSS 变量做不到的纹理由调用方绘制。',
    },
    {
      name: 'picker-view-mp-band-soft',
      title: '整幅软色带（`#band` 插槽）',
      blurb: '零内边距 + 大圆角的整幅浅蓝带，对齐时间滚轮参考稿。',
    },
    {
      name: 'picker-view-mp-custom-style',
      title: '根节点样式（`customClass` / `customStyle`）',
      blurb: 'customClass / customStyle 落在根节点上，改滚轮外框与底色。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'modelValue', type: 'PickerValue[]', default: '() => []', desc: '`[]`' },
      { name: 'columns', type: 'PickerColumn[]', default: '() => []', desc: '列配置。' },
      { name: 'itemHeight', type: 'number', default: '44', desc: '单项高度（px 设计值）' },
      { name: 'visibleItemCount', type: 'number', default: '6', desc: '可见项数量' },
      {
        name: 'valueKey',
        type: 'string',
        default: "'value'",
        desc: 'Option key holding the value.',
      },
      {
        name: 'labelKey',
        type: 'string',
        default: "'label'",
        desc: 'Option key holding the visible label.',
      },
      {
        name: 'childrenKey',
        type: 'string',
        default: "'children'",
        desc: 'Option key holding the children (cascade mode only).',
      },
      {
        name: 'immediateChange',
        type: 'boolean',
        default: 'false',
        desc: '拖动过程中立即触发 change',
      },
      { name: 'cascade', type: 'boolean', default: 'false', desc: '把 columns 当树处理' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用滚轮' },
      {
        name: 'wheel',
        type: 'boolean',
        default: 'false',
        desc: 'wheel 风格（additive）：选中行渲染圆角胶囊高亮带 + 远行淡出。',
      },
      {
        name: 'wheelBand',
        type: "'shared' | 'perColumn'",
        default: "'shared'",
        desc: "高亮带形态（additive）：shared 横跨全部列一整条带；perColumn 每列一条。带漆 / 圆角 / 内边距经 `--sn-picker-view-wheel-band` / `-wheel-radius` / `-wheel-inset` 自定义。",
      },
      {
        name: 'vibrateShort',
        type: 'boolean',
        default: 'false',
        desc: '滑动短震动（additive）：每档位触发 `uni.vibrateShort({ type: "light" })`，App / 小程序生效。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'PickerView 选择器视图 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { PickerView } from '@snui/uni';",
    chipCopy: "import { PickerView } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-picker-view', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Picker', link: '/components/uni/picker' },
    next: { text: 'WheelPicker', link: '/components/uni/wheel-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
