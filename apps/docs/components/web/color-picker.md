# ColorPicker · Web（PC 端）

颜色选择器。SV 拖拽面板 + hue / alpha 条 + RGB / HSL / HEX 模式 + 预设色板。

## 基础用法

<Demo name="color-picker-web-basic" description="拖拽选色，v-model 归一 hex。" />

## 模式切换（modes）

<Demo name="color-picker-web-modes" description="RGB / HSL / HEX tab，输入即换算。" />

## 透明度（showAlpha）

<Demo name="color-picker-web-alpha" description="alpha 条 + 8 位 hex / rgba 输出。" />

## 预设色板（swatches）

<Demo name="color-picker-web-swatches" description="预设色块一键选择。" />

## 可清空 / 禁用

<Demo name="color-picker-web-states" description="clearable 恢复默认色、disabled、readonly。" />

## API

### SnColorPicker Props

| Prop                | 类型                                         | 默认值                     | 说明                                       |
| ------------------- | -------------------------------------------- | -------------------------- | ------------------------------------------ |
| modelValue          | `string`                                     | `null`（渲染为 `#000000`） | 接受 hex / rgb() / hsl()；内部归一小写 hex |
| modes               | `('rgb'\|'hsl'\|'hex')[]`                    | `['rgb','hex']`            | 面板模式 tab                               |
| showAlpha           | `boolean`                                    | `false`                    | 透明度条（alpha<1 输出 8 位 hex / rgba）   |
| swatches            | `string[]`                                   | —                          | 预设色板                                   |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`                 | 尺寸                                       |
| disabled / readonly | `boolean`                                    | `false`                    | 禁用 / 只读                                |
| clearable           | `boolean`                                    | `false`                    | 恢复默认色并 emit clear                    |
| defaultShow         | `boolean`                                    | `false`                    | 初始打开面板                               |

事件：`update:modelValue`（拖拽实时）/ `change`（松手提交）/ `clear` / `focus` / `blur`。键盘：手柄 Arrow 微调 h/s/v ±1（Shift ±10）、alpha ±0.01（Shift ±0.1）。输出格式跟随激活 mode tab。

**Out of scope**（见 ai-description.md）：渐变模式、labeled-swatches、颜色关键字。

完整契约见组件 `ai-description.md`。
