/**
 * DynamicInput 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Slot：packages/vue-web/src/dynamic-input/SnDynamicInput.vue（withDefaults 真实签名）
 *   - Token：同文件 <style> 段的 --sn-web-dynamic-input-* 回退链
 *   - ai-description：packages/vue-web/src/dynamic-input/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dynamicInputDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: 'Form 表单组件' },
    { text: 'DynamicInput 动态输入' },
  ],
  title: 'DynamicInput 动态输入',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '按 ' },
    { t: 'code', s: 'modelValue' },
    {
      t: 'text',
      s: ' 数组渲染一行一值的可编辑行：原始值（string / number）用内置 token 化输入框编辑，对象值行走 scoped 默认插槽。每行右侧 − / + 按钮做行删除与行后插入，项数触达 ',
    },
    { t: 'code', s: 'min' },
    { t: 'text', s: ' / ' },
    { t: 'code', s: 'max' },
    { t: 'text', s: ' 时对应按钮隐藏；每次变更 emit 整个新数组。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnDynamicInput } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dynamic-input',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '行内增删交互', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。文本行需要 ' },
      { t: 'code', s: "preset: () => ''" },
      { t: 'text', s: '（默认是 ' },
      { t: 'code', s: 'null' },
      { t: 'text', s: '，对齐 naive-ui 语义）；对象行必须提供 scoped 默认插槽。' },
    ],
    fileLabel: 'ContactList.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnDynamicInput } from '@snui/vue-web';",
      '',
      "const phones = ref<string[]>(['']);",
      '<\/script>',
      '',
      '<template>',
      '  <SnDynamicInput v-model="phones" :preset="() => \'\'" :min="1" :max="5" />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'dynamic-input-web-basic',
      title: '基础用法',
      blurb: '字符串数组，每行输入 + 增删按钮。',
    },
    {
      name: 'dynamic-input-web-preset',
      title: '自定义字段（preset / onCreate）',
      blurb: 'preset 工厂创建新项，onCreate 再加工。',
    },
    {
      name: 'dynamic-input-web-slot',
      title: '对象行（slot）',
      blurb: 'default slot scoped { value, index } 渲染对象行。',
    },
    {
      name: 'dynamic-input-web-bounds',
      title: 'min / max 边界',
      blurb: '到界隐藏 −/+ 按钮。',
    },
    {
      name: 'dynamic-input-web-states',
      title: '禁用 / 只读',
      blurb: 'disabled 禁交互，readonly 冻结行结构。',
    },
  ],

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnDynamicInput.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      {
        t: 'text',
        s: ' 签名 1:1 对齐。行 key 使用 index，插入相邻行时焦点可能不迁移（naive-ui 用内部 id 规避）。',
      },
    ],
    rows: [
      {
        name: 'modelValue',
        type: 'DynamicInputValue[]',
        default: '[]',
        desc: '绑定数组；每项一个独立值，变更 emit 整个新数组。',
      },
      {
        name: 'preset',
        type: '() => DynamicInputValue',
        default: '() => null',
        desc: "新行创建工厂（文本行传 () => ''）。",
      },
      {
        name: 'onCreate',
        type: '(value, index) => DynamicInputValue',
        default: '—',
        desc: 'preset 产出草稿值后的加工钩子，返回值成为新行。',
      },
      {
        name: 'min',
        type: 'number',
        default: '0',
        desc: '行数下界，到界隐藏 − 按钮。',
      },
      {
        name: 'max',
        type: 'number',
        default: '—',
        desc: '行数上界，到界隐藏 + 按钮。',
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: '禁用所有行输入与行操作按钮。',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读：值可见不可编辑，且不渲染结构性 − / + 按钮。',
      },
      {
        name: 'size',
        type: "'mini' | 'tiny' | 'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: '驱动内置行输入框高度与字号。',
      },
      {
        name: 'status',
        type: "'default' | 'error' | 'warning'",
        default: "'default'",
        desc: '校验状态，级联到每个内置行输入框。',
      },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnDynamicInput 携带 AI-Friendly 描述（用途 / Import / Props / Slot / 行为注意），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnDynamicInput } from '@snui/vue-web';",
    chipCopy: "import { SnDynamicInput } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnDynamicInput', tone: 'accent' },
      { key: 'intent.slot', value: '{ value, index }', tone: 'cyan' },
      { key: 'a11y', value: 'native inputs per row', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'Select 选择器', link: '/components/web/select' },
    next: { text: 'DynamicTags 动态标签', link: '/components/web/dynamic-tags' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考 Props' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
