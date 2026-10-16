# Radio · Web（PC 端）

单选。原生 `input[type=radio]` 语义（同名组方向键漫游），含 `SnRadioButton` 按钮形态与 `SnRadioGroup` 编排。

## 基础用法

<Demo name="radio-web-basic" description="v-model + checkedValue 匹配即选中。" />

## 单选组（RadioGroup）

<Demo name="radio-web-group" description="options 声明式 / slot 自定义，共享 name 方向键漫游。" />

## 按钮形态（RadioButton）

<Demo name="radio-web-button" description="组内去边合并圆角，button 形态。" />

## 尺寸（size）

<Demo name="radio-web-sizes" description="mini / tiny / small / medium / large 五档。" />

## 禁用 / 只读

<Demo name="radio-web-states" description="组级禁用 OR 项级禁用；readonly 视觉态。" />

## API

### SnRadio / SnRadioButton Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| checkedValue | `SnRadioValue \| null` | `null` | 该项代表的值（naive 的 `value`） |
| modelValue | `SnRadioValue \| null` | `null` | 独立绑定；组内取组值 |
| label | `string` | `''` | 文案（label slot 优先） |
| name | `string` | — | 原生 radio name（组提供） |
| disabled | `boolean` | `false` | 禁用（组级 OR） |
| readonly | `boolean` | `false` | 只读视觉态 |
| size | `'mini'\|'tiny'\|'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| status | `'default'\|'error'\|'warning'` | `'default'` | 校验状态 |

### SnRadioGroup Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `SnRadioValue \| null` | `null` | v-model |
| options | `Array<SnRadioOption \| SnRadioValue>` | `[]` | 声明式选项 |
| name | `string` | — | 共享原生 name |
| button | `boolean` | `false` | 子项渲染为按钮形态 |
| disabled / size / status | — | — | 组级级联 |

完整契约见组件 `ai-description.md`。
