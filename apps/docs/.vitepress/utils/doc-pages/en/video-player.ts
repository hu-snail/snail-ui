/** VideoPlayer · Web (Web) — English page data. Props from video-player SFC; demos from the en page. */
import type { SnDocPageData } from '../../components/doc-page/types';

export const videoPlayerDocPageEn: SnDocPageData = {
  crumbs: [
    { text: 'Docs', link: '/en/' },
    { text: 'Feedback Components' },
    { text: 'VideoPlayer · Web' },
  ],
  title: 'VideoPlayer · Web',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App parity', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: 'A full video player: danmaku, picture-in-picture, a mini floating window,' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/video-player',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'VideoPlayer · Web.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { VideoPlayer } from '@snui/vue-web';
</script>

<template>
  <VideoPlayer />
</template>`,
  },
  demos: [
    {
      name: 'video-player-web-basic',
      title: 'Examples',
      blurb:
        'src + poster: centered play button, full control bar, hover time preview, volume slider and keyboard shortcuts (Space play/pause, ←→ ±5s, ↑↓ volume, M mute, F fullscreen).',
    },
  ],
  tokens: { hint: [], note: '', rows: [] },
  props: {
    hint: [],
    rows: [
      {
        name: 'src',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: 'Media URL (plain mode). Ignored while a bridge owns loading.',
      },
      {
        name: 'poster',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: 'Poster shown before the first frame.',
      },
      {
        name: 'title',
        type: 'string',
        default: 'undefined as unknown as string',
        desc: 'Accessible name for the video; also the mini-window header text.',
      },
      {
        name: 'qualities',
        type: 'SnVideoQuality[]',
        default: '() => []',
        desc: 'Progressive quality ladder (MP4/WebM).',
      },
      {
        name: 'defaultQuality',
        type: 'string | number',
        default: 'undefined as unknown as string | number',
        desc: 'Initially selected ladder entry (`qualities[].value`).',
      },
      { name: 'autoplay', type: 'boolean', default: 'false', desc: 'autoplay' },
      { name: 'muted', type: 'boolean', default: 'false', desc: 'muted' },
      { name: 'loop', type: 'boolean', default: 'false', desc: 'loop' },
      {
        name: 'preload',
        type: "'none' | 'metadata' | 'auto'",
        default: "'metadata'",
        desc: 'preload',
      },
      { name: 'volume', type: 'number', default: '1', desc: '0–1, applied on mount.' },
      { name: 'rate', type: 'number', default: '1', desc: 'Initial playback rate.' },
      {
        name: 'live',
        type: 'boolean',
        default: 'undefined as unknown as boolean',
        desc: 'Force live mode; `undefined` sniffs `duration === Infinity` / bridge.',
      },
      {
        name: 'shortcuts',
        type: 'boolean',
        default: 'true',
        desc: 'Keyboard shortcuts (Space/K, ←→, ↑↓, M, F, P, D).',
      },
      { name: 'danmus', type: 'SnVideoDanmu[]', default: '() => []', desc: 'Danmaku timeline.' },
      { name: 'danmuVisible', type: 'boolean', default: 'true', desc: 'Show the danmu layer.' },
      { name: 'danmuSend', type: 'boolean', default: 'true', desc: 'Show the danmu input box.' },
      { name: 'danmuOpacity', type: 'number', default: '1', desc: '0–1.' },
      { name: 'danmuSpeed', type: 'number', default: '1', desc: 'Velocity multiplier.' },
      {
        name: 'danmuFontSize',
        type: 'number',
        default: '16',
        desc: 'Base font size in px (scales with player width).',
      },
      {
        name: 'danmuArea',
        type: 'number',
        default: '0.75',
        desc: 'Fraction of the height usable for danmu lanes (0–1).',
      },
      {
        name: 'mini',
        type: 'boolean',
        default: 'undefined as unknown as boolean',
        desc: 'Mini floating window (controlled). `undefined` → uncontrolled.',
      },
      {
        name: 'miniOnScrollOut',
        type: 'boolean',
        default: 'false',
        desc: 'Auto-dock into the mini window when scrolled out of view.',
      },
      { name: 'miniWidth', type: 'number', default: '320', desc: 'Docked window width in px.' },
      {
        name: 'pip',
        type: 'boolean',
        default: 'true',
        desc: 'Picture-in-picture toggle (button only renders when supported).',
      },
      {
        name: 'download',
        type: 'boolean',
        default: 'true',
        desc: 'Download button (hidden for live / bridge-owned media).',
      },
      {
        name: 'settings',
        type: 'boolean',
        default: 'true',
        desc: 'Settings menu (quality / rate / loop).',
      },
      {
        name: 'sourceBridge',
        type: 'SnVideoSourceBridge',
        default: 'undefined as unknown as SnVideoSourceBridge',
        desc: 'Third-party streaming bridge (HLS / DASH / FLV) — installed by the host app, never bundled with the library. See the docs guide.',
      },
      {
        name: 'width',
        type: 'string | number',
        default: 'undefined as unknown as string | number',
        desc: 'Player width (number → px).',
      },
      { name: 'aspectRatio', type: 'string', default: "'16 / 9'", desc: 'Player aspect ratio.' },
    ],
  },
  ai: {
    badge: 'ai-description.md · bundled',
    heading: 'A machine-readable contract for LLMs',
    copy: 'VideoPlayer · Web ships an AI-friendly description consumed by @snui/cli generateDocs() and generateLlmsTxt().',
    chip: "import { VideoPlayer } from '@snui/vue-web';",
    chipCopy: "import { VideoPlayer } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'VideoPlayer', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'video-preview', link: '/en/components/web/video-preview' },
    next: { text: 'list', link: '/en/components/web/list' },
  },
  toc: [
    { id: 'usage', text: 'Usage' },
    { id: 'demos', text: 'Examples' },
    { id: 'tokens', text: 'Design tokens' },
    { id: 'api', text: 'API reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
