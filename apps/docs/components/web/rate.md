# Rate · Web（PC 端）

评分。内联 SVG 星形（无 emoji 图标），支持半星、clearable、键盘打分。

## 基础用法

<Demo name="rate-web-basic" description="v-model + count。" />

## 半星（allowHalf）

<Demo name="rate-web-half" description="每星两个 50% 命中区，0.5 步进。" />

## 只读 / 禁用

<Demo name="rate-web-states" description="readonly 展示态；disabled 不可交互。" />

## 再次点击清零（clearable）

<Demo name="rate-web-clearable" description="点当前值星清零。" />

## API

### SnRate Props

| Prop                | 类型                         | 默认值     | 说明                      |
| ------------------- | ---------------------------- | ---------- | ------------------------- |
| modelValue          | `number \| null`             | `null`     | v-model                   |
| count               | `number`                     | `5`        | 星数                      |
| allowHalf           | `boolean`                    | `false`    | 半星                      |
| clearable           | `boolean`                    | `false`    | 点同值清零                |
| readonly / disabled | `boolean`                    | `false`    | 只读 / 禁用               |
| size                | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸                      |
| color               | `string`                     | —          | 选中色（写入 token 变量） |

`role="radiogroup"`，子星 `role="radio"`；ArrowLeft/Right ±1（allowHalf 时 ±0.5）。

完整契约见组件 `ai-description.md`。
