# Divider 分割线（uni 端 / 移动端）

`sn-divider` 是 `@snui/uni`（移动端 / 小程序 / H5）的视觉分隔组件。基于 easycom 自动注册，rpx 单位跨设备缩放。

## 实时预览

<Demo name="divider-mp" description="水平 / 虚线 / 带文字 / marginSize / 垂直 等全部 variants 的综合预览。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```html
<p>上方文本</p>
<sn-divider />
<p>下方文本</p>
```

如需显式 import：

```ts
import { SnDivider } from '@snui/uni'
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| `dashed` | `boolean` | `false` | 虚线 |
| `hairline` | `boolean` | `true` | 细线（1rpx）|
| `color` | `string` | — | 自定义颜色 |
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | 垂直外边距（仅 horizontal）|

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 中间文字（仅 horizontal 渲染）|

## 相关

- Web 端：[`SnDivider`](/components/web/divider)
