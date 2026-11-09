/**
 * TreeSelect 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Events：packages/vue-web/src/tree-select/SnTreeSelect.vue（withDefaults 真实签名）
 *   - Token：同文件 <style> 段的 --sn-web-tree-select-* 回退链
 *   - ai-description：packages/vue-web/src/tree-select/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const treeSelectDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: 'Form 表单组件' },
    { text: 'TreeSelect 树选择' },
  ],
  title: 'TreeSelect 树选择',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '带树形下拉面板的选择器：触发器展示选中值（单选显示 label，多选显示 tag 列表），点击展开 Teleport 到 body 的面板。父节点与叶节点均可选，多选勾选互相独立、不级联。面板内可绘制父子连接线（',
    },
    { t: 'code', s: 'showLine' },
    { t: 'text', s: '），四个维度与 ' },
    { t: 'code', s: 'SnTree' },
    { t: 'text', s: ' 对齐；选项支持直接带 ' },
    { t: 'code', s: 'icon' },
    { t: 'text', s: ' 字段。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnTreeSelect } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/tree-select',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '键盘树导航', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
    { text: 'WAI-ARIA tree', icon: 'a11y' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。' },
      { t: 'code', s: 'checkable' },
      { t: 'text', s: ' 是 ' },
      { t: 'code', s: 'multiple' },
      { t: 'text', s: ' 的别名；展开状态为非受控，' },
      { t: 'code', s: 'defaultExpandAll' },
      { t: 'text', s: ' 只在首次渲染播种。' },
    ],
    fileLabel: 'FileTreeSelect.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { Folder, FileCode } from 'lucide-vue-next';",
      "import { SnTreeSelect } from '@snui/vue-web';",
      '',
      'const file = ref<string | null>(null);',
      'const files = [',
      "  { label: 'src', key: 'src', icon: Folder, children: [",
      "    { label: 'app.ts', key: 'app.ts', icon: FileCode },",
      '  ] },',
      '];',
      '<\/script>',
      '',
      '<template>',
      '  <SnTreeSelect',
      '    v-model="file"',
      '    :options="files"',
      '    default-expand-all',
      '    filterable',
      '    show-line',
      '  />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'tree-select-web-basic',
      title: '基础用法',
      blurb: '树面板单选，父/叶均可选。',
    },
    {
      name: 'tree-select-web-multiple',
      title: '多选（multiple）',
      blurb: 'tag 列表回显可删，勾选独立不级联。',
    },
    {
      name: 'tree-select-web-filter',
      title: '默认全展开 + 过滤',
      blurb: 'defaultExpandAll；filterable 命中展开祖先。',
    },
    {
      name: 'tree-select-web-fields',
      title: '自定义字段',
      blurb: 'labelField / keyField / childrenField。',
    },
    {
      name: 'tree-select-web-states',
      title: '可清空 / 禁用',
      blurb: 'clearable、disabled、disabled 项。',
    },
    {
      name: 'tree-select-web-line',
      title: '连接线（show-line）',
      blurb: '直角实线 / 直角虚线 / 圆角自定义颜色三种面板对照。',
    },
    {
      name: 'tree-select-web-guide',
      title: '缩进引导线（line-mode）',
      blurb: 'line-mode="guide" 的缩进引导线：只画贯穿子树的竖线、不画横向分叉；实线 / 虚线对照。',
    },
  ],

  tokens: {
    hint: [
      { t: 'text', s: '触发器、面板节点与连接线各自成族：' },
      { t: 'code', s: '--sn-web-tree-select-*' },
      { t: 'text', s: ' 覆盖 bg / 边框 / 节点缩进与行高 / 连接线色与半径，颜色回落到 ' },
      { t: 'code', s: '--sn-web-color-*' },
      { t: 'text', s: ' 语义层。' },
    ],
    note: '100% Token 驱动',
    rows: [
      {
        name: 'height',
        raw: '—',
        alias: '--sn-web-tree-select-height',
        value: '32px',
      },
      {
        name: 'padding-x',
        raw: '—',
        alias: '--sn-web-tree-select-padding-x',
        value: '10px',
      },
      {
        name: 'radius',
        raw: '—',
        alias: '--sn-web-tree-select-radius',
        value: '6px',
        kind: 'curve',
      },
      {
        name: 'node-indent',
        raw: '—',
        alias: '--sn-web-tree-select-node-indent',
        value: '16px',
      },
      {
        name: 'node-min-height',
        raw: '—',
        alias: '--sn-web-tree-select-node-min-height',
        value: '30px',
      },
      {
        name: 'line-color',
        raw: '--aui-color-border-default',
        alias: '--sn-web-tree-select-line-color',
        value: '#e4e4e7',
        swatch: '#e4e4e7',
      },
      {
        name: 'line-radius',
        raw: '—',
        alias: '--sn-web-tree-select-line-radius',
        value: '3px',
        kind: 'curve',
      },
      {
        name: 'node-icon-color',
        raw: '--aui-color-text-tertiary',
        alias: '--sn-web-tree-select-node-icon-color',
        value: '#a1a1aa',
        swatch: '#a1a1aa',
      },
      {
        name: 'menu-bg',
        raw: '--aui-color-background-elevated',
        alias: '--sn-web-tree-select-menu-bg',
        value: '#ffffff',
        swatch: '#ffffff',
      },
      {
        name: 'menu-max-height',
        raw: '—',
        alias: '--sn-web-tree-select-menu-max-height',
        value: '260px',
      },
      {
        name: 'menu-z-index',
        raw: '—',
        alias: '--sn-web-tree-select-menu-z-index',
        value: '1000',
      },
      {
        name: 'node-text-color-selected',
        raw: '--aui-color-action-primary',
        alias: '--sn-web-tree-select-node-text-color-selected',
        value: '#1677ff',
        swatch: '#1677ff',
      },
    ],
  },

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnTreeSelect.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐。' },
      { t: 'code', s: 'lineColor' },
      { t: 'text', s: ' 注入到 Teleport 后的面板元素上，因此能覆盖 ' },
      { t: 'code', s: '--sn-web-tree-select-line-color' },
      { t: 'text', s: '。' },
    ],
    rows: [
      {
        name: 'modelValue',
        type: 'SnTreeSelectValue | SnTreeSelectValue[] | null',
        default: 'null',
        desc: '单值；multiple 时为数组。',
      },
      {
        name: 'multiple',
        type: 'boolean',
        default: 'false',
        desc: '多选（勾选独立不级联），tag 式回显。',
      },
      {
        name: 'checkable',
        type: 'boolean',
        default: 'false',
        desc: 'multiple 的别名（可勾选树模式并入多选）。',
      },
      {
        name: 'options',
        type: 'SnTreeSelectOptionInput[]',
        default: '[]',
        desc: '树形选项（label / key 或 value / children / disabled / icon）。',
      },
      {
        name: 'defaultExpandAll',
        type: 'boolean',
        default: 'false',
        desc: '首次渲染展开全部父节点（非受控）。',
      },
      { name: 'placeholder', type: 'string', default: "'Please select'", desc: '占位文案。' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '显示清空按钮。' },
      {
        name: 'filterable',
        type: 'boolean',
        default: 'false',
        desc: '启用内嵌过滤输入（label 匹配 + 展开祖先）。',
      },
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
      { name: 'labelField', type: 'string', default: "'label'", desc: 'label 字段名映射。' },
      {
        name: 'keyField',
        type: 'string',
        default: "'key'",
        desc: 'key 字段名映射（回退到 value 字段）。',
      },
      { name: 'childrenField', type: 'string', default: "'children'", desc: '子节点字段名映射。' },
      { name: 'ariaLabel', type: 'string', default: "''", desc: '触发器无障碍名称。' },
      {
        name: 'emptyText',
        type: 'string',
        default: "'No data'",
        desc: '空态文案（empty 插槽优先）。',
      },
      { name: 'customClass', type: 'string', default: "''", desc: '根元素上的额外 class。' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: '根元素上的内联样式。',
      },
      {
        name: 'showLine',
        type: 'boolean',
        default: 'false',
        desc: '在父子节点间绘制连接线。',
      },
      {
        name: 'lineMode',
        type: "'branch' | 'guide'",
        default: "'branch'",
        desc: '连接线形态：L 形分叉 / 只画缩进引导线。',
      },
      {
        name: 'lineStyle',
        type: "'solid' | 'dashed'",
        default: "'solid'",
        desc: '连接线描边样式。',
      },
      {
        name: 'lineCorner',
        type: "'square' | 'rounded'",
        default: "'square'",
        desc: '拐角形态：直角 / 四分之一圆弧（仅 branch 生效）。',
      },
      {
        name: 'lineColor',
        type: 'string',
        default: '—',
        desc: '任意 CSS 颜色 / token，覆盖面板的线色变量。',
      },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnTreeSelect 携带 AI-Friendly 描述（用途 / Import / Props / Events / 连接线 / 图标 / A11y），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnTreeSelect } from '@snui/vue-web';",
    chipCopy: "import { SnTreeSelect } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnTreeSelect', tone: 'accent' },
      { key: 'intent.icon', value: 'SnTreeSelectIcon', tone: 'cyan' },
      { key: 'a11y', value: 'tree + treeitem', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'Cascader 级联选择', link: '/components/web/cascader' },
    next: { text: 'TimePicker 时间选择', link: '/components/web/time-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'tokens', text: 'Token 映射 Tokens' },
    { id: 'api', text: 'API 属性参考 Props' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
