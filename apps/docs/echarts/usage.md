# 使用文档

`SnChart` 的全部入参、事件、插槽与实例方法，以及四项深度定制的写法。所有示例都只依赖 `@snui/echarts` + `echarts`。

---

## 基础结构

```vue
<script setup lang="ts">
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {/* 标准 ECharts option */};
</script>

<template>
  <SnChart :option="option" :height="320" aria-label="图表的无障碍名称" />
</template>
```

高度建议显式给（`height` 或父容器定高），否则图表容器高度为 0。

---

## Props

| 名称               | 类型                            | 默认值      | 说明                                                      |
| ------------------ | ------------------------------- | ----------- | --------------------------------------------------------- |
| `option`           | `EChartsOption`                 | —           | ECharts 标准 option，**最后合并，永远优先**。             |
| `theme`            | `SnChartThemeConfig`            | —           | 主题色 / 调色板 / 字号 / `themeOverrides`。               |
| `themeMode`        | `'light' \| 'dark' \| 'auto'`   | `'auto'`    | `'auto'` 时按宿主 `data-theme` / `.dark` / 系统偏好探测。 |
| `layout`           | 预设名 \| `SnChartLayoutConfig` | `'default'` | 布局预设或局部覆盖。                                      |
| `icons`            | `SnChartIconsConfig`            | —           | 图例 / 系列符号 / 工具箱 / 标题图标。                     |
| `tooltip`          | `SnChartTooltipConfig`          | —           | tooltip 配置；不传即开启自绘 DOM tooltip。                |
| `loading`          | `boolean`                       | `false`     | 显示 loading 遮罩。                                       |
| `loadingText`      | `string`                        | —           | loading 文案。                                            |
| `renderer`         | `'canvas' \| 'svg'`             | `'canvas'`  | 渲染器；`'svg'` 在打印 / 导出场景更清晰。                 |
| `height`           | `number \| string`              | —           | 固定高度（数字为 px）；不给则撑满父容器。                 |
| `width`            | `number \| string`              | —           | 固定宽度（数字为 px）。                                   |
| `devicePixelRatio` | `number`                        | —           | 画布像素比覆盖。                                          |
| `useDirtyRect`     | `boolean`                       | `false`     | 脏矩形渲染（大数据集）。                                  |
| `notMerge`         | `boolean`                       | `false`     | `setOption` 的合并策略；默认合并。                        |
| `lazyUpdate`       | `boolean`                       | `true`      | option 频繁变化时节流更新。                               |
| `ariaLabel`        | `string`                        | —           | 图表区域的无障碍名称。                                    |
| `autoResize`       | `boolean`                       | `true`      | 关闭内置 `ResizeObserver`。                               |

---

## Events

| 事件                  | 载荷                  | 说明                                  |
| --------------------- | --------------------- | ------------------------------------- |
| `click`               | `SnChartPointEvent`   | 点击数据项 / 图形元素。               |
| `dblclick`            | `SnChartPointEvent`   | 双击。                                |
| `mouseover`           | `SnChartPointEvent`   | 指针进入数据项。                      |
| `mouseout`            | `SnChartPointEvent`   | 指针离开数据项。                      |
| `legendselectchanged` | `{ name, selected }`  | 图例选中态变化。                      |
| `datazoom`            | `{ start?, end? }`    | dataZoom 视窗变化。                   |
| `rendered`            | —                     | 一次渲染完成。                        |
| `ready`               | `EChartsType`         | 实例创建 / 重建完成，可挂自定义处理。 |
| `tooltipshow`         | `SnChartTooltipModel` | 自绘 tooltip 即将显示，可读取模型。   |

```vue
<SnChart
  :option="option"
  @click="({ name, value }) => console.log(name, value)"
  @legendselectchanged="({ selected }) => console.log(selected)"
/>
```

---

## Slots

