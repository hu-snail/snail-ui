# Slider · Web（PC 端）

滑块。自绘轨道 + 手柄，支持 range 双柄、marks 刻度、showSteps 步长刻度、showInput 输入框、vertical / reverse、tooltip，以及渐变 / 透明轨道与自定义气泡背景。

## 基础用法

<Demo name="slider-web-basic" description="v-model + 拖拽 / 点击轨道更新。" />

## 范围选择（range）

<Demo name="slider-web-range" description="双柄不交叉，拖拽时另一柄为边界。" />

## 步长与步长刻度（showSteps）

<Demo name="slider-web-step" description="step 吸附 + showSteps 步长刻度（可切换 Step / Show steps）。" />

## 刻度（marks）

<Demo name="slider-web-marks" description="可点击刻度跳值。" />

## 垂直 / 反向

<Demo name="slider-web-vertical" description="vertical + reverse + 垂直刻度标签。" />

## Tooltip

<Demo name="slider-web-tooltip" description="拖拽显示气泡，formatTooltip 格式化，tooltipBackground 自定义气泡背景。" />

## 显示输入框（showInput）

<Demo name="slider-web-show-input" description="showInput 在轨道旁显示数字输入框（range 为双输入框 + 分隔符，失焦 / Enter 提交生效）。" />

## 自定义样式（渐变 / 透明弥散 / 轨道粗细）

<Demo name="slider-web-custom" description="滑轨渐变与透明弥散（railBackground / railShadow）、trackBackground 渐变、railWidth 轨道粗细与 tooltip 配色。" />

## API

### SnSlider Props

| Prop                | 类型                                  | 默认值      | 说明                    |
| ------------------- | ------------------------------------- | ----------- | ----------------------- |
| modelValue          | `number \| [number, number]`          | `0`         | v-model（range 时双柄） |
| min / max           | `number`                              | `0` / `100` | 边界                    |
| step                | `number`                              | `1`         | 步长吸附                |
| range               | `boolean`                             | `false`     | 双柄范围模式            |
| disabled / readonly | `boolean`                             | `false`     | 禁用 / 只读             |
| vertical            | `boolean`                             | `false`     | 垂直方向                |
| reverse             | `boolean`                             | `false`     | 反向                    |
| tooltip             | `boolean`                             | `true`      | 拖拽气泡                |
| formatTooltip       | `(value: number) => string \| number` | —           | 气泡格式化              |
| marks               | `Record<number, string>`              | —           | 刻度                    |
| placement           | 12 方位                               | `'top'`     | 气泡方位                |
| showSteps           | `boolean`                             | `false`     | 步长刻度（min / max 之间的内部刻度） |
| showInput           | `boolean`                             | `false`     | 轨道旁数字输入框（range 双输入框）   |
| trackBackground     | `string`                              | —           | 填充轨道背景（渐变 / 透明均可）      |
| railBackground      | `string`                              | —           | 轨道背景（渐变 / 透明均可）          |
| railWidth           | `number \| string`                    | —           | 轨道粗细（水平为高、垂直为宽；数字按 px） |
| railShadow          | `string`                              | —           | 滑轨弥散光晕（box-shadow，支持半透明模糊） |
| tooltipBackground   | `string`                              | —           | 气泡背景                             |
| tooltipTextColor    | `string`                              | —           | 气泡文字颜色                         |

每柄 `role="slider"` + aria-valuenow/min/max；方向键 / Home / End / PageUp/PageDown（10×step）。

完整契约见组件 `ai-description.md`。
