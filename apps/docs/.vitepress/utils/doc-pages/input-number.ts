/**
 * InputNumber 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Slots：packages/vue-web/src/input-number/SnInputNumber.vue（withDefaults 真实签名）
 *   - Token：同文件 <style> 段的 --sn-web-input-number-* / --sn-web-input-* 回退链
 *   - ai-description：packages/vue-web/src/input-number/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const inputNumberDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: 'Form 表单组件' },
    { text: 'InputNumber 数字输入' },
  ],
  title: 'InputNumber 数字输入',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '带步进按钮的受控数字输入框。步进按钮支持长按连发，' },
    { t: 'code', s: 'buttonMode="spinner"' },
    { t: 'text', s: ' 切换为尾部 ↑↓ 微调底板（上 = 加、下 = 减）；提交时做边界 clamp、' },
    { t: 'code', s: 'precision' },
    { t: 'text', s: ' 定小数位、' },
    { t: 'code', s: 'stepStrictly' },
    { t: 'text', s: ' 吸附步长网格，并提供 ' },
    { t: 'code', s: 'format' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'parse' },
    { t: 'text', s: ' 做展示层转换。视觉 token 与尺寸类名对齐 ' },
    { t: 'code', s: 'SnInput' },
    { t: 'text', s: '，但为独立实现。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnInputNumber } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/input-number',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '长按连发步进', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
    { text: 'WAI-ARIA spinbutton', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。' },
      { t: 'code', s: 'modelValue' },
      { t: 'text', s: ' 为 ' },
      { t: 'code', s: 'null' },
      { t: 'text', s: ' 表示空字段；' },
      { t: 'code', s: 'validator' },
      { t: 'text', s: ' 返回 ' },
      { t: 'code', s: 'false' },
      { t: 'text', s: ' 时拒绝提交并保留旧值。' },
    ],
    fileLabel: 'QuantityField.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnInputNumber } from '@snui/vue-web';",
      '',
      'const quantity = ref<number | null>(1);',
      '<\/script>',
      '',
      '<template>',
      '  <SnInputNumber',
      '    v-model="quantity"',
      '    :min="1"',
      '    :max="99"',
      '    :step="1"',
      '    step-strictly',
      '    button-placement="both"',
      '  />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'input-number-web-basic',
      title: '基础用法',
      blurb: 'v-model + 步进按钮。',
    },
    {
      name: 'input-number-web-bounds',
      title: '边界与步长',
      blurb: 'min / max / step / stepStrictly 吸附。',
    },
    {
      name: 'input-number-web-precision',
      title: '精度（precision）',
      blurb: '小数位四舍五入。',
    },
    {
      name: 'input-number-web-format',
      title: '格式化（format / parse）',
      blurb: '展示层格式化 + 解析回数字。',
    },
    {
      name: 'input-number-web-layout',
      title: '按钮位置 / 尺寸',
      blurb:
        'buttonPlacement: left / both / right；buttonMode: symbol（− +）/ spinner（↑↓）；五档 size。',
    },
    {
      name: 'input-number-web-states',
      title: '禁用 / 只读 / 可清空',
      blurb: 'disabled / readonly / clearable。',
    },
  ],

  tokens: {
    hint: [
      { t: 'text', s: '步进按钮底色由 ' },
      { t: 'code', s: '--sn-web-input-number-btn-bg' },
      { t: 'text', s: ' 控制，其余几何与文字回退到 ' },
      { t: 'code', s: '--sn-web-input-*' },
      { t: 'text', s: '，因此与 Input 共享同一套换肤层。五档高度由 ' },
      { t: 'code', s: 'sn-input-number--{size}' },
      { t: 'text', s: ' 类直接给定（22 / 24 / 28 / 32 / 40px）。' },
    ],
    note: '100% Token 驱动',
    rows: [
      {
        name: 'btn-bg',
        raw: '—',
        alias: '--sn-web-input-number-btn-bg',
        value: 'transparent',
      },
      {
        name: 'btn-hover-bg',
        raw: '—',
        alias: '--sn-web-input-number-btn-hover-bg',
        value: 'var(--sn-web-color-background-soft)',
      },
      {
        name: 'bg',
        raw: '--aui-color-background-surface',
        alias: '--sn-web-input-bg',
        value: '#ffffff',
        swatch: '#ffffff',
      },
      {
        name: 'border-color',
        raw: '--aui-color-border-default',
        alias: '--sn-web-input-border-color',
        value: '#e4e4e7',
        swatch: '#e4e4e7',
      },
      {
        name: 'border-color-focus',
        raw: '--aui-color-action-primary',
        alias: '--sn-web-input-border-color-focus',
        value: '#1677ff',
        swatch: '#1677ff',
      },
      {
        name: 'padding-x',
        raw: '--aui-input-padding-x',
        alias: '--sn-web-input-padding-x',
        value: '12px',
      },
      {
        name: 'radius',
        raw: '--aui-input-radius',
        alias: '--sn-web-input-radius',
        value: '4px',
        kind: 'curve',
      },
      {
        name: 'placeholder-color',
        raw: '--aui-color-text-tertiary',
        alias: '--sn-web-input-placeholder-color',
        value: '#a1a1aa',
        swatch: '#a1a1aa',
      },
    ],
  },

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnInputNumber.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐。' },
      { t: 'code', s: 'buttonPlacement' },
      { t: 'text', s: ' 仅对 ' },
      { t: 'code', s: 'symbol' },
      { t: 'text', s: ' 形态生效，' },
      { t: 'code', s: 'buttonHoverBackground' },
      { t: 'text', s: ' 仅在 ' },
      { t: 'code', s: 'both' },
      { t: 'text', s: ' 位置生效。' },
    ],
    rows: [
      {
        name: 'modelValue',
        type: 'number | null',
        default: 'null',
        desc: 'v-model（null 表示空字段）。',
      },
      { name: 'min / max', type: 'number', default: '—', desc: '边界，越界提交会 clamp。' },
      { name: 'step', type: 'number', default: '1', desc: '步长（按钮 / ArrowUp / ArrowDown）。' },
      { name: 'precision', type: 'number', default: '—', desc: '提交值强制的小数位数。' },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: '尺寸档位。',
      },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用输入 / 按钮 / 清空。' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读，值可见不可编辑。' },
      { name: 'placeholder', type: 'string', default: "''", desc: '占位文案。' },
      {
        name: 'stepStrictly',
        type: 'boolean',
        default: 'false',
        desc: '提交值必须是 step 的整数倍。',
      },
      { name: 'showButton', type: 'boolean', default: 'true', desc: '渲染 + / − 步进按钮。' },
      {
        name: 'buttonPlacement',
        type: "'left' | 'both' | 'right'",
        default: "'right'",
        desc: '按钮位置：right / left 尾部·头部横排，both 分置两端且数字居中。',
      },
      {
        name: 'buttonMode',
        type: "'symbol' | 'spinner'",
        default: "'symbol'",
        desc: '按钮形态（互斥）：symbol = − / +；spinner = 单个 ↑↓ 底板。',
      },
      {
        name: 'buttonBackground',
        type: 'string',
        default: '—',
        desc: '步进按钮底色（任意 CSS background 值）。',
      },
      {
        name: 'buttonHoverBackground',
        type: 'string',
        default: '—',
        desc: '步进按钮悬停底色（仅 both 位置生效）。',
      },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '显示清空按钮。' },
      {
        name: 'format',
        type: '(value: number) => string | number',
        default: '—',
        desc: '展示格式化。',
      },
      {
        name: 'parse',
        type: '(input: string) => number | null',
        default: '—',
        desc: '把用户文本解析回数字。',
      },
      {
        name: 'validator',
        type: '(value: number) => boolean',
        default: '—',
        desc: '提交前校验，返回 false 拒绝提交并保留旧值。',
      },
      {
        name: 'border',
        type: "'all' | 'bottom' | 'none'",
        default: "'all'",
        desc: '边框模式。',
      },
      {
        name: 'bordered (deprecated)',
        type: 'boolean',
        default: 'true',
        desc: "border 的兼容别名：true === 'all'，false === 'none'。",
      },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '原生 ARIA 标签。' },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnInputNumber 携带 AI-Friendly 描述（用途 / Import / Props / Slots / 键盘 / A11y），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnInputNumber } from '@snui/vue-web';",
    chipCopy: "import { SnInputNumber } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnInputNumber', tone: 'accent' },
      { key: 'intent.mode', value: '"symbol" | "spinner"', tone: 'cyan' },
      { key: 'a11y', value: 'role="spinbutton"', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'Input 输入框', link: '/components/web/input' },
    next: { text: 'AutoComplete 自动补全', link: '/components/web/auto-complete' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: 'Token 映射 Tokens' },
    { id: 'api', text: 'API 属性参考 Props' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
