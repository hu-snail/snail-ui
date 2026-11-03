# @snui/echarts — ECharts 深度集成层

> **职责边界（先读这一段）**
>
> 本包**只处理图表问题**：ECharts 实例生命周期、主题取色、布局预设、图标配置、
> tooltip 渲染、事件转发。
>
> 本包**不处理任何业务**：不发请求、不管数据来源、不注册路由、不做权限判断
> （§18 Runtime 边界）。数据从哪来、图表代表什么意思，全部由宿主决定——
> 本包只渲染 `option`。

基于 [Apache ECharts](https://echarts.apache.org/) 的 Vue 3 集成层。在
ECharts 原生 `option` 之上补四件事，全部可选、全部可关闭：

| 能力        | 解决的问题                                              | 入口                                   |
| ----------- | ------------------------------------------------------- | -------------------------------------- |
| **主题色**  | 图表颜色跟随 snail-ui token，而不是各业务写死 hex       | `theme` prop / `buildChartTheme()`     |
| **布局**    | 卡片里塞图表不用手算 `grid` / `legend` / `title` 数字   | `layout` prop / `CHART_LAYOUT_PRESETS` |
| **图标**    | 图例 / 系列符号 / 工具箱图标用一个配置对象解决          | `icons` prop / `registerChartIcons()`  |
| **Tooltip** | 默认工具提示是可换的 DOM 浮层（token 样式 + slot 接管） | `tooltip` prop / `#tooltip` slot       |

## 安装

```bash
pnpm add @snui/echarts

# 前置依赖
pnpm add echarts           # peer：由宿主决定版本与模块注册
pnpm add @snui/vue-web     # peer 式依赖：本包复用它的 SnLoading / SnEmpty
```

`echarts` 是 **peerDependency**（`^5.6.0 || ^6.0.0`），不进 `dependencies`：
宿主拥有 echarts 版本、要注册哪些图表 / 组件模块，以及最终体积。

宿主还需要引入 vue-web 的 token 样式（图表颜色全部来自它）：

```ts
import '@snui/vue-web/styles';
```

## 快速开始

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SnChart } from '@snui/echarts';

const option = ref({
  xAxis: { type: 'category', data: ['一月', '二月', '三月'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: '本周', data: [120, 200, 150] },
    { type: 'bar', name: '上周', data: [90, 180, 110] },
  ],
});
</script>

<template>
  <SnChart :option="option" style="height: 320px" />
</template>
```

不需要写 legend / grid / tooltip —— 布局预设会补上，tooltip 默认是 token
样式的 DOM 浮层，颜色直接来自 `--sn-web-*`。

## 主题色配置

颜色默认是 `var(--sn-web-*)` 引用（`colorSource: 'tokens'`），所以：

```html
<!-- 宿主整体切主题，图表跟着变，不需要重建 option -->
<html data-theme="dark"></html>
```

```vue
<!-- 单图覆盖品牌色 / 文字色 / 字体 -->
<SnChart
  :option="option"
  :theme="{
    colorPrimary: '#ff5a00',
    colorSuccess: '#00b42a',
    textColorSecondary: '#86909c',
    fontSize: 13,
    fontFamily: 'Inter, sans-serif',
  }"
