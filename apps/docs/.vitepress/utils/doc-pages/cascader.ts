/**
 * Cascader 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Events：packages/vue-web/src/cascader/SnCascader.vue（withDefaults 真实签名）
 *   - Token：同文件 <style> 段的 --sn-web-cascader-* 回退链
 *   - ai-description：packages/vue-web/src/cascader/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const cascaderDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: 'Form 表单组件' },
    { text: 'Cascader 级联选择' },
  ],
  title: 'Cascader 级联选择',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '逐级下钻的级联选择器：每一级渲染固定宽度的列，提交值是完整的根到叶路径（多选模式每条叶子一个路径）。列宽固定为 ',
    },
    { t: 'code', s: '--sn-web-cascader-column-width' },
    { t: 'text', s: '（默认 160px）不随内容自适应，面板宽度由已展开的列数决定。' },
    { t: 'code', s: 'multiple' },
    { t: 'text', s: ' 开启树勾选（父级级联后代叶子），' },
    { t: 'code', s: 'checkStrictly' },
    { t: 'text', s: ' 解除父子关联。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnCascader } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/cascader',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '键盘逐列导航', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
    { text: 'WAI-ARIA listbox', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。单选提交叶节点完整路径，清空提交 ' },
      { t: 'code', s: '[]' },
      { t: 'text', s: '；多选提交路径数组，触发器按路径渲染可删除的 tag。' },
    ],
    fileLabel: 'RegionPicker.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnCascader } from '@snui/vue-web';",
      '',
      'const region = ref<Array<string>>([]);',
      'const regions = [',
      "  { label: '浙江', value: 'zj', children: [{ label: '杭州', value: 'hz' }] },",
      "  { label: '江苏', value: 'js', children: [{ label: '南京', value: 'nj' }] },",
      '];',
      '<\/script>',
      '',
      '<template>',
      '  <SnCascader v-model="region" :options="regions" filterable clearable />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'cascader-web-basic',
      title: '基础用法',
      blurb: '多级列逐级选择，路径 v-model。',
    },
    {
      name: 'cascader-web-multiple',
      title: '多选模式（multiple）',
      blurb: 'multiple 多选：父级级联勾选、tag 回显与单独删除。',
    },
    {
      name: 'cascader-web-strictly',
      title: '严格选择模式（check-strictly）',
      blurb: 'check-strictly：单选点击父级即选中并展开；多选勾选互不关联。',
    },
    {
      name: 'cascader-web-filterable',
      title: '可过滤（filterable）',
      blurb: '按完整路径文本匹配，命中平铺展示。',
    },
    {
      name: 'cascader-web-fields',
      title: '自定义字段',
      blurb: 'labelField / valueField / childrenField。',
    },
    {
      name: 'cascader-web-trigger',
      title: '展开触发（expand-trigger）',
      blurb: 'click（默认）/ hover 展开下级。',
    },
    {
      name: 'cascader-web-clearable',
      title: '可清空（clearable）',
      blurb: '选中后一键清空。',
    },
    {
      name: 'cascader-web-disabled',
      title: '禁用（disabled）',
      blurb: '组件级禁用 + 选项级 disabled 节点。',
    },
  ],

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnCascader.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐。' },
      { t: 'code', s: 'checkStrictly' },
      {
        t: 'text',
        s: ' 在单选时允许提交父级自身路径（并同时展开下级），在多选时解除父子级联与半选态。',
      },
    ],
    rows: [
      {
        name: 'modelValue',
        type: 'SnCascaderValue[] | SnCascaderValue[][]',
        default: '[]',
        desc: '`[]`',
      },
      {
        name: 'options',
        type: 'SnCascaderOptionInput[]',
        default: '[]',
        desc: '树形选项（children 分级）',
      },
      { name: 'labelField', type: 'string', default: "'label'", desc: 'label 字段名映射。' },
      { name: 'valueField', type: 'string', default: "'value'", desc: 'value 字段名映射。' },
      { name: 'childrenField', type: 'string', default: "'children'", desc: '子级字段名映射。' },
      { name: 'placeholder', type: 'string', default: "'Please select'", desc: '占位文案。' },
      { name: 'clearable', type: 'boolean', default: '—', desc: '清空按钮' },
      { name: 'filterable', type: 'boolean', default: 'false', desc: '按路径文本匹配' },
      { name: 'disabled', type: 'boolean', default: '—', desc: '禁用交互。' },
      { name: 'readonly', type: 'boolean', default: '—', desc: '只读，不展开也不提交。' },
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
      {
        name: 'expandTrigger',
        type: "'click' | 'hover'",
        default: "'click'",
        desc: '父节点展开下一列的触发方式。',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: '多选（树选择）：勾选父级级联全部可选后代叶子',
      },
      {
        name: 'maxTagCount',
        type: 'number',
        default: '—',
        desc: '多选时最多展示的 tag 数，其余折叠为 `+N`',
      },
      {
        name: 'checkStrictly',
        type: 'boolean',
        default: 'false',
        desc: '严格选择：任意节点（含父级）可提交；多选解除父子关联',
      },
      { name: 'ariaLabel', type: 'string', default: "''", desc: '触发器无障碍名称。' },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No options'",
        desc: '下拉空态文案（empty 插槽优先）。',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnCascader.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(value: SnCascaderPath | SnCascaderPath[])',
        desc: '`v-model` 同步：单选回传一条叶子路径，多选回传路径数组。',
      },
      {
        name: 'change',
        payload: '(value: SnCascaderPath | SnCascaderPath[])',
        desc: '选择提交时触发（清空也会触发）。',
      },
      { name: 'clear', payload: '—', desc: '点击清空按钮时触发。' },
      { name: 'focus', payload: 'FocusEvent', desc: '触发器获得焦点时触发。' },
      { name: 'blur', payload: 'FocusEvent', desc: '触发器失去焦点时触发。' },
    ],
  },
  slots: {
    hint: [
      { t: 'text', s: '插槽与 ' },
      { t: 'code', s: 'SnCascader.vue' },
      { t: 'text', s: ' 模板中的 ' },
      { t: 'code', s: '<slot>' },
      { t: 'text', s: ' 1:1 对齐；作用域列出可解构的 slot props。' },
    ],
    rows: [{ name: 'empty', props: '—', desc: '空状态（无选项或筛选无匹配）。' }],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnCascader 携带 AI-Friendly 描述（用途 / Import / Props / Events / 键盘 / 回显规则），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnCascader } from '@snui/vue-web';",
    chipCopy: "import { SnCascader } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnCascader', tone: 'accent' },
      { key: 'intent.mode', value: 'multiple | checkStrictly', tone: 'cyan' },
      { key: 'a11y', value: 'listbox per column', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'DynamicTags 动态标签', link: '/components/web/dynamic-tags' },
    next: { text: 'TreeSelect 树选择', link: '/components/web/tree-select' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
