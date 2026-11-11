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
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
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
  props: {
    hint: [],
    rows: [
      { name: 'multiple', type: 'boolean', default: 'false', desc: '多文件' },
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
        desc: '禁用交互：不可触发、不可拖入、不可移除。',
      },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读：文件可见，但不可增删。' },
      { name: 'max', type: 'number', default: '—', desc: '文件数上限（到界隐藏触发）' },
      { name: 'showFileList', type: 'boolean', default: 'true', desc: '显示文件列表' },
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
        desc: '自定义上传（未传不发网络请求直接 done）',
      },
      {
        name: 'defaultUpload',
        type: 'boolean',
        default: 'true',
        desc: 'false 时只入列等手动 submit',
      },
      {
        name: 'onBeforeUpload',
        type: 'SnUploadBeforeUpload | undefined',
        default: 'undefined',
        desc: '单个文件的准入判断；返回 `false`（或抛错）会把该文件排除在列表之外。',
      },
      {
        name: 'dragger',
        type: 'boolean',
        default: 'false',
        desc: '虚线拖放区替代紧凑触发按钮（追加式偏离，见 ai-description.md）',
      },
      {
        name: 'showProgress',
        type: 'boolean',
        default: 'true',
        desc: '上传中且带 `percentage` 时渲染确定性进度条',
      },
      {
        name: 'onPreview',
        type: 'SnUploadPreviewHandler | undefined',
        default: 'undefined',
        desc: "Called when an entry's preview affordance is activated (mirrors n-upload `onPreview`). The `preview` event fires as well, so a host can use either the prop or `@preview`.",
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnUpload.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:fileList',
        payload: '(fileList: SnUploadFile[])',
        desc: '受控镜像内部列表，每次变更都触发。',
      },
      {
        name: 'change',
        payload: '(fileList: SnUploadFile[])',
        desc: '文件列表变化（新增 / 状态流转 / 移除）时触发。',
      },
      { name: 'remove', payload: '(file: SnUploadFile)', desc: '文件从列表移除时触发。' },
      {
        name: 'preview',
        payload: '(file: SnUploadFile)',
        desc: '条目预览入口被激活时触发（`onPreview` 也会调用）。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnUpload.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'trigger', props: '—', desc: '自定义触发内容（替换默认按钮主体）。' }],
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
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
