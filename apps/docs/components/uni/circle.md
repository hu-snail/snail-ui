# Circle 环形进度条（uni 端 / 移动端）

`sn-circle` 是 `@snui/uni`（移动端 / 小程序 / H5）的环形进度条：0–100 的数值映射为一段圆弧，中间显示文案。**实现方式与 wot-ui 不同**：环形用 CSS `conic-gradient` + 遮罩绘制，而不是 SVG `stroke-dasharray` —— 小程序各端不保证任意图形的 inline-SVG 宿主。基于 easycom 自动注册（`components/sn-circle/sn-circle.vue` → `<sn-circle>`），样式几何值走 `rpx`。

> **未实现**
>
> - `stroke-linecap`（`butt` / `round` / `square`）：conic 圆弧没有端点形状，属性仅为 API 对齐保留，不影响渲染。

## 基础用法

`modelValue` 越界会截断到 0–100；`size` / `strokeWidth` 的数字按 rpx 处理，字符串原样透传。

<Demo name="circle-mp-basic" description="0 / 30 / 70 / 100 四档，以及三档尺寸与动态加减。" />

## 颜色与形态

`color` 支持纯色字符串与 `{ offset: color }` 渐变表；`layerColor` 换轨道色，`fill` 在环内填充一块底盘，`clockwise=false` 反向扫过。

<Demo name="circle-mp-color" description="状态色 / 渐变色 / 自定义轨道与底盘 / 逆时针。" />

## 动画速度与自定义样式

`speed` 是「每秒多少百分比」，`0` 关闭过渡；`strokeLinecap` 仅为对齐声明（锥形扫描没有端点）；`customClass` / `customStyle` 落在根节点。

<Demo name="circle-mp-custom" description="speed=0 / 200 / 10 三档过渡，stroke-linecap 三种取值，以及根节点类名与内联样式。" />

## Props

| 属性          | 类型                             | 默认值  | 说明                                        |
| ------------- | -------------------------------- | ------- | ------------------------------------------- |
| modelValue    | number                           | 0       | 当前进度，0–100（越界截断）                 |
| size          | number \| string                 | 120     | 圆环直径（数字按 rpx）                      |
| color         | string \| Record<string, string> | ''      | 进度色：纯色，或 `{ offset: color }` 渐变表 |
| layerColor    | string                           | ''      | 轨道颜色                                    |
| fill          | string                           | ''      | 环内底盘填充色；为空则是空心环              |
| speed         | number                           | 50      | 动画速度（百分比 / 秒）；`0` 关闭过渡       |
| text          | string                           | ''      | 圆环中间文字；为空则显示四舍五入后的百分比  |
| strokeWidth   | number \| string                 | 18      | 进度条宽度（数字按 rpx）                    |
| strokeLinecap | 'butt' \| 'round' \| 'square'    | 'round' | 端点形状（对齐用，无效果）                  |
| clockwise     | boolean                          | true    | 是否顺时针增加                              |
| customClass   | string                           | ''      | 根节点自定义类名                            |
| customStyle   | string                           | ''      | 根节点自定义样式                            |

## Events

无。`` 是纯展示组件，不发事件。

## Slots

| 插槽名  | 说明                                       |
| ------- | ------------------------------------------ |
| default | 自定义圆环中心内容（替代 `text` / 百分比） |

## 主题变量

| 变量                            | 用途         |
| ------------------------------- | ------------ |
| --sn-mp-color-action-primary    | 默认进度色   |
| --sn-mp-color-background-subtle | 轨道颜色     |
| --sn-mp-color-text-primary      | 中心文字     |
| --sn-mp-font-size-lg            | 中心文字字号 |
| --sn-mp-font-weight-medium      | 中心文字字重 |
| --sn-mp-font-line-height-tight  | 中心文字行高 |

## 无障碍

- 根节点：`role="progressbar"` + `aria-valuenow` / `aria-valuemin` / `aria-valuemax`
- `aria-label` 与渲染出的中心文案一致
- 轨道 / 圆弧 / 底盘节点均为 `aria-hidden="true"`
- 无键盘交互（只读指示器）

## 暗色模式

轨道与文字颜色来自语义色 token（`--sn-mp-color-background-subtle` / `--sn-mp-color-text-primary`），默认进度色是 `--sn-mp-color-action-primary`；这些都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

> 若通过 `color` / `layerColor` / `fill` 传了自定义色值，该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式。

## 相关

- 线性进度条：[`sn-progress`](/components/uni/progress)
- 数字滚动：[`sn-count-to`](/components/uni/count-to)
