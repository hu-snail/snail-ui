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
    { label: 'Web', tone: 'accent', icon: 'dual' },
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
    { name: 'video-player-web-basic', title: 'Basic', blurb: 'Basic' },
    { name: 'video-player-web-danmaku', title: 'Danmaku', blurb: 'Danmaku' },
    {
      name: 'video-player-web-quality',
      title: 'Quality ladder (progressive)',
      blurb: 'Quality ladder (progressive)',
    },
    { name: 'video-player-web-pip', title: 'Picture-in-picture', blurb: 'Picture-in-picture' },
    {
      name: 'video-player-web-mini',
      title: 'Mini window (auto-dock on scroll)',
      blurb: 'Mini window (auto-dock on scroll)',
    },
    { name: 'video-player-web-download', title: 'Download', blurb: 'Download' },
    {
      name: 'video-player-web-hls-live',
      title: 'Live + HLS bridge (hls.js, public live stream)',
      blurb: 'Live + HLS bridge (hls.js, public live stream)',
    },
    {
      name: 'video-player-web-hls-vod',
      title: 'Multi-bitrate VOD (qualities from the stream)',
      blurb: 'Multi-bitrate VOD (qualities from the stream)',
    },
  ],
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
      {
        name: 'onDownload',
        type: '(source: SnBridgeSource) => void | string | Promise<string>',
        default: '—',
        desc: 'Custom download handler; return a URL to open instead of the source.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: 'Event names mirror the ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' signature of ' },
      { t: 'code', s: 'SnVideoPlayer.vue' },
      { t: 'text', s: ' 1:1; payloads list the callback arguments.' },
    ],
    rows: [
      { name: 'play', payload: '—', desc: 'Fired when playback starts.' },
      { name: 'pause', payload: '—', desc: 'Fired when playback pauses.' },
      { name: 'ended', payload: '—', desc: 'Fired when playback reaches the end.' },
      {
        name: 'timeupdate',
        payload: '(currentTime: number)',
        desc: 'Fired as playback progresses; payload is the current time in seconds.',
      },
      {
        name: 'seeked',
        payload: '(currentTime: number)',
        desc: 'Fired after a seek completes; payload is the current time in seconds.',
      },
      { name: 'waiting', payload: '—', desc: 'Fired when playback stalls waiting for data.' },
      {
        name: 'canplay',
        payload: '—',
        desc: 'Fired when enough data is buffered to start playing.',
      },
      {
        name: 'error',
        payload: '(error: unknown)',
        desc: 'Fired when the media fails to load or decode.',
      },
      { name: 'ready', payload: '—', desc: 'Fired once the player is ready.' },
      {
        name: 'rate-change',
        payload: '(rate: number)',
        desc: 'Fired when the playback rate changes.',
      },
      {
        name: 'volume-change',
        payload: '(state: { volume: number; muted: boolean })',
        desc: 'Fired when volume or muted state changes.',
      },
      {
        name: 'fullscreen-change',
        payload: '(fullscreen: boolean)',
        desc: 'Fired when fullscreen state changes.',
      },
      {
        name: 'pip-change',
        payload: '(active: boolean)',
        desc: 'Fired when picture-in-picture state changes.',
      },
      {
        name: 'update:mini',
        payload: '(mini: boolean)',
        desc: 'Mini-window visibility changed (`v-model:mini`).',
      },
      {
        name: 'mini-change',
        payload: '(mini: boolean)',
        desc: 'Fired when the mini floating window is toggled.',
      },
      {
        name: 'quality-change',
        payload: '(quality: { id: string | number; label?: string })',
        desc: 'Fired when the active quality ladder entry changes.',
      },
      {
        name: 'danmu-send',
        payload: '(danmu: SnVideoDanmu)',
        desc: 'Fired when a danmu is sent; payload is the danmu entry.',
      },
      {
        name: 'download',
        payload: '(source: SnBridgeSource)',
        desc: 'Fired when download is activated; payload is the active source.',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: 'Slots mirror the ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' outlets of ' },
      { t: 'code', s: 'SnVideoPlayer.vue' },
      { t: 'text', s: ' 1:1; scope lists the slot props you can destructure.' },
    ],
    rows: [{ name: 'error', props: '—', desc: 'Replaces the error panel content.' }],
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
    { id: 'api', text: 'API Reference' },
    { id: 'ai-native', text: 'AI-native integration' },
  ],
};
