# InputNumber · Web（PC 端）

数字输入。步进按钮（长按连发）、边界 clamp、精度、stepStrictly、format / parse。

## 基础用法

<Demo name="input-number-web-basic" description="v-model + 步进按钮。" />

## 边界与步长

<Demo name="input-number-web-bounds" description="min / max / step / stepStrictly 吸附。" />

## 精度（precision）

<Demo name="input-number-web-precision" description="小数位四舍五入。" />

## 格式化（format / parse）

<Demo name="input-number-web-format" description="展示层格式化 + 解析回数字。" />

## 按钮位置 / 尺寸

<Demo name="input-number-web-layout" description="buttonPlacement: both / right；五档 size。" />

## 禁用 / 只读 / 可清空

<Demo name="input-number-web-states" description="disabled / readonly / clearable。" />

## API

### SnInputNumber Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `number \| null` | `null` | v-model（空值为 null） |
| min / max | `number` | — | 边界 clamp |
| step | `number` | `1` | 步长 |
| precision | `number` | — | 小数位 |
| stepStrictly | `boolean` | `false` | 值吸附 step 网格 |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| showButton | `boolean` | `true` | 显示步进按钮 |
| buttonPlacement | `'both' \| 'right'` | `'right'` | 按钮位置 |
| clearable | `boolean` | `false` | 清空按钮 |
| format | `(value: number) => string` | — | 展示格式化 |
| parse | `(text: string) => number \| null` | — | 解析 |
| validator | `(value: number) => boolean` | — | 提交前校验（拒绝则保留旧值） |

`role="spinbutton"`；ArrowUp/Down、PageUp/Down（×10）、Home/End 到边界。

完整契约见组件 `ai-description.md`。
