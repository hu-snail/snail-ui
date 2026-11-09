/**
 * Upload 上传（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-upload.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const uploadDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '录入组件 Form' }, { text: 'Upload 上传' }],
  title: 'Upload 上传',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'sn-upload 基础上传：v-model:file-list 持有列表，limit 限数量，maxSize 限体积（超出触发 oversize）。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-upload',
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
    fileLabel: 'Upload 上传.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Upload } from '@snui/uni';
</script>

<template>
  <sn-upload />
</template>`,
  },
  demos: [
    {
      name: 'upload-mp-basic',
      title: '基础用法',
      blurb:
        'sn-upload 基础上传：v-model:file-list 持有列表，limit 限数量，maxSize 限体积（超出触发 oversize）。',
    },
    {
      name: 'upload-mp-disabled-status',
      title: '禁用与状态（`disabled` / `accept` / `showLimitNum`）',
      blurb:
        'disabled 锁掉选择与删除；accept 切换选择器（image / video / file）；列表项按 status 显示进度与失败态。',
    },
    {
      name: 'upload-mp-multiple-source',
      title:
        '多选、来源与数量上限（`multiple` / `sourceType` / `sizeType` / `accept` / `limit` / `showLimitNum`）',
      blurb:
        'multiple 一次多选；sourceType / sizeType 收窄来源与尺寸；accept 切换选择器 API；limit + showLimitNum 满额后收起选择瓦片。',
    },
    {
      name: 'upload-mp-before-hooks',
      title:
        '前置钩子与体积上限（`beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` / `maxSize`）',
      blurb:
        'beforeChoose / beforeUpload / beforeRemove / beforePreview 四个否决钩子（预览里可直接验证删除被拦）；maxSize 超限改发 oversize。',
    },
    {
      name: 'upload-mp-preview-custom',
      title:
        '缩略图模式与三层自定义类（`imageMode` / `customEvokeClass` / `customPreviewClass` / `customClass` / `customStyle`）',
      blurb:
        'imageMode aspectFit / aspectFill 切换缩略图填充；customEvokeClass、customPreviewClass、customClass / customStyle 三层独立。',
    },
    {
      name: 'upload-mp-request-method',
      title:
        '请求参数与自定义传输（`action` / `header` / `name` / `formData` / `buildFormData` / `uploadMethod` / `autoUpload`）',
      blurb:
        'action / header / name / formData 是 uni.uploadFile 参数；buildFormData 按文件拼 multipart；uploadMethod 用延时 Promise 模拟传输；autoUpload=false 时由 submit() 触发。',
    },
    {
      name: 'upload-mp-events-counter',
      title: '事件与计数开关（`change` / `remove` / `progress` / `showLimitNum=false`）',
      blurb:
        'change 每次列表变化触发；remove 带被删项；progress 为保留事件；showLimitNum=false 关掉计数；accept=media / all 切换选择器。',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'fileList',
        type: 'UploadFileItem[]',
        default: '() => []',
        desc: 'File list (`v-model:file-list`).',
      },
      { name: 'action', type: 'string', default: "''", desc: 'Upload endpoint.' },
      {
        name: 'header',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Request headers.',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: 'Allow picking more than one file.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables the picker and every row action.',
      },
      {
        name: 'limit',
        type: 'number',
        default: '0',
        desc: 'Maximum number of files. `0` = unconstrained.',
      },
      {
        name: 'showLimitNum',
        type: 'boolean',
        default: 'true',
        desc: 'Render the `current / limit` counter next to the picker.',
      },
      {
        name: 'maxSize',
        type: 'number',
        default: 'Number.MAX_VALUE',
        desc: 'Per-file byte ceiling.',
      },
      {
        name: 'sourceType',
        type: 'UploadSourceType[]',
        default: "() => ['album'",
        desc: 'Picker sources.',
      },
      {
        name: 'sizeType',
        type: 'UploadSizeType[]',
        default: "() => ['original'",
        desc: 'Image sizing.',
      },
      { name: 'name', type: 'string', default: "'file'", desc: 'Multipart field name.' },
      {
        name: 'formData',
        type: 'Record<string, unknown>',
        default: '() => ({})',
        desc: 'Extra multipart fields.',
      },
      {
        name: 'accept',
        type: 'UploadFileType',
        default: "'image'",
        desc: 'Accepted file category.',
      },
      {
        name: 'imageMode',
        type: "'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix'",
        default: "'aspectFit'",
        desc: 'Preview image fit mode (forwarded to `<image mode>`).',
      },
      {
        name: 'customEvokeClass',
        type: 'string',
        default: "''",
        desc: 'Class on the picker tile.',
      },
      {
        name: 'customPreviewClass',
        type: 'string',
        default: "''",
        desc: 'Class on the preview tile.',
      },
      {
        name: 'autoUpload',
        type: 'boolean',
        default: 'true',
        desc: 'Upload automatically after picking.',
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
    copy: 'Upload 上传 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Upload } from '@snui/uni';",
    chipCopy: "import { Upload } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-upload', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-datetime-picker-view', link: '/components/uni/datetime-picker-view' },
    next: { text: 'sn-sort-button', link: '/components/uni/sort-button' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
