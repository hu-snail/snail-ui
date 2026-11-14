/**
 * Captcha 拼图验证（uni 端）组件详情页数据。
 *
 * Props 与默认值取自 sn-captcha.vue 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../../components/doc-page/types';

export const captchaDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '录入组件 Form' },
    { text: 'Captcha 拼图验证' },
  ],
  title: 'Captcha 拼图验证',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'uni-app x 移动端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '不适用：行为式滑块（用 ' },
    { t: 'code', s: 'sn-slide-verify' },
    { t: 'text', s: '）、短信 / 图形验证码输入（宿主业务）、服务端票据校验（宿主必须）。' },
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
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/uni/src/components/sn-captcha',
    },
  ],
  features: [
    { text: 'rpx 跨设备缩放', icon: 'layers' },
    { text: 'easycom 自动注册', icon: 'eco' },
    { text: '触控交互优化', icon: 'touch' },
  ],
  usage: {
    hint: [
      { t: 'text', s: 'uni-app x 走 easycom 自动注册，无需手动 import；如需显式引入见下方代码。' },
    ],
    fileLabel: 'Captcha 拼图验证.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { Captcha } from '@snui/uni';
</script>

<template>
  <sn-captcha />
</template>`,
  },
  demos: [
    { name: 'captcha-mp-basic', title: '基础用法', blurb: '基础用法' },
    { name: 'captcha-mp-verify', title: '内嵌展示', blurb: '内嵌展示' },
    { name: 'captcha-mp-popup', title: '点击弹出', blurb: '点击弹出' },
    {
      name: 'captcha-mp-interaction',
      title: '两段式验证（组合滑块）',
      blurb: '两段式验证（组合滑块）',
    },
    {
      name: 'captcha-mp-copy',
      title: '自定义文案（tips / successText）',
      blurb: '自定义文案（tips / successText）',
    },
    {
      name: 'captcha-mp-size-tolerance',
      title: '尺寸与容差（width / height / tolerance）',
      blurb: '尺寸与容差（width / height / tolerance）',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'boolean',
        default: 'false',
        desc: '验证码弹层是否显示（`v-model`）。',
      },
      {
        name: 'src',
        type: 'string',
        default: "''",
        desc: 'Background image URL (network / package path, not base64).',
      },
      {
        name: 'width',
        type: 'number',
        default: '300',
        desc: '舞台最大宽度（设计 px），也是无法测量时的行程基准',
      },
      { name: 'height', type: 'number', default: '200', desc: '舞台高度（设计 px）' },
      {
        name: 'tips',
        type: 'string',
        default: "''",
        desc: 'Hint text under the stage while dragging.',
      },
      { name: 'successText', type: 'string', default: "''", desc: 'Success text overlay.' },
      { name: 'tolerance', type: 'number', default: '10', desc: '对齐容差（设计 px）' },
      { name: 'zIndex', type: 'number', default: '100', desc: '弹层层级（`inline` 下不生效）' },
      { name: 'closeOnClickModal', type: 'boolean', default: 'true', desc: '点遮罩关闭' },
      { name: 'refreshable', type: 'boolean', default: 'true', desc: '显示「换一张」按钮' },
      {
        name: 'inline',
        type: 'boolean',
        default: 'false',
        desc: '内嵌展示：不渲染遮罩与关闭按钮，通过后不自动关闭',
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Extra class on the root node.' },
      {
        name: 'customStyle',
        type: 'string',
        default: "''",
        desc: 'Extra inline style on the root node.',
      },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'Captcha 拼图验证 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { Captcha } from '@snui/uni';",
    chipCopy: "import { Captcha } from '@snui/uni';",
    stats: [
      { key: 'intent.action', value: 'sn-captcha', tone: 'accent' },
      { key: 'intent.end', value: 'uni', tone: 'cyan' },
      { key: 'unit', value: 'rpx', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'SlideVerify', link: '/components/uni/slide-verify' },
    next: { text: 'Popup', link: '/components/uni/popup' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
