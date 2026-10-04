# Input · uni-app（多端）

跨 uni-app 多端的受控输入控件。rpx 几何，token 别名层驱动样式；H5 / 微信小程序 / App 全端共用一套 API。

## 基础用法

<Demo name="input-mp-basic" description="v-model 双向绑定。" />

## 类型（type）

<Demo name="input-mp-types" description="7 种原生 input 类型：text / password / email / number / tel / url / search。" />

## 尺寸（size）

<Demo name="input-mp-sizes" description="3 档尺寸：small / medium / large（移动端节奏）。" />

## 状态（status）

<Demo name="input-mp-status" description="default / error / warning。" />

## 表单态（disabled / readonly / required）

<Demo name="input-mp-states" description="disabled / readonly / required + aria-*。" />

## Clearable + Counter

<Demo name="input-mp-clearable-count" description="clearable × 按钮 + showCount + maxlength 计数。" />

## Slots

<Demo name="input-mp-slots" description="prefix / suffix / clear-icon / count 插槽 + sn-icon 集成。" />

## 边框 / 背景 / 圆角

<Demo name="input-mp-bordered-bg-radius" description="bordered 切换 2rpx 边框；bg 三种背景色；radius 三种圆角。" />

## Textarea

`type="textarea"` 渲染多行域，独立 `.sn-input--textarea` 样式。

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `''` | 双向绑定值。 |
| `type` | `text \| password \| email \| number \| tel \| url \| search \| textarea` | `text` | 原生 input type。 |
| `size` | `small \| medium \| large` | `medium` | 高度 / 字号。 |
| `placeholder` | `string` | `''` | 占位符。 |
| `disabled` | `boolean` | `false` | 禁用。 |
| `readonly` | `boolean` | `false` | 只读。 |
| `required` | `boolean` | `false` | aria-required。 |
| `maxlength` | `number` | — | 原生 maxlength。 |
| `minlength` | `number` | — | 原生 minlength。 |
| `showCount` | `boolean` | `false` | 计数。 |
| `clearable` | `boolean` | `false` | × 清除按钮。 |
| `status` | `default \| error \| warning` | `default` | 边框 + aria-invalid。 |
| `min / max / step` | `number` | — | 数字输入限定。 |
| `rows` | `number` | `3` | textarea 行数。 |
| `bordered` | `boolean` | `true` | 2rpx 边框开关。 |
| `bg` | `surface \| transparent \| soft` | `surface` | 背景色调。 |
| `radius` | `default \| pill \| square` | `default` | 圆角预设。 |

## Events

| Event | Payload |
| --- | --- |
| `update:modelValue` | `(value)` |
| `input` | `(value, event)` |
| `change` | `(value, event)` |
| `focus` | `(event)` |
| `blur` | `(event)` |
| `clear` | — |

## Slots

| Slot | Description |
| --- | --- |
| `prefix` | 输入框左侧。 |
| `suffix` | 输入框右侧。 |
| `clear-icon` | 自定义 × 按钮内容。 |
| `count` | 自定义计数（接收 `{ current, max }`）。 |

## Source

跨端协议共享，uni 渲染器在 `@snui/uni`。