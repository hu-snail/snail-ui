# ColorPicker · Web（PC 端）

颜色选择器。SV 拖拽面板 + hue / alpha 条 + 格式下拉（RGB / HSL / HEX）+ 最近使用颜色 + 预设色板，支持只使用面板（`panelOnly`）内联形态。

## 基础用法

<Demo name="color-picker-web-basic" description="拖拽选色，v-model 归一 hex。" />

## 颜色格式（modes）

通过 `modes` 设置格式下拉的选项，支持 `hex`、`rgb` 和 `hsl`。`rgb` 格式使用三个 0–255 通道输入，`hex` 格式带 `#` 前缀，输入即换算，输出格式跟随激活项。

<Demo name="color-picker-web-modes" description="Hex / RGB / HSL 格式下拉，通道输入即换算。" />

## 透明度（showAlpha）

<Demo name="color-picker-web-alpha" description="alpha 条 + 百分比输入 + 8 位 hex / rgba 输出。" />

## 预设色板（swatches）

通过 `swatches` 设置系统预设颜色。面板同时提供最近使用颜色区域（会话内自动记录，最多 10 个，去重）。

<Demo name="color-picker-web-swatches" description="预设色块一键选择。" />

## 只使用面板（panelOnly）

通过 `panelOnly` 只渲染颜色选择面板：内联展示、无触发器、不弹层定位，适合嵌入设置页、工具栏等场景。

<Demo name="color-picker-web-panel-only" description="panelOnly 内联面板，可多实例并排。" />

## 可清空 / 禁用

<Demo name="color-picker-web-states" description="clearable 恢复默认色、disabled、readonly。" />

## API

### SnColorPicker Props

| Prop                | 类型                                         | 默认值                     | 说明                                                  |
| ------------------- | -------------------------------------------- | -------------------------- | ----------------------------------------------------- |
| modelValue          | `string`                                     | `null`（渲染为 `#000000`） | 接受 hex / rgb() / hsl()；内部归一小写 hex            |
| modes               | `('rgb'\|'hsl'\|'hex')[]`                    | `['rgb','hex']`            | 面板格式下拉选项（Hex / RGB / HSL）                   |
| showAlpha           | `boolean`                                    | `false`                    | 透明度条 + 百分比输入（alpha<1 输出 8 位 hex / rgba） |
| swatches            | `string[]`                                   | —                          | 系统预设颜色色板                                      |
| panelOnly           | `boolean`                                    | `false`                    | 只使用面板：内联渲染，无触发器、不弹层                |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'`                 | 尺寸                                                  |
| disabled / readonly | `boolean`                                    | `false`                    | 禁用 / 只读                                           |
| clearable           | `boolean`                                    | `false`                    | 恢复默认色并 emit clear                               |
| defaultShow         | `boolean`                                    | `false`                    | 初始打开面板（panelOnly 下忽略）                      |

事件：`update:modelValue`（拖拽实时）/ `change`（松手提交，同时记入最近使用颜色）/ `clear` / `focus` / `blur`。键盘：手柄 Arrow 微调 h/s/v ±1（Shift ±10）、alpha ±0.01（Shift ±0.1）；格式下拉 Enter / Space / ArrowDown 打开，ArrowUp / ArrowDown 移动，Escape 关闭。输出格式跟随激活的格式项。

**Out of scope**（见 ai-description.md）：渐变模式、labeled-swatches、颜色关键字、最近颜色持久化（localStorage）。

完整契约见组件 `ai-description.md`。
