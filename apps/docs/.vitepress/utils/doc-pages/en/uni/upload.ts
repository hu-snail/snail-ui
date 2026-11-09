/** Upload · uni-app (uni-app) — English page data. Props from sn-upload.vue; demos from the en page. */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const uploadDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Form Components' },
    { text: 'Upload · uni-app' },
  ],
  title: 'Upload · uni-app',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app mobile', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'Basic upload: ' },
    { t: 'code', s: 'v-model:file-list' },
    { t: 'text', s: ' holds the list, ' },
    { t: 'code', s: 'limit' },
    { t: 'text', s: ' caps the count and ' },
    { t: 'code', s: 'maxSize' },
    { t: 'text', s: ' caps the bytes (oversize fires otherwise).' },
  ],
  quickActions: [
    { icon: 'copy', label: 'Add @snui/uni', copy: 'pnpm add @snui/uni', copiedLabel: 'Copied' },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-upload',
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
    fileLabel: 'Upload · uni-app.vue',
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
      title: 'Basic usage',
      blurb:
        'Basic upload: `v-model:file-list` holds the list, `limit` caps the count and `maxSize` caps the bytes (oversize fires otherwise).',
    },
    {
      name: 'upload-mp-disabled-status',
      title: 'Disabled & status (`disabled` / `accept` / `showLimitNum`)',
      blurb:
        '`disabled` locks picking and removal; `accept` switches the picker (image / video / file); list entries render progress and the failure state from `status`.',
    },
    {
      name: 'upload-mp-multiple-source',
      title:
        'Multi-select, sources & count limits (`multiple` / `sourceType` / `sizeType` / `accept` / `limit` / `showLimitNum`)',
      blurb:
        '`multiple` picks several at once; `sourceType` / `sizeType` narrow the source and sizing; `accept` switches the picker API; `limit` + `showLimitNum` hides the picker tile once full.',
    },
    {
      name: 'upload-mp-before-hooks',
      title:
        'Veto hooks & size ceiling (`beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` / `maxSize`)',
      blurb:
        '`beforeChoose` / `beforeUpload` / `beforeRemove` / `beforePreview` are veto hooks (the blocked removal is verifiable in the preview); an oversized file emits `oversize`.',
    },
    {
      name: 'upload-mp-preview-custom',
      title:
        'Thumbnail mode & three custom-class layers (`imageMode` / `customEvokeClass` / `customPreviewClass` / `customClass` / `customStyle`)',
      blurb:
        '`imageMode` aspectFit / aspectFill switches the thumbnail fit; `customEvokeClass`, `customPreviewClass` and `customClass` / `customStyle` are three independent layers.',
    },
    {
      name: 'upload-mp-request-method',
      title:
        'Request parameters & custom transfer (`action` / `header` / `name` / `formData` / `buildFormData` / `uploadMethod` / `autoUpload`)',
      blurb:
        '`action` / `header` / `name` / `formData` are `uni.uploadFile` parameters; `buildFormData` builds multipart per file; `uploadMethod` simulates the transfer; `autoUpload=false` waits for `submit()`.',
    },
    {
      name: 'upload-mp-events-counter',
      title:
        'Events & the counter switch (`change` / `remove` / `progress` / `showLimitNum=false`)',
      blurb:
        '`change` fires on every list mutation; `remove` carries the removed entry; `progress` is reserved; `showLimitNum=false` hides the counter; `accept` media / all switches the picker.',
    },
  ],
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
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Upload · uni-app ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Upload } from '@snui/uni';",
    chipCopy: "import { Upload } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-upload', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'sn-datetime-picker-view', link: '/en/components/uni/datetime-picker-view' },
    next: { text: 'sn-sort-button', link: '/en/components/uni/sort-button' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