/>
```

`colorSource: 'resolved'` 会把 CSS 变量快照成字面量，用于导出图片 / SSR /
非 DOM 宿主（`resolveTokenColors()` 读 `getComputedStyle` 的级联结果）。

## 布局配置

```vue
<!-- 预设 -->
<SnChart :option="option" layout="compact" />
```

| 预设         | 场景                                         |
| ------------ | -------------------------------------------- |
| `default`    | 卡片尺寸图表（内边距 12，左对齐图例在顶部）  |
| `compact`    | 仪表盘密集排布（内边距 8，轴标签截断 8 字）  |
| `spacious`   | 汇报 / 大屏（内边距 20，图例在底部，带标题） |
| `fullscreen` | 满屏面板（内边距 0，工具箱内嵌）             |
| `minimal`    | 指标卡 / 迷你图（无图例、无坐标轴）          |

```vue
<!-- 局部覆盖：只改图例位置，其余仍是 default -->
<SnChart :option="option" :layout="{ legend: { position: 'right' }, grid: 24 }" />
```

### 派生配置的约定

任何布局都会先生成一份派生 option（`grid` / `legend` / `title` / `toolbox` /
`dataZoom` / 坐标轴），再用传入的 `option` 覆盖它——**调用方永远优先**。几个
写法上有意义的约定：

| 写法              | 行为                                                                      |
| ----------------- | ------------------------------------------------------------------------- |
| `legend: false`   | 归一化为 `{ show: false }`，并且不再为图例预留 grid 空间。                |
| `legend: { … }`   | 逐键覆盖预设图例，没提到的键保留。                                        |
| `dataZoom: []`    | 显式清空：即使布局开了 dataZoom，也不生成缩放窗口。                       |
| `dataZoom: [{…}]` | 按 `type` 匹配预设条目并覆盖；无 `type` 时调优第一个（通常是 `inside`）。 |

## 图标配置

ECharts 画**填充路径**，`lucide` 这类描边图标直接放进去是空的，所以本包内置
一组填充字形，并提供三种接入方式：

```vue
<SnChart
  :option="option"
  :icons="{
    legend: 'line', // 内置字形名
    symbol: 'dot',
    toolbox: { saveAsImage: 'download', restore: 'refresh' },
    seriesType: { line: 'line', bar: 'bar' }, // 按系列类型自动配图标
    title: 'trend',
  }"
/>
```

```ts
import { registerChartIcons } from '@snui/echarts';

registerChartIcons({
  brand: { path: 'M0 0h24v24H0z' }, // SVG path
  mark: { svg: '<svg><circle cx="12" cy="12" r="6"/></svg>' }, // SVG 标记（解析成 path）
  logo: { image: 'https://example.com/logo.svg' }, // 图片
});
```

内置字形：`bar` / `column` / `line` / `area` / `pie` / `doughnut` / `scatter` /
`radar` / `gauge` / `funnel` / `tree` / `map` / `heatmap` / `sankey` /
`refresh` / `download` / `fullscreen` / `zoom-in` / `zoom-out` / `back` /
`table` / `save` / `trend` / `warning` / `info` / `dot`。

## Tooltip（深度自定义）

默认渲染组件自己的 DOM tooltip：token 样式、跟随宿主字体与主题、内部按
`--sn-chart-*` 变量取色；同时会关掉 ECharts 原生 tooltip，两者不会同时出现。

```vue
<!-- 配置化 -->
<SnChart
  :option="option"
  :tooltip="{
    trigger: 'axis',
    showPercent: true,
    precision: 1,
    footer: '数据来源：内部统计',
    extraRows: [{ label: '负责人', value: 'admin' }],
  }"
/>
```

```vue
<!-- 完全接管渲染 -->
<SnChart :option="option">
  <template #tooltip="{ model, items }">
    <div class="my-tip">
      <b>{{ model.label }}</b>
      <span v-for="item in items" :key="item.dataIndex">
        {{ item.seriesName }}：{{ item.value }}（{{ item.percent }}%）
      </span>
    </div>
  </template>
