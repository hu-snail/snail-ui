# Divider 分割线（uni 端 / 移动端）

`sn-divider` 是 `@snui/uni`（移动端 / 小程序 / H5）的视觉分隔组件。基于 easycom 自动注册，rpx 单位跨设备缩放。

## 实时预览

<Demo name="divider-mp" description="水平 / 虚线 / 带文字 / marginSize / 垂直 等全部 variants 的综合预览。" />

## 文字位置（content-position）

`contentPosition` 只在水平方向、且带文字时生效：线的宽度始终撑满，位置变化的是文字，文字背景把线遮出一段空隙：

<Demo name="divider-mp-content-position" description="content-position 三档 left / center / right，可与 dashed / marginSize 叠加。" />

## 垂直分割线 + 自定义样式

`vertical` 与 `direction` 设为 `vertical` 等价；垂直分割线默认 `height: 1em`，用 `custom-class` / `custom-style` 覆盖高度与颜色：

<Demo name="divider-mp-vertical" description="vertical 与 direction 两种写法；dashed / color；customClass 与 customStyle 覆盖默认 1em 高度。" />

## 细线（`hairline`）

`hairline` 默认 `true`：水平线 `border-top-width: 1rpx`、垂直线 `border-left-width: 1rpx`（1rpx 在 750 设计稿下是 0.5px，即移动端的一像素细线）。置 `false` 回到 `2rpx` 常规线宽。可与 `dashed` 叠加。

<Demo name="divider-mp-hairline" description="hairline 开 / 关对比：水平线、带文字、垂直线与细虚线。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<p>上方文本</p>
<sn-divider />
<p>下方文本</p>
```

如需显式 import：

```ts
import { SnDivider } from '@snui/uni';
```

## API

### Props

| 名称              | 类型                              | 默认值         | 说明                                         |
| ----------------- | --------------------------------- | -------------- | -------------------------------------------- |
| `direction`       | `'horizontal' \| 'vertical'`      | `'horizontal'` | 方向                                         |
| `dashed`          | `boolean`                         | `false`        | 虚线                                         |
| `hairline`        | `boolean`                         | `true`         | 细线（1rpx）                                 |
| `color`           | `string`                          | —              | 自定义颜色                                   |
| `marginSize`      | `'small' \| 'medium' \| 'large'`  | `'medium'`     | 垂直外边距（仅 horizontal）                  |
| `contentPosition` | `'left' \| 'center' \| 'right'`   | `'center'`     | 文字位置（仅 horizontal 带文字时生效）       |
| `vertical`        | `boolean`                         | `false`        | 垂直分割线（与 `direction="vertical"` 等价） |
| `customClass`     | `string`                          | `''`           | 根节点 class                                 |
| `customStyle`     | `string \| Record<string,string>` | `''`           | 根节点 inline style                          |

### Slots

| 名称      | 说明                           |
| --------- | ------------------------------ |
| `default` | 中间文字（仅 horizontal 渲染） |

## 相关

- Web 端：[`SnDivider`](/components/web/divider)
