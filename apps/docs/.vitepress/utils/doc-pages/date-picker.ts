/**
 * DatePicker 组件详情页数据。
 *
 * Props 与默认值取自组件 SFC 的 defineProps / withDefaults；
 * demo 取自该页原有的 <Demo> 块。未经验证的值一律不写。
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const datePickerDocPage: SnDocPageData = {
  crumbs: [{ text: '文档首页', link: '/' }, { text: '表单组件 Form' }, { text: 'DatePicker' }],
  title: 'DatePicker',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web & Uni-App 双端统一', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    {
      t: 'text',
      s: '日期选择器。date / datetime / week / quarter / month / year 及对应 range 模式，无第三方日期库。单值 datetime 为「月历 | 时间列」左右布局；datetimerange 为「四输入框 + 双月历 + 时间弹层」布局；monthrange 为双栏「年 | 月」面板。',
    },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: 'pnpm add @snui/vue-web',
      copy: 'pnpm add @snui/vue-web',
      copiedLabel: '已复制',
    },
    {
      icon: 'link',
      label: '查看源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/date-picker',
    },
  ],
  usage: {
    hint: [],
    fileLabel: 'DatePicker.vue',
    meta: 'Vue 3 · <script setup>',
    code: `
<script setup lang="ts">
import { DatePicker } from '@snui/vue-web';
</script>

<template>
  <DatePicker />
</template>`,
  },
  demos: [
    {
      name: 'date-picker-web-basic',
      title: '基础用法（date）',
      blurb: '月历网格，v-model 毫秒时间戳。',
    },
    {
      name: 'date-picker-web-datetime',
      title: '日期时间（datetime，左右布局）',
      blurb: '月历 | 时分秒列 左右布局 + 确认。',
    },
    {
      name: 'date-picker-web-week-quarter',
      title: '周 / 季度模式',
      blurb:
        "type='week' / 'quarter' / 'weekrange'：周行选取（值 = 周一），季度网格（值 = 季度首日）。",
    },
    {
      name: 'date-picker-web-month-year',
      title: '年 / 月模式',
      blurb: "type='month' / 'year' 网格下钻。",
    },
    {
      name: 'date-picker-web-range',
      title: '范围（daterange / datetimerange）',
      blurb:
        "双月历并排，先 start 后 end，越界自动交换；datetimerange 顶部为「开始日期 / 开始时间 | 结束日期 / 结束时间」四输入框，点击时间输入弹出时分秒弹层（此刻 / 确认），底部 清除 / 确认；input-position='bottom' 可把输入框栏放到月历下方。面板宽度由双月历决定，不再被输入框撑出右侧空白。",
    },
    {
      name: 'date-picker-web-month-range',
      title: '月份范围（monthrange）',
      blurb:
        '双栏「年 | 月」滚动面板，范围起止高亮、越界自动交换，底部 清除 / 确认；值为两个月份首日的时间戳。',
    },
    {
      name: 'date-picker-web-shortcuts',
      title: '快捷入口 / 动态限选',
      blurb:
        'shortcuts（left/right/bottom 定位）、disabledDate 禁用日期、onSelect + disabledDate 动态控制选取范围。',
    },
    {
      name: 'date-picker-web-format',
      title: '格式化（format）',
      blurb: '小写 token：yyyy / MM / dd / HH / mm / ss / ww（ISO 周）/ qq（季度）。',
    },
    {
      name: 'date-picker-web-states',
      title: '可清空 / 禁用',
      blurb: 'clearable、disabled、readonly。',
    },
  ],
  props: {
    hint: [],
    rows: [
      {
        name: 'modelValue',
        type: 'number | [number, number] | null',
        default: 'null',
        desc: '绑定值。',
      },
      { name: 'type', type: 'SnDatePickerType', default: "'date'", desc: 'Panel / value mode.' },
      {
        name: 'format',
        type: 'string',
        default: "''",
        desc: 'Display format — lowercase tokens (yyyy MM dd HH mm ss).',
      },
      { name: 'placeholder', type: 'string | [string, string]', default: '—', desc: '—' },
      { name: 'clearable', type: 'boolean', default: 'false', desc: '清空按钮' },
      { name: 'disabled', type: 'boolean', default: 'false', desc: '禁用交互。' },
      {
        name: 'readonly',
        type: 'boolean',
        default: 'false',
        desc: '只读：不打开面板，也不提交值。',
      },
      { name: 'size', type: 'SnDatePickerSize', default: "'medium'", desc: 'Visual size preset.' },
      {
        name: 'status',
        type: 'SnDatePickerStatus',
        default: "'default'",
        desc: 'Validation-driven visual status.',
      },
      {
        name: 'disabledDate',
        type: '(ts: number) => boolean',
        default: '—',
        desc: '禁用日期判定函数，接收每个日期格的本地零点时间戳，返回 true 时该格变暗且不可选。',
      },
      { name: 'shortcuts', type: 'SnDatePickerShortcut[]', default: '—', desc: '(() => …) }[]`' },
      {
        name: 'shortcutsPosition',
        type: 'SnDatePickerShortcutsPosition',
        default: "'bottom'",
        desc: 'Where the shortcuts bar renders.',
      },
      {
        name: 'inputPosition',
        type: 'SnDatePickerInputPosition',
        default: "'top'",
        desc: 'Where the four-field input bar renders in `datetimerange` panels. `bottom` places it under the calendars (the time popover opens upward).',
      },
      {
        name: 'ariaLabel',
        type: 'string',
        default: "''",
        desc: "Accessible name for the trigger (fallback: 'Date picker').",
      },
      { name: 'customClass', type: 'string', default: "''", desc: 'Class on the root wrapper.' },
      {
        name: 'customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: 'Inline style on the root wrapper.',
      },
    ],
  },
  events: {
    hint: [
      { t: 'text', s: '事件名与 ' },
      { t: 'code', s: 'SnDatePicker.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineEmits' },
      { t: 'text', s: ' 签名 1:1 对齐；载荷列为回调参数。' },
    ],
    rows: [
      {
        name: 'update:modelValue',
        payload: '(number | [number, number] | null)',
        desc: '`v-model` 同步，任意提交都会派发。',
      },
      {
        name: 'change',
        payload: '(number | [number, number] | null)',
        desc: '值提交时派发，清除也会触发。',
      },
      {
        name: 'select',
        payload: '(number | [number, number] | null)',
        desc: '面板中选中单元格时派发；单选为草稿值，范围首次为起始值、第二次为排序后区间。',
      },
      { name: 'clear', payload: '—', desc: '点击 × 清除按钮清空值时派发。' },
      { name: 'focus', payload: '(FocusEvent)', desc: '触发器获得焦点时派发。' },
      { name: 'blur', payload: '(FocusEvent)', desc: '触发器失去焦点时派发。' },
    ],
  },
  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'DatePicker 携带 AI-Friendly 描述，由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档。',
    chip: "import { DatePicker } from '@snui/vue-web';",
    chipCopy: "import { DatePicker } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'DatePicker', tone: 'accent' },
      { key: 'intent.end', value: 'web', tone: 'cyan' },
      { key: 'a11y', value: 'token-driven', tone: 'ok' },
    ],
  },
  pager: {
    prev: { text: 'time-picker', link: '/components/web/time-picker' },
    next: { text: 'color-picker', link: '/components/web/color-picker' },
  },
  toc: [
    { id: 'usage', text: '代码用法' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 参考' },
    { id: 'ai-native', text: 'AI 原生集成' },
  ],
};
