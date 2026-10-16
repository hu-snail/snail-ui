# Card · uni-app（移动端）

`<view role="region">` 容器，移动 / 小程序端简单卡片的承载层。视觉走 `--sn-mp-card-*` Token 别名层（rpx 单位），props 与 slots 遵循本库的双端契约。


## 基本用法

<Demo name="card-mp" description="默认 Card（带 title prop + footer slot）+ Rectangle Card（type='rectangle'，列表大格样式）。" />

## Props

> 完整 prop 列表遵循本库的双端契约。**Web 端的 `variant` / `padding` / `shadow` / `closable` / `hoverable` / `embedded` / `segmented` 等便利 alias 在 uni 端有意不实现**（传入会被契约校验拒绝）。

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `''` | 卡片标题（与 `title` slot 互斥） |
| `type` | `string` | `''` | 卡片类型，支持 `'rectangle'`（大格样式） |
| `customTitleClass` | `string` | `''` | 标题区自定义类名 |
| `customContentClass` | `string` | `''` | 内容区自定义类名 |
| `customFooterClass` | `string` | `''` | 底部区自定义类名 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义 inline style |

## Slots

| Slot | Description |
| --- | --- |
| `default` | 内容区 |
| `title` | 自定义标题区（覆盖 `title` prop） |
| `footer` | 底部操作区 |

## 区域省略规则

- `title` 区仅在 `title` slot 或 `title` prop 非空时渲染
- `content` 区仅在 default slot 有内容时渲染
- `footer` 区仅在 `footer` slot 有内容时渲染

## Tokens（end: mp）

| Token | CSS Variable | 用途 |
| --- | --- | --- |
| Card padding | `--sn-mp-card-padding` | 默认内 padding |
| Card radius | `--sn-mp-card-radius` | 圆角 |
| Border default | `--sn-mp-color-border-default` | footer 分割线 |
| Text primary | `--sn-mp-color-text-primary` | 标题 + 正文 |
| Background surface | `--sn-mp-color-background-surface` | 卡片背景 |

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `'region'` |
| 键盘 | 不可聚焦（移动端 tap 不触发 focus） |