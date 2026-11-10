/**
 * DynamicTags 组件详情页数据 —— 全部内容来自真实契约：
 *   - Props / Events / Slots：packages/vue-web/src/dynamic-tags/SnDynamicTags.vue
 *   - Token：同文件 <style> 段的 --sn-web-dynamic-tags-* 回退链
 *   - ai-description：packages/vue-web/src/dynamic-tags/ai-description.md
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const dynamicTagsDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: 'Form 表单组件' },
    { text: 'DynamicTags 动态标签' },
  ],
  title: 'DynamicTags 动态标签',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '一组可增删的胶囊标签 + 末尾「添加」触发按钮。点击触发按钮出现内嵌输入框：' },
    { t: 'code', s: 'Enter' },
    { t: 'text', s: ' 提交（trim 后非空才追加，可连续输入）、' },
    { t: 'code', s: 'Esc' },
    { t: 'text', s: ' 取消、blur 提交。标签固定为圆角胶囊形态，' },
    { t: 'code', s: 'max' },
    { t: 'text', s: ' 触达后隐藏添加触发。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnDynamicTags } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/dynamic-tags',
    },
  ],
  features: [
    { text: 'Emerald Cloud 调色规范', icon: 'eco' },
    { text: '键盘全流程可达', icon: 'touch' },
    { text: 'Zero-Runtime CSS 变量', icon: 'layers' },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。' },
      { t: 'code', s: 'trigger' },
      { t: 'text', s: ' 控制内嵌输入的打开方式：' },
      { t: 'code', s: 'click' },
      { t: 'text', s: ' 仅触发按钮可开，' },
      { t: 'code', s: 'focus' },
      { t: 'text', s: ' 点击组件任意位置即可开。' },
    ],
    fileLabel: 'TagEditor.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnDynamicTags } from '@snui/vue-web';",
      '',
      "const tags = ref<string[]>(['Vue', 'TypeScript']);",
      '<\/script>',
      '',
      '<template>',
      '  <SnDynamicTags v-model="tags" :max="8" placeholder="新增标签" />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'dynamic-tags-web-basic',
      title: '基础用法',
      blurb: '添加 / 删除标签，数组 v-model。',
    },
    {
      name: 'dynamic-tags-web-flow',
      title: '添加流程（键盘）',
      blurb: 'Enter 提交可连续输入，Esc 取消，blur 提交。',
    },
    {
      name: 'dynamic-tags-web-bounds',
      title: 'max / closable',
      blurb: 'max 到界隐藏添加；closable=false 隐藏删除。',
    },
    {
      name: 'dynamic-tags-web-slots',
      title: '自定义渲染（slots）',
      blurb: 'tag / trigger / empty 自定义。',
    },
    {
      name: 'dynamic-tags-web-states',
      title: '禁用 / 只读',
      blurb: 'disabled 禁交互，readonly 不出添加按钮。',
    },
  ],

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnDynamicTags.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐。' },
      { t: 'code', s: 'inputProps' },
      { t: 'text', s: ' 简化为单个 ' },
      { t: 'code', s: 'placeholder' },
      { t: 'text', s: ' prop。' },
    ],
    rows: [
      { name: 'modelValue', type: 'SnDynamicTagValue[]', default: '[]', desc: '`[]`' },
      { name: 'closable', type: 'boolean', default: 'true', desc: 'tag 可删除' },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        desc: '禁用交互 — 无触发按钮、无关闭按钮。',
      },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读 — 标签可见，不可增删。',
      },
      {
        name: 'size',
        type: "'small' | 'medium' | 'large'",
        default: "'medium'",
        desc: '尺寸档位。',
      },
      { name: 'max', type: 'number', default: '—', desc: '上限（到界隐藏添加）' },
      {
        name: 'trigger',
        type: "'click' | 'focus'",
        default: "'click'",
        desc: '内嵌输入的打开方式：仅触发按钮 / 点击组件任意位置。',
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "''",
        desc: '内嵌输入的占位文案。',
      },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnDynamicTags 携带 AI-Friendly 描述（用途 / Import / Props / Events / Slots / 键盘），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnDynamicTags } from '@snui/vue-web';",
    chipCopy: "import { SnDynamicTags } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnDynamicTags', tone: 'accent' },
      { key: 'intent.trigger', value: '"click" | "focus"', tone: 'cyan' },
      { key: 'a11y', value: 'Enter / Esc / blur', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'DynamicInput 动态输入', link: '/components/web/dynamic-input' },
    next: { text: 'Cascader 级联选择', link: '/components/web/cascader' },
  },
  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考 Props' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
