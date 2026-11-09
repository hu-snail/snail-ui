/**
 * Upload 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const uploadDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'Upload' }],
  title: 'Upload',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '文件上传。按钮 / 拖拽区 / 输入框 / 弹窗四种触发形态，本地列表状态机，customRequest 驱动上传并回报进度。',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/upload',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Upload.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Upload } from '@snui/vue-web';
</script>

<template>
  <Upload />
</template>`,
  },
  demos: [
    {
      name: 'upload-web-basic',
      title: '基础用法',
      blurb: '点击/拖放选文件入列（无 customRequest 直接 done）。',
    },
    {
      name: 'upload-web-dragger',
      title: '拖拽上传（dragger）',
      blurb: 'dragger 拖放区 + 进度动画 + 点击条目名称或眼镜图标预览。',
    },
    {
      name: 'upload-web-input',
      title: '输入框 + 上传',
      blurb: '输入框回显 + Progress 进度动画 + 点击文件名打开预览弹窗。',
    },
    { name: 'upload-web-dialog', title: '弹窗上传', blurb: '弹窗内拖拽上传，完成后回填页面。' },
    {
      name: 'upload-web-custom',
      title: '自定义上传（customRequest）',
      blurb: 'Promise resolve/reject 推进 uploading → done/error。',
    },
    {
      name: 'upload-web-image',
      title: '图片列表（listType）',
      blurb: "listType='image' 缩略图 + objectURL 自动回收。",
    },
    {
      name: 'upload-web-bounds',
      title: '上传前校验（beforeUpload）与上限（max）',
      blurb: 'beforeUpload 拒绝不入列；max 到界隐藏触发。',
    },
    { name: 'upload-web-states', title: '禁用', blurb: 'disabled。' },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: 'Allow picking / dropping several files at once.',
      },
      {
        name: 'accept',
        type: 'string',
        default: "''",
        desc: '`accept` attribute forwarded to the hidden file input.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disables interaction — no trigger, no drops, no removes.',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: 'Read-only — files visible, no adding / removing.',
      },
      {
        name: 'max',
        type: 'number',
        default: '—',
        desc: 'Max file count — the trigger hides once reached.',
      },
      {
        name: 'showFileList',
        type: 'boolean',
        default: 'true',
        desc: 'Show the file list (default true).',
      },
      {
        name: 'listType',
        type: 'SnUploadListType',
        default: "'text'",
        desc: 'List rendering style: rows, or rows with objectURL thumbnails.',
      },
      {
        name: 'customRequest',
        type: 'SnUploadCustomRequest | undefined',
        default: 'undefined',
        desc: 'Custom upload driver. Resolve → done, reject → error. Without it no network request is made — the component only maintains local state.',
      },
      {
        name: 'defaultUpload',
        type: 'boolean',
        default: 'true',
        desc: 'Auto-upload on accept (default true). false → pending until submit().',
      },
      {
        name: 'onBeforeUpload',
        type: 'SnUploadBeforeUpload | undefined',
        default: 'undefined',
        desc: 'Per-file gate; false (or a throw) keeps the file out of the list.',
      },
      {
        name: 'dragger',
        type: 'boolean',
        default: 'false',
        desc: 'Render a full dashed drop area instead of the compact trigger button. Additive divergence — n-upload has no `dragger`. The accept path is identical (click opens the picker, drops anywhere on the root land in the list).',
      },
      {
        name: 'showProgress',
        type: 'boolean',
        default: 'true',
        desc: 'Render a determinate progress bar on `uploading` entries that carry a `percentage` (written by the `customRequest` driver). Entries without one keep the indeterminate spinner.',
      },
      {
        name: 'onPreview',
        type: 'SnUploadPreviewHandler | undefined',
        default: 'undefined',
        desc: "Called when an entry's preview affordance is activated (mirrors n-upload `onPreview`). The `preview` event fires as well, so a host can use either the prop or `@preview`.",
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Upload 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Upload } from '@snui/vue-web';",
    chipCopy: "import { Upload } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Upload', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'mention', link: '/components/web/mention' },
    next: { text: 'checkbox', link: '/components/web/checkbox' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: '设计令牌 Tokens' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
