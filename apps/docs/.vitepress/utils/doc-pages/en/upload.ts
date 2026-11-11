/** Upload · Web (Web) — English page data. Props from upload SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const uploadDocPageEn: SnDocPageData = {
  crumbs: [{ text: 'Docs', link: '/en/' }, { text: 'Form Components' }, { text: 'Upload · Web' }],
  title: 'Upload · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'File upload. Four trigger shapes — button / drop area / input row / modal — with a local list state machine and a customRequest-driven upload that reports progress.',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'Add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: 'Copied',
    },
    {
      icon: 'link',
      label: 'View source',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/upload',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'Upload · Web.vue',
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
      title: 'Basic',
      blurb: 'Click/drop files into the list (no customRequest → immediate done).',
    },
    {
      name: 'upload-web-dragger',
      title: 'Drag and drop (dragger)',
      blurb:
        'dragger drop area + progress animation + preview from the name or the eye affordance.',
    },
    {
      name: 'upload-web-input',
      title: 'Input + upload',
      blurb: 'Input mirror + Progress animation + click a file name to open the preview modal.',
    },
    {
      name: 'upload-web-dialog',
      title: 'Upload in a modal',
      blurb: 'Drag-and-drop inside a modal, committed back to the page on confirm.',
    },
    {
      name: 'upload-web-custom',
      title: 'Custom upload (customRequest)',
      blurb: 'Promise resolve/reject drives uploading → done/error.',
    },
    {
      name: 'upload-web-image',
      title: 'Image list (listType)',
      blurb: "listType='image' thumbnails + objectURL recycling.",
    },
    {
      name: 'upload-web-bounds',
      title: 'beforeUpload & max',
      blurb: 'beforeUpload rejects entry; max hides the trigger at limit.',
    },
    { name: 'upload-web-states', title: 'Disabled', blurb: 'disabled.' },
  ],
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
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnUpload.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      {
        name: 'update:fileList',
        payload: '(fileList: SnUploadFile[])',
        desc: 'Controlled mirror of the internal list; fires on every mutation.',
      },
      {
        name: 'change',
        payload: '(fileList: SnUploadFile[])',
        desc: 'The file list changed (add / status move / remove).',
      },
      {
        name: 'remove',
        payload: '(file: SnUploadFile)',
        desc: 'A file was removed from the list.',
      },
      {
        name: 'preview',
        payload: '(file: SnUploadFile)',
        desc: "An entry's preview affordance was activated (`onPreview` also fires).",
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnUpload.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'trigger',
        props: '—',
        desc: 'Custom trigger content (replaces the default button body).',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'Upload · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { Upload } from '@snui/vue-web';",
    chipCopy: "import { Upload } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'Upload', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'mention', link: '/en/components/web/mention' },
    next: { text: 'checkbox', link: '/en/components/web/checkbox' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