</SnChart>
```

```vue
<!-- 回退到 ECharts 原生 tooltip（仍套主题） -->
<SnChart :option="option" :tooltip="{ mode: 'native', trigger: 'axis' }" />
```

## Props

| 名称               | 类型                                         | 默认      | 说明                                        |
| ------------------ | -------------------------------------------- | --------- | ------------------------------------------- |
| `option`           | `EChartsOption`                              | —         | ECharts 原生 option，**最后合并，永远优先** |
| `theme`            | `SnChartThemeConfig`                         | —         | 主题色 / 字体 / 调色板 / `themeOverrides`   |
| `themeMode`        | `'light' \| 'dark' \| 'auto'`                | `auto`    | `auto` 读 `data-theme` / `.dark` / 系统偏好 |
| `layout`           | `SnChartLayoutPreset \| SnChartLayoutConfig` | `default` | 布局预设名或局部配置                        |
| `icons`            | `SnChartIconsConfig`                         | —         | 图例 / 符号 / 工具箱 / 标题图标             |
| `tooltip`          | `SnChartTooltipConfig`                       | —         | tooltip 模式与内容配置                      |
| `loading`          | `boolean`                                    | `false`   | 加载遮罩（复用 SnLoading）                  |
| `loadingText`      | `string`                                     | —         | 加载文案                                    |
| `renderer`         | `'canvas' \| 'svg'`                          | `canvas`  | `svg` 适合打印 / 导出                       |
| `height` / `width` | `number \| string`                           | —         | 数字按 px；不传则撑满父容器                 |
| `devicePixelRatio` | `number`                                     | —         | 画布像素比覆盖                              |
| `useDirtyRect`     | `boolean`                                    | `false`   | 大数据量的脏矩形优化                        |
| `notMerge`         | `boolean`                                    | `false`   | `setOption` 合并策略                        |
| `lazyUpdate`       | `boolean`                                    | `true`    | 频繁更新时延迟渲染                          |
| `ariaLabel`        | `string`                                     | —         | 图表区域无障碍名称                          |
| `autoResize`       | `boolean`                                    | `true`    | 自动监听容器尺寸变化                        |

## Events

| 事件                     | 载荷                                                    |
| ------------------------ | ------------------------------------------------------- |
| `click` / `dblclick`     | `SnChartPointEvent`（seriesName / dataIndex / value …） |
| `mouseover` / `mouseout` | `SnChartPointEvent`                                     |
| `legendselectchanged`    | `{ name, selected }`                                    |
| `datazoom`               | `{ start, end }`                                        |
| `rendered`               | —                                                       |
| `ready`                  | ECharts 实例（可挂自定义监听）                          |
| `tooltipshow`            | `SnChartTooltipModel`（自定义 tooltip 的数据模型）      |

## 插槽

| 名称      | 载荷               | 说明                                 |
| --------- | ------------------ | ------------------------------------ |
| `tooltip` | `{ model, items }` | 完全接管 tooltip 渲染                |
| `empty`   | —                  | 无 series 时的空状态（默认 SnEmpty） |

## Ref 方法

```ts
const chart = ref<SnChartHandle>();

chart.value?.resize();
chart.value?.setOption({/* … */}, { notMerge: true });
chart.value?.getOption();
chart.value?.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: 2 });
chart.value?.getDataURL({ type: 'png', pixelRatio: 2 });
chart.value?.refreshTheme(); // 手动重建主题（例如宿主改了 token 变量）
chart.value?.instance; // 原始 ECharts 实例
```

## 框架无关层

`@snui/echarts/core` 不 import Vue、不 import echarts（echarts 仅类型引用），
可在 Node 脚本 / SSR / 非 Vue 宿主里生成 option：

```ts
import { buildChartTheme, buildChartOption, resolveChartLayout } from '@snui/echarts/core';

const { option } = buildChartOption({
  option: myOption,
  layout: 'compact',
  icons: { seriesType: { line: 'line' } },
});
const theme = buildChartTheme({ config: { colorSource: 'resolved' }, mode: 'dark' });
```

## 端与依赖边界

- `end: web`（§59）—— `@snui/uni` 不能 import 本包；
- 依赖方向 `@snui/echarts → @snui/vue-web → @snui/tokens`，无环（§57）；
- 组件内不直接引用 `--aui-*`：只用 `--sn-web-*` 与自写的 `--sn-chart-*`
  （token-check 规则一致，§34）。

## 已知取舍

- **主题按 `init` 绑定**：ECharts 的 `setTheme` 私有且已废弃。`theme` 或主题
  模式变化时组件会 dispose 后重新 init（`colorSource: 'tokens'` 的纯色值变化
  不需要重建，CSS 变量由级联解析）；
- **DOM tooltip 不 Teleport**：留在图表容器内以继承容器级联；极端位置的浮层
  受容器约束，可用 `tooltip.offset` / `followPointer` / `width` 调整；
- **描边图标不可直接使用**：ECharts 画填充路径，请用 `registerChartIcons` 注册
  填充字形；
- 包标记 `@experimental`（§79），Public API 未冻结。

## 与 SnHeatmap 的关系

`@snui/vue-web/SnHeatmap` 是 naive-ui 对齐的原子展示组件（贡献日历，零依赖）；
本包是图表引擎集成层。两者不互相替代：热力图用于「活动强度网格」，本包用于
「标准图表」。
