# Echarts 图表

`@snui/echarts` 是 snail-aui 的**图表插件**：在 Apache ECharts 之上补上「宿主集成层」，而不是重写图表库。

ECharts 自己负责**画什么**（`option` 契约、坐标系、系列类型，你写的每一行 option 原样有效）；本包负责**图表之外那一圈事**——主题色怎么跟宿主走、布局怎么统一、图标怎么一处配置、tooltip 怎么变成能放富文本的 DOM 层。这两件事正交，所以包很薄：真正干活的仍然是 ECharts。

> 状态：**experimental**（§79）。公共 API 尚未冻结，破坏性调整会走 changeset 记录。

---

## 为什么不直接用 ECharts

在一个组件库里裸用 ECharts，每个图表页面都会重复解同样四道题：

| 裸用 ECharts 的常见问题                                     | 本包的解法                                                                       |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| 主题色硬编码在 option 里，切暗色 / 换风格包图表不跟         | `theme` 只写意图，颜色默认编译成 `var(--sn-web-*)` 引用，跟着 Token 级联走       |
| 每个页面自己写 `grid` / `legend` 边距，图跟图长得不一样     | 5 个布局预设 + 局部覆盖，`grid` 只为**实际渲染出来**的图例 / 标题 / 工具箱留位置 |
| 图例、系列符号、工具箱、标题四处分别配图标                  | `icons` 一个对象覆盖全部图标位，内置填充字形（描边图标放进 ECharts 是空的）      |
| ECharts 自带 tooltip 是画布绘制，不能放按钮 / 富文本 / 组件 | 默认换成 Token 配色的 **DOM tooltip**，并提供 `#tooltip` 插槽完全接管            |

---

## 安装

```bash
pnpm add @snui/echarts echarts
```

`echarts` 是 **peerDependency**（`^5.6.0 || ^6.0.0`），由宿主决定版本、按需注册与包体积；`@snui/echarts` 不重复打包它。`@snui/vue-web` 是它的普通依赖，用于 loading / empty 这类基础原语。

内置样式（tooltip 皮肤，全部走 `--sn-web-*` Token）需要引入一次：

```ts
import '@snui/echarts/styles';
```

风格包主题、Token 级联来自 `@snui/vue-web/styles`，两者一起用即可。

---

## 快速开始

只传 `option`，其他全部自动派生：

```vue
<script setup lang="ts">
import { SnChart } from '@snui/echarts';
import type { SnEChartsOption } from '@snui/echarts';

const option: SnEChartsOption = {
  xAxis: { type: 'category', data: ['周一', '周二', '周三', '周四', '周五'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: '访问量', smooth: true, data: [820, 932, 901, 934, 1290] },
    { type: 'bar', name: '下单量', data: [220, 282, 291, 334, 390] },
  ],
};
</script>

<template>
  <SnChart :option="option" :height="280" />
</template>
```

<Demo name="echarts-web-basic" description="只有 option：双系列自动出图例，主题色来自 Token，tooltip 是本包自绘的 DOM 层。" />

也可以全局注册：

```ts
import { createApp } from 'vue';
import SnUIECharts from '@snui/echarts';
import '@snui/echarts/styles';

createApp(App).use(SnUIECharts); // 注册 <SnChart>
```

---

## 能力地图

| 能力                                               | 入口                             | 文档                                           |
| -------------------------------------------------- | -------------------------------- | ---------------------------------------------- |
| 主题色（调色板 / 品牌色 / 语义色 / 字号 / 逃生口） | `theme` prop                     | [使用文档 · 主题色](/echarts/usage#主题色配置) |
| 布局预设与局部覆盖                                 | `layout` prop                    | [使用文档 · 布局](/echarts/usage#布局)         |
| 一体化图标配置                                     | `icons` prop                     | [使用文档 · 图标](/echarts/usage#图标)         |
| tooltip 深度定制（自绘 / 插槽 / 原生回退）         | `tooltip` prop + `#tooltip` 插槽 | [使用文档 · Tooltip](/echarts/usage#tooltip)   |
| loading / 空态                                     | `loading` prop + `#empty` 插槽   | [使用文档 · 状态](/echarts/usage#状态)         |
| 实例级能力（导出图片 / 派发 action / 重取 option） | `ref` 上的 handle                | [使用文档 · Ref 方法](/echarts/usage#ref-方法) |
| 框架无关层（Node / SSR / AI 工具里生成 option）    | `@snui/echarts/core`             | [框架无关层](#框架无关层)                      |

---

## 设计原则

1. **`option` 契约不变。** 你写的 `option` 最后合并，永远优先；本包只往它周围补派生配置。
2. **Token 而不是字面量。** 默认 `colorSource: 'tokens'`，颜色是 `var(--sn-web-*)` 引用，切暗色 / 切风格包时画布重绘而**不重建实例**。需要导出图片 / 非 DOM 宿主时再切 `'resolved'` 快照字面量。
3. **平台差异用能力探测，不用分支复制。** 主题模式按 `<html data-theme>` → `.dark` → `prefers-color-scheme` 依次探测，并用 `MutationObserver` + 媒体查询跟随变化。
4. **资源全部可释放。** 实例、`ResizeObserver`、窗口监听、主题 `MutationObserver`、媒体查询监听、全部 ECharts handler 与未完成的定时器 / rAF 在卸载时释放（§41）；卸载前排队的 resize 也碰不到已销毁的实例（§82）。

---

## 框架无关层

主题构建、布局解析、图标注册表、tooltip 渲染与 option 合并没有一行 Vue 代码：

```ts
import { buildChartTheme, buildChartOption, resolveChartLayout } from '@snui/echarts/core';

// Node 脚本 / SSR / AI 工具里生成一份合法 option，不引入 Vue，也不引入 echarts 运行时
const { option, layout, customTooltip } = buildChartOption({
  option: rawOption,
  layout: 'compact',
  theme,
});
```

`@snui/echarts` 入口重新导出了这一层，Vue 应用只引主入口即可。

---

## 与 ECharts 的关系

- **不是 fork、不是封装掉 ECharts 的部分 API**：所有系列类型、坐标系、`graphic`、`dataset`、自定义系列都能用。
- **不注册 ECharts 组件**：主入口 `import * as echarts from 'echarts'` 用的是完整构建；要按需瘦身请在宿主侧改用 `echarts/core` + 自己的 `SnChart`，或等待后续的按需入口。
- **不接管数据**：`option` 是唯一输入，包不从任何地方取数（§18）。

## 已知取舍

| 取舍                 | 说明                                                                                        |
| -------------------- | ------------------------------------------------------------------------------------------- |
| ECharts 为 peer 依赖 | 版本与包体积由宿主决定，升级 ECharts 不需要本包发版                                         |
| 完整构建             | 当前主入口用 `echarts` 完整包；按需注册的瘦身入口尚未提供                                   |
| 主题在 `init` 时绑定 | ECharts 的 `setTheme` 是私有 API，所以主题变更走「销毁 + 重建」，用内容签名判断避免无谓重建 |
| 图标是填充路径       | ECharts 画 `path://` 填充，lucide 这类描边图标直接放进去是空的，所以内置一套填充字形        |
| Uni / 小程序端       | 当前只提供 Web 端组件（`@snui/vue-web` 依赖）；多端渲染层未纳入本包范围                     |
