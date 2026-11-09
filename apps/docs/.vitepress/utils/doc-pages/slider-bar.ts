/**
 * SliderBar 组件详情页数据 —— 版式与 Button 详情页一致（SnDocPage）。
 *
 * 内容全部来自真实契约：
 *   - Props / Events / Slots：packages/vue-web/src/slider-bar/SnSliderBar.vue
 *   - 样式变量：同文件 <style> 段与 ai-description.md
 *   - Playground：直接渲染 demo/slider-bar-web-scenarios.vue（真实组件）
 */
import type { SnDocPageData } from '../../components/doc-page/types';

export const sliderBarDocPage: SnDocPageData = {
  crumbs: [
    { text: '文档首页', link: '/' },
    { text: '数据录入 Data' },
    { text: 'SliderBar 胶囊滑条' },
  ],
  title: 'SliderBar 胶囊滑条',
  badges: [
    { label: 'Stable', tone: 'ok', icon: 'stable' },
    { label: 'Web 端', tone: 'accent', icon: 'dual' },
    { label: 'AI-Token Ready', tone: 'warn', icon: 'ai' },
  ],
  description: [
    { t: 'text', s: '条状胶囊滑条，与 ' },
    { t: 'code', s: 'SnSlider' },
    { t: 'text', s: ' 共享同一套滑块语义（拖拽 / 键盘 / 步长 / range 双柄 / ' },
    { t: 'code', s: 'aria-*' },
    {
      t: 'text',
      s: '），外观是「中性条 + 主题色实色填充 + 内联读数」。适合音量、播放进度、价格区间与竖排调光。',
    },
    { t: 'code', s: 'variant="column"' },
    { t: 'text', s: ' 切换为竖排条，读数并入轨道顶部。' },
  ],
  quickActions: [
    {
      icon: 'copy',
      label: '复制引用代码 (import)',
      copy: "import { SnSliderBar } from '@snui/vue-web';",
    },
    {
      icon: 'link',
      label: 'GitHub 源码',
      href: 'https://github.com/hu-snail/snail-ui/tree/main/packages/vue-web/src/slider-bar',
    },
  ],

  usage: {
    hint: [
      { t: 'text', s: '从 ' },
      { t: 'code', s: '@snui/vue-web' },
      { t: 'text', s: ' 引入即用。读数默认显示填充比例，' },
      { t: 'code', s: 'format="value"' },
      { t: 'text', s: ' 显示原值 + ' },
      { t: 'code', s: 'valueSuffix' },
      { t: 'text', s: '；' },
      { t: 'code', s: 'range' },
      { t: 'text', s: ' 双柄不交叉。' },
    ],
    fileLabel: 'VolumeDemo.vue',
    meta: 'Vue 3 / TypeScript',
    code: [
      '<script setup lang="ts">',
      "import { ref } from 'vue';",
      "import { SnSliderBar } from '@snui/vue-web';",
      '',
      'const volume = ref(64);',
      'const range = ref<[number, number]>([120, 480]);',
      '<\\/script>',
      '',
      '<template>',
      '  <SnSliderBar v-model="volume" show-value aria-label="音量" />',
      '  <SnSliderBar',
      '    v-model="range"',
      '    range',
      '    :max="1000"',
      '    :step="10"',
      '    show-value',
      '    :format-value="(v: number) => `¥${v}`"',
      '  />',
      '</template>',
    ].join('\n'),
  },

  demos: [
    {
      name: 'slider-bar-web-aurora',
      title: 'Aurora 渐变星光',
      blurb: 'theme="aurora"：紫蓝渐变填充 + 星光粒子动效 + 圆形手柄，支持自定义渐变与关闭动效。',
    },
    {
      name: 'slider-bar-web-scenarios',
      title: '全场景一览',
      blurb: '音量（#icon 可选）/ 播放进度 / 价格区间 / 禁用 / 反向 / 竖排亮度与色温。',
    },
    {
      name: 'slider-bar-web-levels',
      title: '等级 Levels',
      blurb:
        'levels 把数值映射成档位（风扇 / 甜度），轨道刻度随区间分布，读数显示档名；含头尾图标。',
    },
    {
      name: 'slider-bar-web-readout',
      title: '读数格式 Read-out',
      blurb: 'percent / value + valueSuffix / formatValue 三种读数来源，含 tooltip 与 placement。',
    },
    {
      name: 'slider-bar-web-shape',
      title: '形状与厚度 Shape',
      blurb: 'radius 与 thickness 组合：直角 4px、默认 token、全圆胶囊、细条与渐变填充。',
    },
  ],

  props: {
    hint: [
      { t: 'text', s: '与 ' },
      { t: 'code', s: 'SnSliderBar.vue' },
      { t: 'text', s: ' 的 ' },
      { t: 'code', s: 'defineProps' },
      { t: 'text', s: ' 签名 1:1 对齐；胶囊几何按实测像素计算（' },
      { t: 'code', s: 'ResizeObserver' },
      { t: 'text', s: '），不依赖百分比解析。' },
    ],
    rows: [
      {
        name: 'modelValue',
        type: 'number | [number, number]',
        default: '—',
        desc: 'v-model；range 时为 [start, end]。',
      },
      { name: 'min / max', type: 'number', default: '0 / 100', desc: '边界。' },
      { name: 'step', type: 'number', default: '1', desc: '步长吸附（指针 + 键盘）。' },
      { name: 'range', type: 'boolean', default: 'false', desc: '双柄区间，手柄互不交叉。' },
      { name: 'disabled / readonly', type: 'boolean', default: 'false', desc: '禁用 / 只读。' },
      { name: 'reverse', type: 'boolean', default: 'false', desc: '翻转坐标轴。' },
      {
        name: 'variant',
        type: "'bar' | 'column'",
        default: "'bar'",
        desc: '横向胶囊 / 竖排条。',
      },
      { name: 'showValue', type: 'boolean', default: 'false', desc: '显示内联读数。' },
      {
        name: 'theme',
        type: "'default' | 'aurora'",
        default: "'default'",
        desc: 'aurora = 渐变填充 + 星光粒子 + 圆形手柄。',
      },
      {
        name: 'gradient / sparkles / animated',
        type: 'string / number / boolean',
        default: 'aurora 渐变 / 14 / true',
        desc: 'aurora 的渐变、星点密度（0–40）与动效开关。',
      },
      {
        name: 'iconPlacement',
        type: "'leading' | 'inside' | 'trailing'",
        default: "'leading'",
        desc: '#icon 插槽的位置；inside 画在填充层上随值移动。',
      },
      {
        name: 'levels / showLevels',
        type: 'Array<{ value, label, icon? }> / boolean',
        default: '— / true',
        desc: '档位定义：读数显示最近档位名，showLevels 在轨道上画刻度。',
      },
      {
        name: 'leadingIcon / trailingIcon',
        type: 'string',
        default: '—',
        desc: '轨道头尾图标（注册名）；配合 iconPlacement="inside" 画在轨道内。',
      },
      {
        name: 'label / suffix',
        type: 'string',
        default: '—',
        desc: '画在条内的首尾文字（不受填充影响）。',
      },
      {
        name: 'format',
        type: "'percent' | 'value'",
        default: "'percent'",
        desc: '读数取填充比例还是原值。',
      },
      { name: 'valueSuffix', type: 'string', default: "'%'", desc: '默认读数后缀。' },
      {
        name: 'formatValue',
        type: '(value, percent) => string',
        default: '—',
        desc: '完全自定义读数，优先于 format。',
      },
      { name: 'tooltip', type: 'boolean', default: 'true', desc: '拖拽 / 悬停气泡。' },
      {
        name: 'formatTooltip',
        type: '(value) => string | number',
        default: '—',
        desc: '气泡内容格式化。',
      },
      { name: 'placement', type: 'string', default: "'top'", desc: '气泡方位。' },
      {
        name: 'fillBackground / barBackground',
        type: 'string',
        default: '—',
        desc: '填充 / 轨道背景（渐变、透明均可）。',
      },
      {
        name: 'thickness',
        type: 'number | string',
        default: '40',
        desc: '条厚度（水平为高、竖排为宽），数字按 px。',
      },
      { name: 'radius', type: 'string', default: '—', desc: '条圆角，任意 CSS 长度。' },
      { name: 'fade', type: 'boolean', default: 'true', desc: '竖排：空余部分向上渐隐。' },
      { name: 'tooltipOnly', type: 'boolean', default: 'false', desc: '竖排：仅用气泡读数。' },
      { name: 'ariaLabel', type: 'string', default: '—', desc: '无障碍名称。' },
      {
        name: 'customClass / customStyle',
        type: 'string | Record<string, string>',
        default: "''",
        desc: '根节点类名 / 内联样式。',
      },
    ],
  },

  ai: {
    badge: 'ai-description.md · 已内置',
    heading: '为 LLM 提供语义化组件契约',
    copy: 'SnSliderBar 携带 AI-Friendly 描述（用途 / Props / Slots / Events / A11y / 样式变量），由 @snui/cli 的 generateDocs() 与 generateLlmsTxt() 消费生成机器可读文档；智能体无需解析 .vue 源码即可产出正确调用。',
    chip: "import { SnSliderBar } from '@snui/vue-web';",
    chipCopy: "import { SnSliderBar } from '@snui/vue-web';",
    stats: [
      { key: 'intent.action', value: 'SnSliderBar', tone: 'accent' },
      { key: 'intent.variant', value: '"bar" | "column"', tone: 'cyan' },
      { key: 'a11y', value: 'role="slider"', tone: 'ok' },
    ],
  },

  pager: {
    prev: { text: 'Slider 滑块', link: '/components/web/slider' },
  },

  toc: [
    { id: 'usage', text: '代码用法 Usage' },
    { id: 'demos', text: '案例 Demos' },
    { id: 'api', text: 'API 属性参考 Props' },
    { id: 'ai-native', text: 'AI 原生集成 AI-Native' },
  ],
};
