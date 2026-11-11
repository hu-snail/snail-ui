/**
 * Button 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Events / Slots：packages/vue-web/src/button/SnButton.vue（defineProps 真实签名）
 *   - Token：packages/tokens/src/component.ts DEFAULT_COMPONENT_TOKENS.button
 *     + packages/tokens/styles/index.css 的 --aui-button-* / --sn-button-* 双族发射
 *   - ai-description：packages/vue-web/src/button/ai-description.md
 * 侧栏顺序中 Button 是 Basic 组第一个组件，故无上一篇。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const buttonDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '基础组件 Basic' }, { text: 'Button 按钮' }],
  title: 'Button 按钮',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '最常用的交互原语，触发一个即时操作。提供 7 种语义类型、5 档尺寸、' },
    { t: 'code', s: 'loading' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'disabled' },
    { t: 'text', s: ' 状态与 ' },
    { t: 'code', s: 'text' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'ghost' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'dashed' },
    { t: 'text', s: ' 变体，内置完整无障碍语义。Web 端直接消费 ' },
    { t: 'code', s: '--sn-web-*' },
    {
      t: 'text',
      s: ' 语义变量，与 Uni 端共享同一套 Token 级联 —— 主题编辑器换肤后本页所有演示实时跟随。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnButton } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/button',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '触控与焦点反馈', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
    { text: 'WAI-ARIA 无障碍语义', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 直接引入 ' },
      { t: 'code', s: 'SnButton' },
      { t: 'text', s: ' 即用。' },
      { t: 'code', s: 'loading' },
      { t: 'text', s: ' 状态自带 spinner 并阻止重复点击，与 ' },
      { t: 'code', s: 'disabled' },
      { t: 'text', s: ' 一起在事件层生效。' },
    ],
    fileLabel: 'SubmitDemo.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnButton } from '@snui/vue-web';",
      '',
      'const submitting = ref(false);',
      '',
      'async function onSubmit(): Promise<void> {',
      '  submitting.value = true;',
      '  try {',
      '    await submitTicket();',
      '  } finally {',
      '    submitting.value = false;',
      '  }',
      '}',
      '<\/script>',
      '',
      '<template>',
      '  <SnButton type="primary" size="large" :loading="submitting" @click="onSubmit">',
      '    提交工单',
      '  </SnButton>',
      '</template>',
    ].join('\n'),
  },

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnButton.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐；' },
      { t: 'code', s: 'tag' },
      { t: 'text', s: ' 切换根元素后，原生 button 专属行为（disabled / attrType）随之失效。' },
    ],
    rows: [
      {
        name: 'type',
        type: "'default' | 'primary' | 'info' | 'success' | 'warning' | 'error' | 'tertiary'",
        default: "'default'",
        desc: '按钮语义类型，驱动配色与 hover 反馈。',
      },
      {
        name: 'round',
        type: 'boolean',
        default: 'false',
        desc: '胶囊形（`border-radius: 999px`）。',
      },
      { name: 'circle', type: 'boolean', default: 'false', desc: '圆形（正方形 padding）。' },
      { name: 'block', type: 'boolean', default: 'false', desc: '块级（占满父容器宽度）。' },
      { name: 'text', type: 'boolean', default: 'false', desc: '文字按钮 — 透明背景、无边框。' },
      { name: 'dashed', type: 'boolean', default: 'false', desc: '虚线边框。' },
      { name: 'ghost', type: 'boolean', default: 'false', desc: '透明背景 + 着色边框。' },
      { name: 'secondary', type: 'boolean', default: 'false', desc: '反色 hover（视觉变体）。' },
      {
        name: 'tertiary',
        type: 'boolean',
        default: 'false',
        desc: '弱化主色填充（soft-bg variant）。',
      },
      { name: 'quaternary', type: 'boolean', default: 'false', desc: '文字型 tertiary。' },
      { name: 'strong', type: 'boolean', default: 'false', desc: '加重阴影（实心按钮）。' },
      {
        name: 'color',
        type: 'string',
        default: '—',
        desc: '自定义 CSS 颜色；`--sn-button-color` token 覆盖 type 配色。',
      },
      {
        name: 'size',
        type: "'tiny' | 'small' | 'medium' | 'large' | 'huge'",
        default: "'medium'",
        desc: '尺寸级别，联动高度与字号。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用。' },
      {
        name: 'loading',
        type: 'boolean',
        default: 'false',
        desc: '加载中（spinner + 阻止 click）。',
      },
      {
        name: 'attrType',
        type: "'button' | 'submit' | 'reset'",
        default: "'button'",
        desc: '原生 <button> 的 type 属性。',
      },
      {
        name: 'tag',
        type: "'button' | 'a' | 'div' | 'span'",
        default: "'button'",
        desc: "根元素。'a' 时 disabled 失效（HTMLAnchorElement 不支持）。",
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '无障碍标签。' },
      { name: 'focusable', type: 'boolean', default: 'true', desc: '是否可 tab 聚焦。' },
      { name: 'icon', type: 'IconComponent', default: '—', desc: '直接传 lucide 组件。' },
      { name: 'iconName', type: 'string', default: '—', desc: '通过 `registerSnIcons` 解析。' },
      { name: 'iconPlacement', type: "'left' | 'right'", default: "'left'", desc: '图标位置。' },
      { name: 'iconSize', type: 'number | string', default: '14', desc: '`14`' },
      {
        name: 'showIcon',
        type: 'boolean',
        default: 'true',
        desc: '是否显示图标。`false` 隐藏（loading 仍显示 spinner）。',
      },
      {
        name: 'htmlType (deprecated)',
        type: "'button' | 'submit' | 'reset'",
        default: '—',
        desc: 'attrType 的 legacy alias。',
      },
      {
        name: 'bordered (deprecated)',
        type: 'boolean',
        default: 'true',
        desc: '旧 border 标志，保留向后兼容。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnButton.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'click',
        payload: 'MouseEvent',
        desc: '原生点击；`disabled` 或 `loading` 时不派发。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnButton.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [
      { name: 'default', props: '—', desc: '默认插槽，按钮文本内容。' },
      { name: 'icon', props: '—', desc: '自定义图标，渲染在默认内容之前。' },
      { name: 'loading', props: '—', desc: '自定义加载指示器，替换默认 spinner。' },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnButton 携带 AI-Friendly 描述（用途 / Import / Props / Events / Slots / A11y），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnButton } from '@snui/vue-web';",
    chipCopy: "import { SnButton } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnButton', tone: 'accent' },
      { key: 'intent.type', value: '"primary"', tone: 'cyan' },
      { key: 'a11y', value: 'native button', tone: 'ok' },
    ],
  },

  demos: [
    {
      name: 'button-web-basic',
      title: '基础用法',
      blurb: '六种语义类型：default / primary / info / success / warning / error。',
    },
    {
      name: 'button-web-size',
      title: '尺寸',
      blurb: '5 档高度（tiny → huge），覆盖紧凑列表到首屏 CTA。',
    },
    {
      name: 'button-web-shape',
      title: '块级与圆角',
      blurb: 'block 占满父容器宽度；round 应用胶囊形圆角。',
    },
    {
      name: 'button-web-state',
      title: '状态',
      blurb: 'disabled 完全禁用；loading 显示 spinner 且不可点击。',
    },
    {
      name: 'button-web-variant',
      title: '变体',
      blurb: 'text 文字按钮 / ghost 透明边框 / dashed 虚线边框。',
    },
    {
      name: 'button-web-emphasis',
      title: '强调梯度',
      blurb: 'circle 圆形仅图标；strong 主色阴影；secondary / tertiary / quaternary。',
    },
    {
      name: 'button-web-color',
      title: '自定义颜色',
      blurb: 'color prop 设置自定义 CSS 颜色 → --sn-button-color。',
    },
    {
      name: 'button-web-tag',
      title: '根标签切换',
      blurb: "tag='a' 渲染为链接；tag='div' 渲染为容器；默认 button。",
    },
    {
      name: 'button-web-doodle',
      title: '涂鸦风格',
      blurb: 'Doodle 风格包：粗墨边 + 硬阴影 + 波浪圆角。',
    },
    {
      name: 'button-web-icon-placement',
      title: '图标位置',
      blurb: "iconPlacement 'right' 图标放右边；showIcon false 隐藏图标。",
    },
    {
      name: 'button-web-attr-type',
      title: '原生属性',
      blurb: 'attrType 提交表单；focusable false 移除 tab 焦点。',
    },
  ],

  pager: {
    next: { text: 'Divider 分割线', link: '/components/web/divider' },
  },

  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
