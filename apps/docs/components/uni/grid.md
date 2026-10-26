# Grid 宫格（uni 端 / 移动端）

`sn-grid` 是 `@snui/uni`（移动端 / 小程序 / H5）的宫格容器，`sn-grid-item` 是单个格子。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`column` 指定列数，`sn-grid-item` 承载图标与文案：

<Demo name="grid-mp-basic" description="column=3 三列；border 显示内边框；icon 经图标注册表解析；value 渲染角标。" />

## 列数、间距与排列

`gutter` 控制格子间距，`square` 固定正方形，`direction` / `reverse` 调整内容排列：

<Demo name="grid-mp-layout" description="column=4 + gutter 间距 + square 正方形；direction=horizontal 横向排列；reverse 调换图标与文字位置。" />

## 背景色、点击反馈与图标尺寸

`bg-color` 覆盖宫格背景色，`clickable` 开启格子点击反馈并按 `hover-class` 给出按压态，`center` 控制内容居中，`icon-size` 设置图标尺寸，`custom-class` / `custom-style` 落在根节点：

<Demo name="grid-mp-feedback" description="bg-color 背景色；clickable + hover-class 点击反馈；center=false 顶对齐；icon-size；custom-class / custom-style。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-grid :column="3">
  <sn-grid-item text="首页" icon="Home" />
</sn-grid>
```

如需显式 import：

```ts
import { SnGrid } from '@snui/uni/components/sn-grid/sn-grid.vue';
import { SnGridItem } from '@snui/uni/components/sn-grid/sn-grid-item.vue';
```

## Props

### sn-grid

| 属性          | 类型                         | 默认值                           | 说明                      |
| ------------- | ---------------------------- | -------------------------------- | ------------------------- |
| `column`      | `number`                     | `3`                              | 列数                      |
| `border`      | `boolean`                    | `false`                          | 是否显示边框              |
| `gutter`      | `number`                     | `0`                              | 格子之间的间距（px）      |
| `square`      | `boolean`                    | `false`                          | 是否将格子固定为正方形    |
| `clickable`   | `boolean`                    | `false`                          | 是否开启格子点击反馈      |
| `bgColor`     | `string`                     | `''`                             | 背景颜色设置（内联覆盖）  |
| `hoverClass`  | `string`                     | `'sn-grid-item__content--hover'` | 按下去的样式类            |
| `center`      | `boolean`                    | `true`                           | 是否将格子内容居中显示    |
| `direction`   | `'horizontal' \| 'vertical'` | `'vertical'`                     | 格子内容排列方向          |
| `reverse`     | `boolean`                    | `false`                          | 是否调换图标和文本的位置  |
| `iconSize`    | `string`                     | `'28px'`                         | 图标大小（默认单位 px）   |
| `customClass` | `string`                     | `''`                             | 根节点自定义类名          |
| `customStyle` | `string`                     | `''`                             | 根节点自定义 inline style |

### sn-grid-item

| 属性          | 类型                                                        | 默认值         | 说明                                      |
| ------------- | ----------------------------------------------------------- | -------------- | ----------------------------------------- |
| `text`        | `string`                                                    | `''`           | 文字内容                                  |
| `ellipsis`    | `boolean`                                                   | `false`        | 是否超出隐藏显示省略号                    |
| `icon`        | `string`                                                    | `''`           | 图标名称（经 `registerSnIcons()` 注册）   |
| `iconColor`   | `string`                                                    | `''`           | 图标颜色（内联覆盖）                      |
| `iconPrefix`  | `string`                                                    | `''`           | 图标类名前缀                              |
| `cssIcon`     | `boolean \| string`                                         | `false`        | CSS（字体）图标                           |
| `isDot`       | `boolean`                                                   | `false`        | 是否显示图标右上角小红点                  |
| `value`       | `string \| number`                                          | `undefined`    | 图标右上角徽标显示值                      |
| `max`         | `number`                                                    | `99`           | 徽标最大值，超过显示 `{max}+`             |
| `url`         | `string`                                                    | `''`           | 点击后跳转的链接地址（仅随 `click` 透出） |
| `linkType`    | `'navigateTo' \| 'switchTab' \| 'reLaunch' \| 'redirectTo'` | `'navigateTo'` | 页面跳转方式（仅随 `click` 透出）         |
| `customClass` | `string`                                                    | `''`           | 根节点自定义类名                          |
| `customStyle` | `string`                                                    | `''`           | 根节点自定义 inline style                 |

> **路由**：`url` / `linkType` 只随 `click` 透出，组件**不自行跳转** —— 路由属于宿主 AppBridge 能力（AGENTS.md §60）。

## Events

| 事件名  | 说明                                        | 参数                  |
| ------- | ------------------------------------------- | --------------------- |
| `click` | 格子被点击（`clickable` 或设置了 `url` 时） | `({ url, linkType })` |

## Slots

| 插槽名            | 说明                            |
| ----------------- | ------------------------------- |
| `default`（grid） | 宫格内容（`sn-grid-item` 集合） |
| `default`（item） | 自定义全部内容                  |
| `icon`（item）    | 图标位内容                      |
| `text`（item）    | 文本位内容                      |

## 主题变量

| 变量                                            | 用途                    |
| ----------------------------------------------- | ----------------------- |
| `--sn-mp-color-background-surface`              | 宫格底色                |
| `--sn-mp-color-background-soft`                 | 点击态底色              |
| `--sn-mp-color-border-subtle`                   | 内边框                  |
| `--sn-mp-color-text-secondary`                  | 图标颜色                |
| `--sn-mp-color-text-primary`                    | 文字颜色                |
| `--sn-mp-color-feedback-danger`                 | 角标填充                |
| `--sn-mp-color-text-on-primary`                 | 角标文字色              |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-xs` | 文字 / 角标字号         |
| `--sn-mp-font-line-height-tight`                | 文字行高                |
| `--sn-mp-radius-full`                           | 角标圆角                |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-4`       | 格子内边距 / 上下内边距 |

## 无障碍

- 宫格容器 `role="list"`，每个格子 `role="listitem"`。
- 角标是格子内的装饰文本，语义由 `text` 承担。
- 图标为装饰元素；`icon` 名称不参与朗读。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-grid` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：宫格底色切到暗色表面，内边框使用暗色边框令牌，图标转为暗色次级文本、文字转为暗色主文本，角标保持危险色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 栅格布局：[`sn-layout`](/components/uni/layout)
- 单元格：[`sn-cell`](/components/uni/cell)
- 徽标：[`sn-badge`](/components/uni/badge)
