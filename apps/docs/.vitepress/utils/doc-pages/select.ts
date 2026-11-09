/**
 * Select 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Events：packages/vue-web/src/select/SnSelect.vue（withDefaults 真实签名）
 *   - Token：同文件 <style> 段的 --sn-web-select-* 回退链
 *   - ai-description：packages/vue-web/src/select/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const selectDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: 'Form 表单组件' }, { text: 'Select 选择器' }],
  title: 'Select 选择器',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '从长列表中挑选一个或多个值。Teleport 下拉 + 视口翻转定位，覆盖单选 / 多选 / 过滤 / 分组 / 远程搜索；触发器展示选中值或 tag 列表，',
    },
    { t: 'code', s: 'maxTagCount' },
    { t: 'text', s: ' 把溢出 tag 折叠为 ' },
    { t: 'code', s: '+N' },
    { t: 'text', s: '。字段几何回退到 ' },
    { t: 'code', s: '--sn-web-select-*' },
    { t: 'text', s: ' 别名层。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnSelect } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/select',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '键盘与视口翻转', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
    { text: 'WAI-ARIA listbox', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。' },
      { t: 'code', s: 'multiple' },
      { t: 'text', s: ' 时 ' },
      { t: 'code', s: 'modelValue' },
      { t: 'text', s: ' 为数组；' },
      { t: 'code', s: 'remote' },
      { t: 'text', s: ' 下由宿主监听 ' },
      { t: 'code', s: 'search' },
      { t: 'text', s: ' 事件自行拉取候选并回写 ' },
      { t: 'code', s: 'options' },
      { t: 'text', s: ' / ' },
      { t: 'code', s: 'loading' },
      { t: 'text', s: '。' },
    ],
    fileLabel: 'OwnerSelect.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnSelect } from '@snui/vue-web';",
      '',
      'const owner = ref<string | null>(null);',
      'const owners = [',
      "  { label: 'Alice', value: 'alice' },",
      "  { label: 'Bob', value: 'bob' },",
      "  { label: 'Carol', value: 'carol', disabled: true },",
      '];',
      '<\/script>',
      '',
      '<template>',
      '  <SnSelect v-model="owner" :options="owners" filterable clearable placeholder="负责人" />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    { name: 'select-web-basic', title: '基础用法', blurb: 'options + v-model 单选。' },
    {
      name: 'select-web-multiple',
      title: '多选（multiple）',
      blurb: '数组 v-model + tag 删除 + maxTagCount。',
    },
    {
      name: 'select-web-filterable',
      title: '可过滤（filterable）',
      blurb: '输入过滤候选，支持自定义 filter。',
    },
    {
      name: 'select-web-group',
      title: '分组（children）',
      blurb: 'options 带 children 渲染分组标题。',
    },
    {
      name: 'select-web-fields',
      title: '自定义字段（labelField / valueField）',
      blurb: '非 label/value 字段名映射。',
    },
    {
      name: 'select-web-states',
      title: '可清空 / 禁用 / 加载',
      blurb: 'clearable、disabled、loading。',
    },
    {
      name: 'select-web-remote',
      title: '远程搜索（remote）',
      blurb:
        'remote + search 事件 + 模拟接口（450ms 延迟、防抖、请求中断）；真实项目把 mock 换成 fetch 即可。',
    },
  ],

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnSelect.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐。' },
      { t: 'code', s: 'emptyText' },
      { t: 'text', s: ' 缺省时取当前 locale 的 ' },
      { t: 'code', s: 'Select.noOptions' },
      { t: 'text', s: '，' },
      { t: 'code', s: 'empty' },
      { t: 'text', s: ' 插槽优先于该文案。' },
    ],
    rows: [
      {
        name: 'modelValue',
        type: 'SnSelectValue | SnSelectValue[] | null',
        default: 'null',
        desc: '绑定值。',
      },
      { name: 'multiple', type: 'boolean', default: 'false', desc: '多选' },
      {
        name: 'options',
        type: 'SnSelectOptionInput[]',
        default: '[]',
        desc: '选项（裸值或对象，children 分组）',
      },
      { name: 'labelField', type: 'string', default: "'label'", desc: 'label 字段名映射。' },
      { name: 'valueField', type: 'string', default: "'value'", desc: 'value 字段名映射。' },
      {
        name: 'childrenField',
        type: 'string',
        default: "'children'",
        desc: '分组子项字段名映射。',
      },
      { name: 'placeholder', type: 'string', default: "'Please select'", desc: '占位文案。' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '清空按钮' },
      { name: 'filterable', type: 'boolean', default: 'false', desc: '输入过滤' },
      { name: 'filter', type: 'SnSelectFilter', default: '—', desc: '自定义过滤' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用交互。' },
      { name: 'readonly', type: 'boolean', default: 'false', desc: '只读，不展开也不提交。' },
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
        desc: '校验状态。',
      },
      { name: 'maxTagCount', type: 'number', default: '—', desc: '多选 tag 上限' },
      { name: 'tag', type: 'boolean', default: 'false', desc: '多选 tag 胶囊形态' },
      { name: 'loading', type: 'boolean', default: 'false', desc: '下拉加载态' },
      {
        name: 'remote',
        type: 'boolean',
        default: 'false',
        desc: '远程搜索（配合 loading + search 事件）',
      },
      { name: 'ariaLabel', type: 'string', default: "''", desc: '触发器无障碍名称。' },
      { name: 'label', type: 'string', default: "''", desc: '转发给菜单 listbox 的无障碍标签。' },
      { name: 'emptyText', type: 'string', default: '—', desc: '下拉空态文案（`empty` 插槽优先）' },
      { name: 'customClass', type: 'string', default: "''", desc: '根元素上的额外 class。' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: '根元素上的内联样式。',
      },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnSelect 携带 AI-Friendly 描述（用途 / Import / Props / Events / Slots / 键盘 / A11y），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnSelect } from '@snui/vue-web';",
    chipCopy: "import { SnSelect } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnSelect', tone: 'accent' },
      { key: 'intent.mode', value: 'multiple | remote', tone: 'cyan' },
      { key: 'a11y', value: 'listbox + aria-expanded', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'AutoComplete 自动补全', link: '/components/web/auto-complete' },
    next: { text: 'DynamicInput 动态输入', link: '/components/web/dynamic-input' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考 Props' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
