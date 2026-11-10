/** VideoPreview · Web (Web) — English page data. Props from video-preview SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const videoPreviewDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'VideoPreview · Web' },
  ],
  title: 'VideoPreview · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: 'A video media box: poster plus a centered play button that starts inline playback,',
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/video-preview',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'VideoPreview · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VideoPreview } from '@snui/vue-web';
</script>

<template>
  <VideoPreview />
</template>`,
  },
  demos: [
    { name: 'video-preview-web-basic', title: 'Basic', blurb: 'Basic' },
    {
      name: 'video-preview-web-controls',
      title: 'Custom bar vs native controls',
      blurb: 'Custom bar vs native controls',
    },
    {
      name: 'video-preview-web-background',
      title: 'Background / banner video',
      blurb: 'Background / banner video',
    },
    {
      name: 'video-preview-web-overlay',
      title: 'Full-screen preview',
      blurb: 'Full-screen preview',
    },
    {
      name: 'video-preview-web-custom-poster',
      title: 'Custom poster and slots',
      blurb: 'Custom poster and slots',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'src', type: 'string', default: '—', desc: 'Video source. Required.' },
      {
        name: 'poster',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Poster shown before playback starts. Ignored while `background`.',
      },
      {
        name: 'previewSrc',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Dedicated (larger) overlay url; falls back to `src`.',
      },
      {
        name: 'width',
        type: 'string | number',
        default: '320',
        desc: 'Box width (number → px). Ignored while `background` (fills the parent).',
      },
      {
        name: 'height',
        type: 'string | number | undefined',
        default: 'undefined',
        desc: 'Box height (number → px). Explicit `undefined` keeps the ratio.',
      },
      {
        name: 'aspectRatio',
        type: 'string | undefined',
        default: 'undefined',
        desc: "Box aspect ratio applied when no explicit `height` is given, e.g. `'16 / 9'`.",
      },
      {
        name: 'objectFit',
        type: "'contain' | 'cover' | 'fill'",
        default: "'cover'",
        desc: "How the video fits its box. Forced to `'cover'` while `background`.",
      },
      {
        name: 'controls',
        type: 'boolean',
        default: 'true',
        desc: 'Render OUR custom, beautified control bar (never the native one).',
      },
      {
        name: 'nativeControls',
        type: 'boolean',
        default: 'false',
        desc: "Render the browser's own `controls` attribute (unstylable, UA-drawn).",
      },
      {
        name: 'background',
        type: 'boolean',
        default: 'false',
        desc: 'Decorative banner / section-background mode: no controls at all, forced `muted` + `autoplay` + `loop` + `cover`, fills the positioned parent and the video is `aria-hidden` + `pointer-events: none`.',
      },
      {
        name: 'autoplay',
        type: 'boolean',
        default: 'false',
        desc: 'Start inline playback on mount (browsers require `muted` for this).',
      },
      { name: 'loop', type: 'boolean', default: 'false', desc: 'Loop inline playback.' },
      { name: 'muted', type: 'boolean', default: 'false', desc: 'Mute inline playback.' },
      {
        name: 'preload',
        type: "'none' | 'metadata' | 'auto'",
        default: "'metadata'",
        desc: 'Preload strategy.',
      },
      {
        name: 'previewDisabled',
        type: 'boolean',
        default: 'false',
        desc: 'Disable the overlay: no toolbar affordance, `showPreview()` is a no-op.',
      },
      {
        name: 'showToolbar',
        type: 'boolean',
        default: 'true',
        desc: 'Render the top-right overlay affordance.',
      },
      {
        name: 'closeOnMaskClick',
        type: 'boolean',
        default: 'true',
        desc: 'Close the overlay when its mask is clicked.',
      },
      {
        name: 'title',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Overlay header text, and the accessible name of the video.',
      },
      {
        name: 'alt',
        type: 'string | undefined',
        default: 'undefined',
        desc: 'Accessible description of the video; takes precedence over `title`.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnVideoPreview.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      { name: 'play', payload: '—', desc: 'Inline playback started.' },
      { name: 'pause', payload: '—', desc: 'Inline playback paused.' },
      { name: 'ended', payload: '—', desc: 'Inline playback reached the end.' },
      { name: 'error', payload: 'Event', desc: 'The video element failed to load or decode.' },
      { name: 'preview', payload: '—', desc: 'The overlay was opened.' },
      {
        name: 'close',
        payload: '—',
        desc: 'The overlay was closed (ESC / mask / close button / `closePreview()`).',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnVideoPreview.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [
      {
        name: 'placeholder',
        props: '—',
        desc: 'Replaces the poster area until a poster exists or playback starts.',
      },
      { name: 'play-icon', props: '—', desc: 'Replaces the centered play glyph.' },
      {
        name: 'toolbar',
        props: '{ showPreview: () => void }',
        desc: 'Replaces the top-right overlay affordance; receives the open trigger.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'VideoPreview · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { VideoPreview } from '@snui/vue-web';",
    chipCopy: "import { VideoPreview } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'VideoPreview', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'image', link: '/en/components/web/image' },
    next: { text: 'video-player', link: '/en/components/web/video-player' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
