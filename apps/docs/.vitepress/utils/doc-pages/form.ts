/**
 * Form 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const formDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Form' }],
  title: 'Form',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '表单编排器 ' },
    { t: 'code', s: 'SnForm' },
    { t: 'text', s: ' + 字段包装 ' },
    { t: 'code', s: 'SnFormItem' },
    { t: 'text', s: '。Provide/Inject 通讯，统一校验 / 重置 / 提交。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/form',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Form.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Form } from '@snui/vue-web';
</script>

<template>
  <Form />
</template>`,
  },
  demos: [
    { name: 'form-basic', title: '基础用法', blurb: '基本 model + v-model 同步 + submit 处理。' },
    {
      name: 'form-rules',
      title: '校验规则（FormRule）',
      blurb:
        '覆盖所有 FormRule 类型：required / type / pattern / length / 自定义 validator / asyncValidator。',
    },
    {
      name: 'form-label',
      title: 'Label 位置与宽度',
      blurb: 'labelPosition: left / right / top + labelWidth。',
    },
    {
      name: 'form-icon',
      title: 'Inline label icon',
      blurb: 'icon / iconName prop 在 label 内渲染图标（SnIcon + lucide）。',
    },
    {
      name: 'form-reset-submit',
      title: '重置 / 校验 / 提交',
      blurb:
        'formRef.validate() / validateField() / resetFields() / clearValidate()，html-type submit。',
    },
    {
      name: 'form-disabled',
      title: '整体禁用（disabled）',
      blurb: 'SnForm 的 disabled prop 级联到所有 FormItem。',
    },
    {
      name: 'form-cell',
      title: 'Cell 列表化（`border` / `ellipsis` / `clickable` / `isLink`）',
      blurb:
        'Cell 列表化：border 加分割线、ellipsis 长 label 截断、clickable 整行可点 + click 事件、isLink 显示 › 箭头、placeholder 占位、description 副文本。',
    },
    {
      name: 'form-cell-style',
      title: '表单级默认（`size` / `valueAlign` / `asteriskPosition` / `hideAsterisk`）',
      blurb:
        'Form 级统一：size 缩放、valueAlign right、asteriskPosition right、hideAsterisk 关掉 * 标记。',
    },
    {
      name: 'form-validation-flow',
      title: '校验触发 / 重置切换 / 错误展示（`validateTrigger` / `resetOnChange` / `errorType`）',
      blurb:
        "validateTrigger: 'blur' | 'change'；resetOnChange 提交后自动清错误；errorType: 'message' | 'toast' | 'none'。",
    },
    {
      name: 'form-web-assembly',
      title: '综合场景：日期 / 单选 / 多选 / 选择器编排',
      blurb: '选择器 / 单选 / 多选 / 数字 / 日期 / 时间 / 开关 + 统一校验提交。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'model',
        type: 'Record<string, unknown>',
        default: '—',
        desc: '响应式 model，items 通过 v-model 写入。',
      },
      {
        name: 'rules',
        type: 'FormRules',
        default: '() => ({})',
        desc: '按 `prop` 键索引的校验规则集。',
      },
      { name: 'novalidate', type: 'boolean', default: 'true', desc: '关闭原生 HTML5 校验。' },
      { name: 'showMessage', type: 'boolean', default: 'true', desc: '是否显示错误 / 警告信息。' },
      {
        name: 'statusIcon',
        type: 'boolean',
        default: 'false',
        desc: '状态图标（Phase 1 仅文本）。',
      },
      {
        name: 'labelPosition',
        type: "'left' | 'right' | 'top'",
        default: "'right'",
        desc: 'Label position for child FormItems.',
      },
      {
        name: 'labelWidth',
        type: 'number | string',
        default: "'auto'",
        desc: 'Label width for child FormItems (number = px, string = CSS length).',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '整体禁用。' },
      {
        name: 'validateTrigger',
        type: "'blur' | 'change'",
        default: "'blur'",
        desc: 'When to fire field-level validation. `blur` validates on blur; `change` validates on every input change. Defaults to `blur`.',
      },
      {
        name: 'resetOnChange',
        type: 'boolean',
        default: 'true',
        desc: "Reset every field's error state when the model is mutated externally (e.g. after a successful submit). Defaults to `true` to mirror Element Plus / Ant Design forms.",
      },
      {
        name: 'errorType',
        type: "'message' | 'toast' | 'none'",
        default: "'message'",
        desc: 'Error display strategy: - `message` — inline message under the offending field (default) - `toast`   — emit `validate` event and let the host show a toast - `none`    — silently validate (return value is still authoritative)',
      },
      { name: 'border', type: 'boolean', default: 'false', desc: 'FormItem 之间加 1px 分隔线。' },
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
        desc: 'Right-align the field value within the cell (when items render as a list / menu). Mirrors wd-form `value-align`.',
      },
      {
        name: 'asteriskPosition',
        type: "'left' | 'right'",
        default: "'left'",
        desc: 'Asterisk position for required fields.',
      },
      { name: 'hideAsterisk', type: 'boolean', default: 'false', desc: '隐藏 required 标记。' },
      {
        name: 'ellipsis',
        type: 'boolean',
        default: 'false',
        desc: '长 label 截断（text-overflow: ellipsis）。',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Form 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Form } from '@snui/vue-web';",
    chipCopy: "import { Form } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Form', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'rate', link: '/components/web/rate' },
    next: { text: 'transfer', link: '/components/web/transfer' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
