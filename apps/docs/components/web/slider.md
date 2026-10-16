# Slider · Web（PC 端）

滑块。自绘轨道 + 手柄，支持 range 双柄、marks 刻度、vertical / reverse、tooltip。

## 基础用法

<Demo name="slider-web-basic" description="v-model + 拖拽 / 点击轨道更新。" />

## 范围选择（range）

<Demo name="slider-web-range" description="双柄不交叉，拖拽时另一柄为边界。" />

## 步长与边界

<Demo name="slider-web-step" description="step 吸附 + min / max 边界 clamp。" />

## 刻度（marks）

<Demo name="slider-web-marks" description="可点击刻度跳值。" />

## 垂直 / 反向

<Demo name="slider-web-vertical" description="vertical + reverse。" />

## Tooltip

<Demo name="slider-web-tooltip" description="拖拽显示气泡，formatTooltip 格式化。" />

## API

### SnSlider Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `number \| [number, number]` | `0` | v-model（range 时双柄） |
| min / max | `number` | `0` / `100` | 边界 |
| step | `number` | `1` | 步长吸附 |
| range | `boolean` | `false` | 双柄范围模式 |
| disabled / readonly | `boolean` | `false` | 禁用 / 只读 |
| vertical | `boolean` | `false` | 垂直方向 |
| reverse | `boolean` | `false` | 反向 |
| tooltip | `boolean` | `true` | 拖拽气泡 |
| formatTooltip | `(value: number) => string \| number` | — | 气泡格式化 |
| marks | `Record<number, string>` | — | 刻度 |
| placement | 12 方位 | `'top'` | 气泡方位 |

每柄 `role="slider"` + aria-valuenow/min/max；方向键 / Home / End / PageUp/PageDown（10×step）。

完整契约见组件 `ai-description.md`。
