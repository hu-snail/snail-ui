/**
 * Form 表单（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-form.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const formDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Form 表单' }],
  title: 'Form 表单',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '把 ' },
    { t: 'code', s: 'model' },
    { t: 'text', s: ' 交给表单，每个字段用 ' },
    { t: 'code', s: 'prop' },
    { t: 'text', s: ' 声明它在 model 中的路径；提交时先跑全表校验，再由 ' },
    { t: 'code', s: 'submit' },
    { t: 'text', s: ' 事件回传结果：' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-form',
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
    fileLabel: 'Form 表单.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Form } from '@snui/uni';
</script>

<template>
  <sn-form />
</template>`,
  },
  demos: [
    {
      name: 'form-mp-basic',
      title: '基础用法',
      blurb: 'model + v-model 双向绑定；提交时全表校验，@submit 回传 valid。',
    },
    {
      name: 'form-mp-form-type',
      title: '表单形态：提交 / 重置',
      blurb: '提交型：submit() → 校验 → @submit；重置型：resetFields() 回到初始快照。',
    },
    {
      name: 'form-mp-guard',
      title: '提交拦截',
      blurb: '校验失败不放行（计入拦截次数），修正后再次提交即放行。',
    },
    {
      name: 'form-mp-fields',
      title: '字段类型组合',
      blurb:
        'text / digit / password / textarea / 嵌套路径 profile.city / checkbox-group / switch 一表共存。',
    },
    {
      name: 'form-mp-custom',
      title: '自定义插槽',
      blurb:
        'label 插槽放复合标签、default 插槽放自定义优先级选择、description 插槽放自定义副文案。',
    },
    {
      name: 'form-mp-status-icon',
      title: '状态图标（statusIcon）',
      blurb: 'statusIcon：消息前带状态图标。',
    },
    {
      name: 'form-mp-message-display',
      title: '错误消息展示策略',
      blurb: 'showMessage=false 隐藏消息行 / errorType=none 静默校验。',
    },
    {
      name: 'form-mp-disabled',
      title: '整体禁用',
      blurb: 'SnForm.disabled 级联到所有 FormItem，提交按钮一并禁用。',
    },
    {
      name: 'form-mp-cell-border',
      title: '单元格分隔与截断',
      blurb: 'border 分隔线 / ellipsis 长标签截断。',
    },
    {
      name: 'form-mp-cell-clickable',
      title: '可点击行（clickable / isLink）',
      blurb: 'clickable + isLink：整行可点并显示箭头。',
    },
    {
      name: 'form-mp-cell-text',
      title: '占位与副文案',
      blurb: 'placeholder 空值兜底 / description 副文案。',
    },
    {
      name: 'form-mp-size',
      title: '尺寸（size）',
      blurb: 'size 缩放：默认 medium 与 size="small" 两档对比。',
    },
    {
      name: 'form-mp-value-align',
      title: '值对齐（valueAlign）',
      blurb: 'valueAlign 右对齐。',
    },
    {
      name: 'form-mp-asterisk',
      title: '必填星号（asteriskPosition / hideAsterisk）',
      blurb: 'asteriskPosition 星号位置、hideAsterisk 隐藏必填星号。',
    },
    {
      name: 'form-mp-icon',
      title: '标签内联图标',
      blurb: 'iconName 走注册表；iconData 传内联 SVG；iconSize 单独放大某个图标。',
    },
    {
      name: 'form-mp-label',
      title: '标签位置与列宽',
      blurb: 'labelPosition left / right / top × labelWidth 列宽。',
    },
    {
      name: 'form-mp-reset-submit',
      title: '重置与清除校验',
      blurb: 'resetFields / clearValidate / validate 三种操作的差别，附带当前值与操作回显。',
    },
    {
      name: 'form-mp-rules',
      title: '校验规则（FormRule）',
      blurb:
        'required / type / pattern / minLength+maxLength / min+max / validator / asyncValidator 七种规则。',
    },
    {
      name: 'form-mp-validate',
      title: '编程式校验',
      blurb:
        'validate() / validateField(prop) / validateField([props]) / clearValidate(prop)，并回显 @validate 的 errors。',
    },
    {
      name: 'form-mp-title-width',
      title: '标签列宽（titleWidth）',
      blurb: 'titleWidth 列宽。',
    },
    {
      name: 'form-mp-layout',
      title: '排布（layout / center）',
      blurb: 'layout horizontal 与 vertical / center 垂直居中。',
    },
    {
      name: 'form-mp-schema',
      title: '表单 schema',
      blurb: 'schema 存进上下文。',
    },
    {
      name: 'form-mp-validation-flow',
      title: '校验时序',
      blurb: '字段级规则（required → 异步占用）先跑，再跑表单级规则（pattern / type）。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'model',
        type: 'Record<string, unknown>',
        default: '—',
        desc: '表单数据对象（必传），字段用 `prop` 指向它的路径。',
      },
      {
        name: 'rules',
        type: 'FormRules',
        default: '() => ({})',
        desc: '按 `prop` 索引的校验规则集。',
      },
      {
        name: 'showMessage',
        type: 'boolean',
        default: 'true',
        desc: '是否渲染字段下方的错误消息行。',
      },
      {
        name: 'statusIcon',
        type: 'boolean',
        default: 'false',
        desc: '是否在错误消息前渲染状态图标，字段行可单独覆盖。',
      },
      {
        name: 'labelPosition',
        type: "'left' | 'right' | 'top'",
        default: "'right'",
        desc: 'labelPosition',
      },
      { name: 'labelWidth', type: 'number | string', default: "'auto'", desc: 'labelWidth' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用，级联到所有字段行。' },
      {
        name: 'validateTrigger',
        type: "'blur' | 'change'",
        default: "'blur'",
        desc: 'When to fire field-level validation.',
      },
      {
        name: 'resetOnChange',
        type: 'boolean',
        default: 'true',
        desc: "Reset every field's error state when the model is mutated externally.",
      },
      {
        name: 'errorType',
        type: "'message' | 'toast' | 'none'",
        default: "'message'",
        desc: 'Error display strategy: inline message / toast / silent.',
      },
      { name: 'border', type: 'boolean', default: 'false', desc: '字段行之间画分隔线。' },
      {
        name: 'center',
        type: 'boolean',
        default: 'false',
        desc: "Vertically center every FormItem's control column.",
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: 'Default size for descendant FormItems.',
      },
      {
        name: 'valueAlign',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Right-align the field value column (Cell-style menus).',
      },
      {
        name: 'asteriskPosition',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Asterisk position for required fields.',
      },
      { name: 'hideAsterisk', type: 'boolean', default: 'false', desc: '隐藏必填星号。' },
      { name: 'ellipsis', type: 'boolean', default: 'false', desc: '长标签截断为省略号。' },
      {
        name: 'schema',
        type: 'Record<string, unknown> | undefined',
        default: 'undefined',
        desc: '表单 schema。',
      },
      {
        name: 'titleWidth',
        type: 'number | string | undefined',
        default: 'undefined',
        desc: '标题列宽度。',
      },
      {
        name: 'layout',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        desc: 'Cell layout (`wd-form` `layout`): `horizontal` puts label and control side by side, `vertical` stacks them. Inherited by items.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Form 表单 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Form } from '@snui/uni';",
    chipCopy: "import { Form } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-form', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Popover', link: '/components/uni/popover' },
    next: { text: 'Input', link: '/components/uni/input' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