| 名称      | 插槽 props         | 说明                                                     |
| --------- | ------------------ | -------------------------------------------------------- |
| `tooltip` | `{ model, items }` | 完全接管自绘 tooltip 的内容（定位 / 显隐仍由组件负责）。 |
| `empty`   | —                  | 没有数据时的空态内容，默认渲染 `SnEmpty`。               |

---

## Ref 方法

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SnChart } from '@snui/echarts';
import type { SnChartHandle } from '@snui/echarts';

const chart = ref<SnChartHandle | null>(null);
</script>

<template>
  <SnChart ref="chart" :option="option" :height="320" />
</template>
```

| 成员                       | 说明                                  |
| -------------------------- | ------------------------------------- |
| `instance`                 | 底层 `EChartsType`（可能为 `null`）。 |
| `resize()`                 | 手动重算尺寸。                        |
| `setOption(option, opts?)` | 直接写 option。                       |
| `getOption()`              | 读取当前 option。                     |
| `dispatchAction(payload)`  | 派发 ECharts action。                 |
| `getDataURL(opts?)`        | 导出图片（base64）。                  |
| `refreshTheme()`           | 主题配置变化后强制重建实例。          |

---

## 主题色配置

`theme` 描述**意图**，Token ↔ ECharts theme 的映射由包完成。

| 字段                                                          | 说明                                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `colorPrimary`                                                | 品牌色，占用调色板首位。                                                 |
| `colorSuccess` / `colorWarning` / `colorDanger` / `colorInfo` | 语义色。                                                                 |
| `palette`                                                     | 系列配色循环，顺序即取色顺序。                                           |
| `textColor` / `textColorSecondary` / `textColorTertiary`      | 文本阶梯。                                                               |
| `backgroundColor`                                             | 绘图区背景，默认透明（由宿主卡片上色）。                                 |
| `borderColor`                                                 | 分割线 / 轴线颜色。                                                      |
| `fontFamily` / `fontSize`                                     | 字体栈 / 基准字号。                                                      |
| `colorSource`                                                 | `'tokens'`（默认）保留 `var(--sn-web-*)` 引用；`'resolved'` 快照字面量。 |
| `themeOverrides`                                              | 逃生口：任意键递归合并进 ECharts theme，未提到的键保留。                 |

<Demo name="echarts-web-theme" description="品牌色 + 自定义调色板 + legend.textStyle 逃生口；颜色仍是 Token 引用，切暗色时画布跟着重绘。" />

```vue
<SnChart :option="option" :theme="{ colorPrimary: '#7c3aed', palette: ['#7c3aed', '#06b6d4'] }" />
```

需要导出图片、或在没有 DOM 的宿主里渲染时，让颜色退化成字面量：

```vue
<SnChart :option="option" :theme="{ colorSource: 'resolved' }" />
```

---

## 布局

布局决定「绘图区之外那一圈」：`grid` 内边距、图例位置、标题、工具箱、dataZoom、坐标轴开关。

| 预设         | 场景                                        |
| ------------ | ------------------------------------------- |
| `default`    | 卡片尺寸图表（内边距 12，顶部居中图例）。   |
| `compact`    | 仪表盘密集排布（内边距 8，轴标签截断）。    |
| `spacious`   | 汇报 / 大屏（内边距 20，底部图例 + 标题）。 |
| `fullscreen` | 满屏面板（内边距 0，工具箱内嵌）。          |
| `minimal`    | 指标卡 / 迷你图（无图例、无坐标轴）。       |

<Demo name="echarts-web-layout" description="同一个 option 切换 default / compact / spacious / minimal —— 只换 layout，option 不动。" />

对象形式从 `default` 起步，只覆盖给出的字段：

```vue
<SnChart
  :option="option"
  :layout="{ legend: { position: 'right', align: 'center' }, grid: 16, axis: { showSplitLine: false } }"
