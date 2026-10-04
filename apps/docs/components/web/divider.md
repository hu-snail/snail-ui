# Divider 分割线（Web 端）

`SnDivider` 是 `@snui/vue-web`（PC 桌面端）的视觉分隔组件。所有视觉属性通过 `--sn-web-*` Token 别名层驱动。

## 实时预览

<Demo name="divider-web" description="水平 / 虚线 / 带文字 / marginSize / 垂直 等全部 variants 的综合预览。" />

## 基础用法

`<SnDivider />` 即用，组件根据父容器自动撑开：

```ts
import { SnDivider } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<p>上方文本</p>
<SnDivider />
<p>下方文本（horizontal 默认）</p>
```

## API

### Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 方向 |
| `dashed` | `boolean` | `false` | 虚线 |
| `color` | `string` | — | 自定义颜色（任意 CSS 颜色值）|
| `marginSize` | `'small' \| 'medium' \| 'large'` | `'medium'` | 垂直外边距（仅 horizontal 生效）|

### Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 中间文字（仅 horizontal 方向渲染）|

## 无障碍

- `role="separator"`
- `aria-orientation` 跟随 `direction` prop
- 纯装饰，无键盘交互

## 相关

- uni 端：[`sn-divider`](/components/uni/divider)
