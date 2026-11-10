/**
 * AutoComplete 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Events：packages/vue-web/src/auto-complete/SnAutoComplete.vue（withDefaults 真实签名）
 *   - Token：同文件 <style> 段的 --sn-web-auto-complete-* 回退链
 *   - ai-description：packages/vue-web/src/auto-complete/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const autoCompleteDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: 'Form 表单组件' },
    { text: 'AutoComplete 自动补全' },
  ],
  title: 'AutoComplete 自动补全',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '带下拉候选面板的受控文本输入框。输入即出候选、' },
    { t: 'code', s: 'ArrowUp' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'ArrowDown' },
    { t: 'text', s: ' 高亮、' },
    { t: 'code', s: 'Enter' },
    { t: 'text', s: ' 选中、' },
    { t: 'code', s: 'Esc' },
    { t: 'text', s: ' 关闭。候选 label 支持数组形式按段渲染并高亮命中段；面板 token 走 ' },
    { t: 'code', s: '--sn-web-auto-complete-*' },
    { t: 'text', s: '，字段本体回退到 ' },
    { t: 'code', s: '--sn-web-input-*' },
    { t: 'text', s: '。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnAutoComplete } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/auto-complete',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '键盘全流程可达', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
    { text: 'WAI-ARIA combobox', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。静态候选走 ' },
      { t: 'code', s: 'options' },
      { t: 'text', s: '，需要按输入动态计算时传 ' },
      { t: 'code', s: 'getShow' },
      { t: 'text', s: '（优先级高于 ' },
      { t: 'code', s: 'options' },
      { t: 'text', s: '）。' },
    ],
    fileLabel: 'CitySearch.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnAutoComplete } from '@snui/vue-web';",
      '',
      "const city = ref('');",
      "const cities = ['Beijing', 'Berlin', 'Boston', 'Chengdu'];",
      '<\/script>',
      '',
      '<template>',
      '  <SnAutoComplete',
      '    v-model="city"',
      '    :options="cities"',
      '    placeholder="搜索城市"',
      '    clearable',
      '  />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'auto-complete-web-basic',
      title: '基础用法',
      blurb: 'options + v-model。',
    },
    {
      name: 'auto-complete-web-highlight',
      title: '嵌套 label 高亮',
      blurb: 'label 数组按命中段高亮。',
    },
    {
      name: 'auto-complete-web-keyboard',
      title: '键盘选择',
      blurb: 'ArrowUp/Down 高亮 + Enter 选中 + Esc 关闭。',
    },
    {
      name: 'auto-complete-web-getshow',
      title: '动态候选（getShow）',
      blurb: '按输入动态计算候选。',
    },
    {
      name: 'auto-complete-web-states',
      title: 'blurAfterSelect / clearable / 禁用',
      blurb: '选中后失焦、清空、禁用态。',
    },
  ],

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnAutoComplete.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐。' },
      { t: 'code', s: 'getShow' },
      { t: 'text', s: ' 存在时 ' },
      { t: 'code', s: 'options' },
      { t: 'text', s: ' 被忽略。' },
    ],
    rows: [
      { name: 'modelValue', type: 'string', default: "''", desc: 'v-model 绑定值。' },
      { name: 'options', type: 'SnAutoCompleteRawOption[]', default: '[]', desc: '`[]`' },
      { name: 'placeholder', type: 'string', default: "''", desc: '占位文案。' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '清空按钮' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用输入 / 选中 / 清空。' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读，值可见不可编辑且不展开下拉。',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: '尺寸档位。',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: '校验状态，驱动边框色。',
      },
      { name: 'blurAfterSelect', type: 'boolean', default: 'false', desc: '选中候选后失焦' },
      {
        name: 'getShow',
        type: '(value: string) => SnAutoCompleteRawOption[]',
        default: '—',
        desc: '动态候选',
      },
      { name: 'ariaLabel', type: 'string', default: "''", desc: '原生 ARIA 标签。' },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnAutoComplete.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: string)',
        desc: '`v-model` 同步；每次输入、选择和清空时触发。',
      },
      {
        name: 'update:value',
        payload: '(value: string)',
        desc: 'naive-ui 的 `on-update:value` 别名，载荷与 `update:modelValue` 相同。',
      },
      { name: 'change', payload: '(value: string)', desc: '值被提交时触发（选择或清空）。' },
      {
        name: 'select',
        payload: '(value: string)',
        desc: '从下拉列表选中某项时触发（点击或回车）。',
      },
      { name: 'focus', payload: 'FocusEvent', desc: '输入框获得焦点时触发。' },
      { name: 'blur', payload: 'FocusEvent', desc: '输入框失去焦点时触发。' },
      {
        name: 'search',
        payload: '(value: string)',
        desc: '每次输入时触发，对应 naive-ui 的 `on-input`。',
      },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnAutoComplete.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'empty', props: '—', desc: '下拉列表的空状态内容。' }],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnAutoComplete 携带 AI-Friendly 描述（用途 / Import / Props / Events / Slot / A11y），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnAutoComplete } from '@snui/vue-web';",
    chipCopy: "import { SnAutoComplete } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnAutoComplete', tone: 'accent' },
      { key: 'intent.source', value: 'options | getShow', tone: 'cyan' },
      { key: 'a11y', value: 'combobox + listbox', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'InputNumber 数字输入', link: '/components/web/input-number' },
    next: { text: 'Select 选择器', link: '/components/web/select' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