/>
```

**派生配置的约定**（调用方永远优先）：

| 写法                | 行为                                                                      |
| ------------------- | ------------------------------------------------------------------------- |
| `legend: false`     | 归一化为 `{ show: false }`，并且不再为图例预留 grid 空间。                |
| `legend: { … }`     | 逐键覆盖预设图例，未提到的键保留。                                        |
| `dataZoom: []`      | 显式清空：即使布局开了 dataZoom，也不生成缩放窗口。                       |
| `dataZoom: [{ … }]` | 按 `type` 匹配预设条目并覆盖；无 `type` 时调优第一个（通常是 `inside`）。 |

`grid` 只为**实际渲染出来**的图例 / 标题 / 工具箱留位置，所以隐藏了图例的图表不会白白空出一条边。

---

## 图标

ECharts 画 `path://` **填充**路径，所以描边图标（lucide 之类）直接塞进去是空的。本包内置一套 24×24 填充字形，并用一个对象统一配置所有图标位。

| 字段         | 说明                                                       |
| ------------ | ---------------------------------------------------------- |
| `legend`     | 图例标记（ECharts `legend.icon`）。                        |
| `symbol`     | 系列符号（`series.symbol`），对所有系列生效。              |
| `seriesType` | 按系列类型给符号：`{ line: 'trend', bar: 'column' }`。     |
| `toolbox`    | 工具箱按钮图标，按 feature 名：`{ saveAsImage: 'save' }`。 |
| `title`      | 标题左侧字形。                                             |

<Demo name="echarts-web-icons" description="legend / seriesType / toolbox 一处配置；内置字形已覆盖常见图表类型与工具动作。" />

图标值可以是以下任意一种：

| 形式                | 例子                                     |
| ------------------- | ---------------------------------------- |
| 内置字形名          | `'trend'` / `'save'`                     |
| 现成的路径 / 图片串 | `'path://M0 0h24v24H0z'` / `'image://…'` |
| `http(s)` URL       | `'https://cdn.example.com/logo.svg'`     |
| 相对路径            | `'/icons/sq.svg'` / `'./sq.svg'`         |
| 原始 SVG 源码       | `'<svg …>…</svg>'`（解析成 path data）   |

内置字形：`bar` `column` `line` `area` `pie` `doughnut` `scatter` `radar` `gauge` `funnel` `tree` `map` `heatmap` `sankey` `refresh` `download` `fullscreen` `zoom-in` `zoom-out` `back` `table` `save` `trend` `warning` `info` `dot`。

也可以注册自己的字形：

```ts
import { registerChartIcons } from '@snui/echarts';

registerChartIcons({ rocket: { svg: '<svg viewBox="0 0 24 24">…</svg>' } });
// 之后 icons={{ legend: 'rocket' }} 即可用
```

**只填空位**：`option` 里显式写过的图标不会被覆盖，所以整体配置与单点覆盖可以共存。

---

## Tooltip

默认的 tooltip 是本包自绘的 **DOM 层**——Token 配色、跟随宿主主题、可以放富文本 / 链接 / 组件，而不是 ECharts 的画布绘制。

| 字段                                                        | 默认值     | 说明                                                           |
| ----------------------------------------------------------- | ---------- | -------------------------------------------------------------- |
| `mode`                                                      | `'custom'` | `'custom'` 自绘 DOM / `'native'` ECharts 原生 / `false` 关闭。 |
| `trigger`                                                   | `'item'`   | `'item'` 逐项 / `'axis'` 同轴 / `'none'` 不触发。              |
| `followPointer`                                             | `true`     | 跟随指针；`false` 时固定在数据项上。                           |
| `offset`                                                    | `[12, 12]` | 相对指针的偏移。                                               |
| `showMarker` / `showSeriesName` / `showValue` / `showLabel` | `true`     | 内容开关。                                                     |
| `showPercent`                                               | `false`    | 追加占比（饼图类数据）。                                       |
| `precision`                                                 | —          | 小数位（钳制在 0–20）。                                        |
| `valueFormatter`                                            | —          | 自定义值格式，优先于 `precision`。                             |
| `labelFormatter`                                            | —          | 自定义标题格式，优先于 `showLabel`。                           |
| `footer`                                                    | —          | 底部说明行。                                                   |
| `html`                                                      | `false`    | `footer` 按 HTML 渲染（关闭时转义，防 XSS）。                  |
| `extraRows`                                                 | —          | 追加行 `[{ label, value, color? }]`。                          |
| `width`                                                     | —          | 固定宽度（px）；不给则内容自适应，上限 240。                   |
| `transition`                                                | `120`      | 进出场动画时长（ms）。                                         |
| `keepOnHover`                                               | `true`     | 指针停在 tooltip 上时保持显示。                                |
| `nativeOverrides`                                           | —          | 逃生口：合并进原生 tooltip option 的额外键。                   |

