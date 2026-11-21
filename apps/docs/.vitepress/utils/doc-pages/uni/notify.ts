/**
 * Notify 消息通知（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-notify.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const notifyDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '反馈组件 Feedback' },
    { text: 'Notify 消息通知' },
  ],
  title: 'Notify 消息通知',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '顶部（或底部）卡片通知堆栈：每条消息是一张悬浮圆角卡片——语义色标题与图标、副标题描述、关闭按钮——从屏幕边缘丝滑滑入；旧卡片顺滑下移，在新卡片底部露出一条边（deck 堆叠）。支持左右滑动关闭、按条自定义时长与内容。卡片底色 / 文字色全部来自语义 token（' },
    { t: 'code', s: '--sn-mp-color-action-primary' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-feedback-*' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: '--sn-mp-color-background-elevated' },
    { t: 'text', s: '），在 ' },
    { t: 'code', s: '@snui/tokens-mp/styles' },
    { t: 'text', s: ' 的暗色块里覆盖过，自动适配暗色主题。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-notify',
    },
  ],
  features: [
    { text: 'deck 卡片堆叠', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '滑动关闭 / 触控反馈', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: '页面里放一个 <sn-notify> 作为队列容器，通过模板 ref 调用 show / hide / hideAll。show 的入参即每条消息的完整配置：title 必填，type 决定语义色（default / primary / success / warning / danger），icon 可传 IconData 自定义字形（传 null 隐藏图标），duration = 0 表示常驻，closeText 传空字符串渲染为 X 图标关闭钮。顶部锚点默认自动让位状态栏与导航带（safeAreaInsetTop），无需手动传偏移。' },
    ],
    fileLabel: 'Notify 消息通知.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { ref } from 'vue';
import type { SnNotifyInstance } from '@snui/uni';

const notify = ref<SnNotifyInstance | null>(null);

function upgradeDone(): void {
  notify.value?.show({
    title: '升级成功',
    description: '可以继续使用全部功能了',
    type: 'success',
  });
}
</script>

<template>
  <sn-notify ref="notify" position="top" :duration="4000" />
  <sn-button type="success" @tap="upgradeDone">升级</sn-button>
</template>`,
  },
  demos: [
    {
      name: 'notify-mp-basic',
      title: '基础用法',
      blurb: 'default / primary / success / warning / danger 五种语义色卡片 + 一键清空。',
    },
    {
      name: 'notify-mp-variant',
      title: '堆叠与位置',
      blurb: '连发多条 deck 堆叠（旧卡露边）、maxVisible 队列上限、底部锚点。',
    },
    {
      name: 'notify-mp-style',
      title: '自定义',
      blurb: '自定义图标 / 底色 / 圆角 / X 关闭钮 / 常驻时长 / card 插槽全自定义。',
    },
  ],
  props: {
    hint: [],
    rows: [
      { name: 'position', type: 'NotifyPosition', default: "'top'", desc: '堆叠锚点：top 从顶部滑入，bottom 从底部滑入。' },
      { name: 'duration', type: 'number', default: '4000', desc: '默认自动关闭时长（ms），`0` 表示常驻。' },
      { name: 'maxVisible', type: 'number', default: '3', desc: '队列上限，超出时最旧的卡片以 overflow 关闭。' },
      { name: 'zIndex', type: 'number', default: '9990', desc: '层级' },
      { name: 'closable', type: 'boolean', default: 'true', desc: '是否默认渲染关闭按钮。' },
      { name: 'closeText', type: 'string', default: "'Close'", desc: '默认关闭按钮文案；每条消息可覆盖。' },
      { name: 'swipeToDismiss', type: 'boolean', default: 'true', desc: '前端卡片支持左右滑动关闭。' },
      { name: 'safeAreaInsetTop', type: 'boolean', default: 'true', desc: '顶部锚点自动让位状态栏 + 导航带（微信小程序按胶囊实测，App 按状态栏 + 44px 导航行，H5 无状态栏不偏移）；使用系统默认导航栏的页面（fixed 已在原生导航栏之下）设为 false。' },
      { name: 'safeHeight', type: 'number | string | undefined', default: 'undefined', desc: '额外顶部偏移（裸数字 = px，叠加在安全区让位之上）；传字符串则整体接管 padding-top，替换自动让位。' },
      { name: 'customClass', type: 'string', default: "''", desc: '根节点自定义类名。' },
      { name: 'customStyle', type: 'string', default: "''", desc: '根节点自定义样式。' },
    ],
  },
  events: {
    hint: [{ t: 'text', s: 'open / click 载荷为 { id, title, description, type }；close 额外携带 reason。' }],
    rows: [
      { name: 'open', payload: 'SnNotifyOpenPayload', desc: '消息入队时触发。' },
      { name: 'close', payload: 'SnNotifyClosePayload', desc: '卡片开始关闭时触发；reason：auto（计时）/ close（按钮）/ swipe（滑动）/ api（ref 调用）/ overflow（队列溢出）。' },
      { name: 'click', payload: 'SnNotifyOpenPayload', desc: '前端卡片主体被点击时触发。' },
    ],
  },
  slots: {
    hint: [{ t: 'text', s: '插槽作用于容器内所有卡片；需要逐卡差异化时按 item.id 分支渲染。' }],
    rows: [
      { name: 'card', props: '{ id, title, description, type }', desc: '完全替换卡片内容；自行渲染关闭触发并调用 hide(id)。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Notify 消息通知 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Notify } from '@snui/uni';",
    chipCopy: "import { Notify } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-notify', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'Toast', link: '/components/uni/toast' },
    next: { text: 'NoticeBar', link: '/components/uni/notice-bar' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
