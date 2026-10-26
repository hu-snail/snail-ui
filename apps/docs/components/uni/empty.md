# Empty 缺省提示（uni 端 / 移动端）

`sn-empty` 是 `@snui/uni`（移动端 / 小程序 / H5）的空状态占位组件：一个图形（内置内联 SVG / 注册表图标 / iconfont 类名 / 图片 URL）+ 可选提示文案 + 可选底部操作区。基于 easycom 自动注册（`components/sn-empty/sn-empty.vue` → `<sn-empty>`），样式几何值走 `rpx`。

## 基础用法

不传 `icon` 时渲染内置的内联 SVG 缺省图形（不使用 emoji / 外部图片，遵循 AGENTS.md §113）。

<Demo name="empty-mp-basic" description="默认图形、带 tip 文案、长文案换行三档。" />

## 图形来源

`icon` 按以下顺序解析：

1. 看起来像图片地址（`http…` / `//…` / `/…` / `data:` / `./…`）→ 渲染 `<image mode="aspectFit">`
2. `cssIcon` 为真（`true` 或非空类名字符串）→ 把 `iconPrefix` + `icon` 作为类名应用在 `<text>` 上（iconfont 路径）
3. `icon` 能在 sn-icon 注册表里解析到 → 通过 `<sn-icon>` 渲染内联 SVG
4. 都没命中 → 内置 SVG 图形

`iconSize` 数字按 `rpx` 处理，字符串原样透传。

<Demo name="empty-mp-icon" description="注册表图标 / 自定义 iconSize / CSS 图标类名 / data-URI 图片四种来源。" />

## 插槽

- `image`：完全替换图形区域
- `bottom`：提示文案下方的操作区（如重试按钮）

<Demo name="empty-mp-slots" description="bottom 插槽放重试按钮；image 插槽完全自定义图形。" />

## 自定义类名与样式

`customClass` 追加根节点类名，`customStyle` 写根节点内联样式，两者可叠加。

<Demo name="empty-mp-custom" description="custom-class 加虚线外框 / custom-style 加内边距 / 两者叠加。" />

## Props

| 属性          | 类型                | 默认值    | 说明                                            |
| ------------- | ------------------- | --------- | ----------------------------------------------- |
| `icon`        | `string`            | `'empty'` | 缺省图标名称 / 注册表 key / 图片 URL / CSS 类名 |
| `iconPrefix`  | `string`            | `''`      | 图标类名前缀（与 `icon` 一起应用）              |
| `cssIcon`     | `boolean \| string` | `false`   | CSS 图标模式：把 `icon` / `iconPrefix` 当类名   |
| `iconSize`    | `number \| string`  | `''`      | 图标 / 图片大小；数字按 rpx，字符串原样透传     |
| `tip`         | `string`            | `''`      | 提示文案                                        |
| `customClass` | `string`            | `''`      | 根节点自定义类名                                |
| `customStyle` | `string`            | `''`      | 根节点自定义样式                                |

## Events

无。`sn-empty` 是纯展示组件，不发事件。

## Slots

| 插槽名   | 说明               |
| -------- | ------------------ |
| `image`  | 自定义图片区域内容 |
| `bottom` | 自定义底部内容     |

## 主题变量

| 变量                              | 用途                      |
| --------------------------------- | ------------------------- |
| `--sn-mp-color-text-disabled`     | 图形颜色                  |
| `--sn-mp-color-text-secondary`    | 提示文案颜色              |
| `--sn-mp-font-size-md`            | 文案字号                  |
| `--sn-mp-font-line-height-normal` | 文案行高                  |
| `--sn-mp-spacing-5`               | 图形与文案 / 底部区的间距 |
| `--sn-mp-spacing-12`              | 组件底部内边距            |
| `--sn-mp-color-border-default`    | Doodle 皮肤下的描边       |
| `--sn-mp-radius-xl`               | Doodle 皮肤下的圆角       |

## 无障碍

- 根节点挂 `role="status"`，`aria-label` 取 `tip`（为空时用 `"empty"`）
- 图形区域 `aria-hidden="true"`，语义由文案承担
- 无键盘交互；需要交互的元素放进 `bottom` 插槽

## 暗色模式

图形与文案颜色走 `--sn-mp-color-text-disabled` / `--sn-mp-color-text-secondary`，两者都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 加载中占位：[`sn-loading`](/components/uni/loading)
- 进度提示：[`sn-progress`](/components/uni/progress)