### 配置驱动

<Demo name="echarts-web-tooltip" description="showPercent + precision + footer + extraRows：内容开关就能覆盖大多数报表场景。" />

### 插槽完全接管

`#tooltip` 拿到 `model`（标题 / 系列行 / 额外行 / 开关）与 `items`，你可以丢掉默认排版自己画，定位和显隐交给组件：

<Demo name="echarts-web-tooltip-slot" description="自绘 tooltip 内容：色点 + 系列名 + 数值 + 自定义脚注，坐标与动画仍由组件负责。" />

### 回退原生

需要 ECharts 原版交互（例如 `axis` 指示线）时切回原生：

<Demo name="echarts-web-native" description="mode='native' + trigger='axis'：tooltip 交回 ECharts，只继承主题配色。" />

> `mode: 'custom'` + `trigger: 'axis'` 也支持：ECharts 只在它自己的 tooltip formatter 里组装同轴多系列载荷，所以此时原生 tooltip 保持开启但不可见，仅用于把数据转发给 DOM 层，两者不会同时画出来。

---

## 状态

```vue
<SnChart :option="option" :loading="loading" loading-text="加载中…" :height="320">
  <template #empty>
    <span>暂无数据</span>
  </template>
</SnChart>
```

无数据时（series 为空 / 全部为空数组）显示 `#empty`，默认渲染 `@snui/vue-web` 的 `SnEmpty`；`loading` 与空态互斥，loading 优先。

---

## 深度定制

本包不遮挡 ECharts，任何 option 键都能直接用；只有「图表之外」的部分走配置：

```vue
<SnChart
  :option="option"
  :theme="{ colorPrimary: 'var(--brand-500)', themeOverrides: { categoryAxis: { axisTick: { show: false } } } }"
  :tooltip="{ mode: 'native', nativeOverrides: { formatter: (p) => `${p.name}: ${p.value}` } }"
  :icons="{ seriesType: { line: 'trend' } }"
  :layout="{ legend: { position: 'bottom' }, axis: { labelMaxLength: 6 } }"
/>
```

三个逃生口的分工：

| 逃生口                    | 作用范围                       |
| ------------------------- | ------------------------------ |
| `option`                  | 一切——最后合并，优先级最高。   |
| `theme.themeOverrides`    | ECharts theme 层（全局样式）。 |
| `tooltip.nativeOverrides` | 原生 tooltip option 层。       |

---

## 常见问题

**图表不显示 / 高度为 0？** 给 `height` 或让父容器有确定高度；`autoResize` 只负责随容器变化重算，不能凭空撑开容器。

**暗色模式没生效？** `themeMode: 'auto'` 依赖宿主的 `<html data-theme="dark">`、`.dark` 类或系统偏好。宿主用自己的开关时，直接把 `themeMode` 显式传进来最稳。

**tooltip 里想放按钮 / 组件？** 用 `#tooltip` 插槽，不要用 `footer` + `html`——插槽是 Vue 渲染的，事件与组件都正常。

**导出图片颜色变了？** 默认颜色是 `var(--sn-web-*)` 引用，导出到画布时可能解析不到。导出场景把 `colorSource` 设为 `'resolved'`。
